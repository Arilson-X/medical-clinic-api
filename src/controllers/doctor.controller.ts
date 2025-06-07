import type { Request, Response } from "express"
import { DoctorService } from "../services/doctor.service"
import { validate } from "class-validator"
import { Doctor } from "../entities/Doctor"

export class DoctorController {
  private doctorService: DoctorService

  constructor() {
    this.doctorService = new DoctorService()
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const doctor = new Doctor()
      Object.assign(doctor, req.body)

      const errors = await validate(doctor)
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

      const newDoctor = await this.doctorService.create(doctor)
      res.status(201).json({
        message: "Doctor created successfully",
        data: newDoctor,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating doctor",
        error: error.message,
      })
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const doctors = await this.doctorService.findAll()
      res.json({
        message: "Doctors retrieved successfully",
        data: doctors,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving doctors",
        error: error.message,
      })
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const doctor = await this.doctorService.findOne(id)

      if (!doctor) {
        res.status(404).json({ message: "Doctor not found" })
        return
      }

      res.json({
        message: "Doctor retrieved successfully",
        data: doctor,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving doctor",
        error: error.message,
      })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body

      const doctor = new Doctor()
      Object.assign(doctor, updateData)

      const errors = await validate(doctor, { skipMissingProperties: true })
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

      const updatedDoctor = await this.doctorService.update(id, updateData)

      if (!updatedDoctor) {
        res.status(404).json({ message: "Doctor not found" })
        return
      }

      res.json({
        message: "Doctor updated successfully",
        data: updatedDoctor,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating doctor",
        error: error.message,
      })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const deleted = await this.doctorService.delete(id)

      if (!deleted) {
        res.status(404).json({ message: "Doctor not found" })
        return
      }

      res.json({ message: "Doctor deleted successfully" })
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting doctor",
        error: error.message,
      })
    }
  }
}
