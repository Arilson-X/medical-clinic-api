import type { Repository } from "typeorm"
import { AppDataSource } from "../database/data-source"
import { Doctor } from "../entities/Doctor"

export class DoctorService {
  private doctorRepository: Repository<Doctor>

  constructor() {
    this.doctorRepository = AppDataSource.getRepository(Doctor)
  }

  async create(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData)
    return await this.doctorRepository.save(doctor)
  }

  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      relations: ["appointments"],
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: string): Promise<Doctor | null> {
    return await this.doctorRepository.findOne({
      where: { id },
      relations: ["appointments", "appointments.patient"],
    })
  }

  async update(id: string, updateData: Partial<Doctor>): Promise<Doctor | null> {
    const doctor = await this.doctorRepository.findOne({ where: { id } })
    if (!doctor) {
      return null
    }

    Object.assign(doctor, updateData)
    return await this.doctorRepository.save(doctor)
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.doctorRepository.delete(id)
    return result.affected !== 0
  }

  async findByEmail(email: string): Promise<Doctor | null> {
    return await this.doctorRepository.findOne({ where: { email } })
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      where: { specialization },
      relations: ["appointments"],
    })
  }
}
