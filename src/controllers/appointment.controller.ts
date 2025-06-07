import type { Request, Response } from "express"
import { AppointmentService } from "../services/appointment.service"
import { validate } from "class-validator"
import { Appointment } from "../entities/Appointment"

export class AppointmentController {
  private appointmentService: AppointmentService

  constructor() {
    this.appointmentService = new AppointmentService()
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const appointment = new Appointment()
      Object.assign(appointment, req.body)

      const errors = await validate(appointment)
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

      const newAppointment = await this.appointmentService.create(appointment)
      res.status(201).json({
        message: "Appointment created successfully",
        data: newAppointment,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error creating appointment",
        error: error.message,
      })
    }
  }

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const appointments = await this.appointmentService.findAll()
      res.json({
        message: "Appointments retrieved successfully",
        data: appointments,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving appointments",
        error: error.message,
      })
    }
  }

  async findByDoctor(req: Request, res: Response): Promise<void> {
    try {
      const { doctorId } = req.params
      const appointments = await this.appointmentService.findByDoctor(doctorId)

      res.json({
        message: "Doctor appointments retrieved successfully",
        data: appointments,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving doctor appointments",
        error: error.message,
      })
    }
  }

  async findByPatient(req: Request, res: Response): Promise<void> {
    try {
      const { patientId } = req.params
      const appointments = await this.appointmentService.findByPatient(patientId)

      res.json({
        message: "Patient appointments retrieved successfully",
        data: appointments,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving patient appointments",
        error: error.message,
      })
    }
  }

  async findOne(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const appointment = await this.appointmentService.findOne(id)

      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" })
        return
      }

      res.json({
        message: "Appointment retrieved successfully",
        data: appointment,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving appointment",
        error: error.message,
      })
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body

      const updatedAppointment = await this.appointmentService.update(id, updateData)

      if (!updatedAppointment) {
        res.status(404).json({ message: "Appointment not found" })
        return
      }

      res.json({
        message: "Appointment updated successfully",
        data: updatedAppointment,
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error updating appointment",
        error: error.message,
      })
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const deleted = await this.appointmentService.delete(id)

      if (!deleted) {
        res.status(404).json({ message: "Appointment not found" })
        return
      }

      res.json({ message: "Appointment deleted successfully" })
    } catch (error: any) {
      res.status(500).json({
        message: "Error deleting appointment",
        error: error.message,
      })
    }
  }
}
