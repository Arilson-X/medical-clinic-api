import { Router } from "express"
import { AppointmentController } from "../controllers/appointment.controller"
import { AuthMiddleware } from "../middleware/auth"
import { UserRole } from "../entities/User"

const router = Router()
const appointmentController = new AppointmentController()
const authMiddleware = new AuthMiddleware()

router.post(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
    (req, res) => appointmentController.create(req, res),
)

router.get(
    "/",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR),
    (req, res) => appointmentController.findAll(req, res),
)

router.get("/:id", authMiddleware.authenticate, (req, res) => appointmentController.findOne(req, res))

router.put(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR),
    (req, res) => appointmentController.update(req, res),
)

router.delete(
    "/:id",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
    (req, res) => appointmentController.delete(req, res),
)

router.get(
    "/doctor/:doctorId",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR),
    (req, res) => appointmentController.findByDoctor(req, res),
)

router.get(
    "/patient/:patientId",
    authMiddleware.authenticate,
    authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.PATIENT),
    (req, res) => appointmentController.findByPatient(req, res),
)

export default router
