import type { Request, Response } from "express"
import { PatientService } from "../services/patient.service"
import { validate } from "class-validator"
import { Patient } from "../entities/Patient"

export class PatientController {
  private patientService: PatientService

  constructor() {
    this.patientService = new PatientService()
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const patient = new Patient()
      Object.assign(patient, req.body)

      const errors = await validate(patient)
      if (errors.length > 0) {
        res.status(400).json({
          message: "Validation failed",
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        })
        return
      }

      const newPatient = await this.patientService.create(patient)
      res.status(201).json({
        message: "Patient created successfully",
        data: newPatient,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating patient",
        error: error.message,
      })
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const patients = await this.patientService.findAll()
      res.json({
        message: "Patients retrieved successfully",
        data: patients,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving patients",
        error: error.message,
      })
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const patient = await this.patientService.findOne(id)

      if (!patient) {
        res.status(404).json({ message: "Patient not found" })
        return
      }

      res.json({
        message: "Patient retrieved successfully",
        data: patient,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving patient",
        error: error.message,
      })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body

      const patient = new Patient()
      Object.assign(patient, updateData)

      const errors = await validate(patient, { skipMissingProperties: true })
      if (errors.length > 0) {
        res.status(400).json({
          message: "Validation failed",
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        })
        return
      }

      const updatedPatient = await this.patientService.update(id, updateData)

      if (!updatedPatient) {
        res.status(404).json({ message: "Patient not found" })
        return
      }

      res.json({
        message: "Patient updated successfully",
        data: updatedPatient,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating patient",
        error: error.message,
      })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const deleted = await this.patientService.delete(id)

      if (!deleted) {
        res.status(404).json({ message: "Patient not found" })
        return
      }

      res.json({ message: "Patient deleted successfully" })
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting patient",
        error: error.message,
      })
    }
  }
}
