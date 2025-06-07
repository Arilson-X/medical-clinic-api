import { Router } from "express"
import { PatientController } from "../controllers/patient.controller"

const router = Router()
const patientController = new PatientController()

// Patient CRUD routes
router.post("/", (req, res) => patientController.create(req, res))
router.get("/", (req, res) => patientController.findAll(req, res))
router.get("/:id", (req, res) => patientController.findOne(req, res))
router.put("/:id", (req, res) => patientController.update(req, res))
router.delete("/:id", (req, res) => patientController.delete(req, res))

export default router
