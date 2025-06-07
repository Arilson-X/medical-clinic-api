import type { Repository } from "typeorm"
import { AppDataSource } from "../database/data-source"
import { Appointment } from "../entities/Appointment"

export class AppointmentService {
  private appointmentRepository: Repository<Appointment>

  constructor() {
    this.appointmentRepository = AppDataSource.getRepository(Appointment)
  }

  async create(appointmentData: Partial<Appointment>): Promise<Appointment> {
    // Check for scheduling conflicts
    const conflictingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctorId: appointmentData.doctorId,
        appointmentDateTime: appointmentData.appointmentDateTime,
      },
    })

    if (conflictingAppointment) {
      throw new Error("Doctor is not available at this time")
    }

    const appointment = this.appointmentRepository.create(appointmentData)
    return await this.appointmentRepository.save(appointment)
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      relations: ["patient", "doctor"],
      order: { appointmentDateTime: "ASC" },
    })
  }

  async findOne(id: string): Promise<Appointment | null> {
    return await this.appointmentRepository.findOne({
      where: { id },
      relations: ["patient", "doctor"],
    })
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { doctorId },
      relations: ["patient", "doctor"],
      order: { appointmentDateTime: "ASC" },
    })
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { patientId },
      relations: ["patient", "doctor"],
      order: { appointmentDateTime: "ASC" },
    })
  }

  async update(id: string, updateData: Partial<Appointment>): Promise<Appointment | null> {
    const appointment = await this.appointmentRepository.findOne({ where: { id } })
    if (!appointment) {
      return null
    }

    // If updating appointment time, check for conflicts
    if (updateData.appointmentDateTime && updateData.appointmentDateTime !== appointment.appointmentDateTime) {
      const conflictingAppointment = await this.appointmentRepository.findOne({
        where: {
          doctorId: appointment.doctorId,
          appointmentDateTime: updateData.appointmentDateTime,
        },
      })

      if (conflictingAppointment && conflictingAppointment.id !== id) {
        throw new Error("Doctor is not available at this time")
      }
    }

    Object.assign(appointment, updateData)
    return await this.appointmentRepository.save(appointment)
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.appointmentRepository.delete(id)
    return result.affected !== 0
  }

  async findUpcoming(doctorId?: string, patientId?: string): Promise<Appointment[]> {
    const query = this.appointmentRepository
      .createQueryBuilder("appointment")
      .leftJoinAndSelect("appointment.patient", "patient")
      .leftJoinAndSelect("appointment.doctor", "doctor")
      .where("appointment.appointmentDateTime > :now", { now: new Date() })
      .orderBy("appointment.appointmentDateTime", "ASC")

    if (doctorId) {
      query.andWhere("appointment.doctorId = :doctorId", { doctorId })
    }

    if (patientId) {
      query.andWhere("appointment.patientId = :patientId", { patientId })
    }

    return await query.getMany()
  }
}
