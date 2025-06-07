import { Router } from "express"
import { AppointmentController } from "../controllers/appointment.controller"

const router = Router()
const appointmentController = new AppointmentController()

// Appointment CRUD routes
router.post("/", (req, res) => appointmentController.create(req, res))
router.get("/", (req, res) => appointmentController.findAll(req, res))
router.get("/:id", (req, res) => appointmentController.findOne(req, res))
router.put("/:id", (req, res) => appointmentController.update(req, res))
router.delete("/:id", (req, res) => appointmentController.delete(req, res))

// Specific appointment queries
router.get("/doctor/:doctorId", (req, res) => appointmentController.findByDoctor(req, res))
router.get("/patient/:patientId", (req, res) => appointmentController.findByPatient(req, res))

export default router
