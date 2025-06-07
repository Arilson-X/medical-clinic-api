import type { Repository } from "typeorm"
import { AppDataSource } from "../config/database"
import { Patient } from "../entities/Patient"

export class PatientService {
  private patientRepository: Repository<Patient>

  constructor() {
    this.patientRepository = AppDataSource.getRepository(Patient)
  }

  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData)
    return await this.patientRepository.save(patient)
  }

  async findAll(): Promise<Patient[]> {
    return await this.patientRepository.find({
      relations: ["appointments"],
      order: { createdAt: "DESC" },
    })
  }

  async findOne(id: string): Promise<Patient | null> {
    return await this.patientRepository.findOne({
      where: { id },
      relations: ["appointments", "appointments.doctor"],
    })
  }

  async update(id: string, updateData: Partial<Patient>): Promise<Patient | null> {
    const patient = await this.patientRepository.findOne({ where: { id } })
    if (!patient) {
      return null
    }

    Object.assign(patient, updateData)
    return await this.patientRepository.save(patient)
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.patientRepository.delete(id)
    return result.affected !== 0
  }

  async findByEmail(email: string): Promise<Patient | null> {
    return await this.patientRepository.findOne({ where: { email } })
  }
}
