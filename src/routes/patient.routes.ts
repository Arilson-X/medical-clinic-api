import { Router } from "express"
import { PatientController } from "../controllers/patient.controller"
import { AuthMiddleware } from "../middleware/auth"
import { UserRole } from "../entities/User"

const router = Router()
const patientController = new PatientController()
const authMiddleware = new AuthMiddleware()

router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST),
  (req, res) => patientController.create(req, res),
)

router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.authorize(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR),
  (req, res) => patientController.findAll(req, res),
)

router.get("/:id", authMiddleware.authenticate, authMiddleware.authorizeOwnerOrStaff, (req, res) =>
  patientController.findOne(req, res),
)

router.put("/:id", authMiddleware.authenticate, authMiddleware.authorizeOwnerOrStaff, (req, res) =>
  patientController.update(req, res),
)

router.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize(UserRole.ADMIN), (req, res) =>
  patientController.delete(req, res),
)

export default router
