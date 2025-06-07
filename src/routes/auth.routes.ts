import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { AuthMiddleware } from "../middleware/auth"

const router = Router()
const authController = new AuthController()
const authMiddleware = new AuthMiddleware()

router.post("/register", (req, res) => authController.register(req, res))
router.post("/login", (req, res) => authController.login(req, res))

router.get("/profile", authMiddleware.authenticate, (req, res) => authController.getProfile(req, res))
router.post("/change-password", authMiddleware.authenticate, (req, res) => authController.changePassword(req, res))
router.post("/refresh-token", authMiddleware.authenticate, (req, res) => authController.refreshToken(req, res))

export default router
