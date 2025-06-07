import { Router } from "express"
import { DoctorController } from "../controllers/doctor.controller"

const router = Router()
const doctorController = new DoctorController()

// Doctor CRUD routes
router.post("/", (req, res) => doctorController.create(req, res))
router.get("/", (req, res) => doctorController.findAll(req, res))
router.get("/:id", (req, res) => doctorController.findOne(req, res))
router.put("/:id", (req, res) => doctorController.update(req, res))
router.delete("/:id", (req, res) => doctorController.delete(req, res))

export default router
