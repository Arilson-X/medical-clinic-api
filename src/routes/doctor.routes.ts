import { Router } from "express"
import { DoctorController } from "../controllers/doctor.controller"
import { AuthMiddleware } from "../middleware/auth"
import { UserRole } from "../entities/User"

const router = Router()
const doctorController = new DoctorController()
const authMiddleware = new AuthMiddleware()

router.post("/", authMiddleware.authenticate, authMiddleware.authorize(UserRole.ADMIN), (req, res) =>
    doctorController.create(req, res),
)

router.get("/", authMiddleware.authenticate, (req, res) => doctorController.findAll(req, res))

router.get("/:id", authMiddleware.authenticate, authMiddleware.authorizeOwnerOrStaff, (req, res) =>
    doctorController.findOne(req, res),
)

router.put("/:id", authMiddleware.authenticate, authMiddleware.authorizeOwnerOrStaff, (req, res) =>
    doctorController.update(req, res),
)

router.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize(UserRole.ADMIN), (req, res) =>
    doctorController.delete(req, res),
)

export default router