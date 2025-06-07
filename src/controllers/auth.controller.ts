import type { Response } from "express"
import { AuthService } from "../services/auth.service"
import { validate } from "class-validator"
import { User, UserRole } from "../entities/User"
import type { AuthenticatedRequest } from "../middleware/auth"

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, profileData } = req.body

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
          message: "Email, password, first name, and last name are required",
        })
        return
      }

      // Create user instance for validation
      const user = new User()
      user.email = email
      user.password = password
      user.firstName = firstName
      user.lastName = lastName
      user.role = role || UserRole.PATIENT

      const errors = await validate(user)
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

      const result = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        role: role || UserRole.PATIENT,
        profileData,
      })

      res.status(201).json({
        message: "User registered successfully",
        data: result,
      })
    } catch (error: any) {
      res.status(400).json({
        message: "Registration failed",
        error: error.message,
      })
    }
  }

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        res.status(400).json({
          message: "Email and password are required",
        })
        return
      }

      const result = await this.authService.login(email, password)

      res.json({
        message: "Login successful",
        data: result,
      })
    } catch (error: any) {
      res.status(401).json({
        message: "Login failed",
        error: error.message,
      })
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" })
        return
      }

      const user = await this.authService.findUserById(req.user.userId)

      if (!user) {
        res.status(404).json({ message: "User not found" })
        return
      }

      res.json({
        message: "Profile retrieved successfully",
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileId: user.profileId,
          createdAt: user.createdAt,
        },
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Error retrieving profile",
        error: error.message,
      })
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" })
        return
      }

      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          message: "Current password and new password are required",
        })
        return
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          message: "New password must be at least 6 characters long",
        })
        return
      }

      await this.authService.changePassword(req.user.userId, currentPassword, newPassword)

      res.json({
        message: "Password changed successfully",
      })
    } catch (error: any) {
      res.status(400).json({
        message: "Password change failed",
        error: error.message,
      })
    }
  }

  async refreshToken(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" })
        return
      }

      const token = this.authService.generateToken({
        userId: req.user.userId,
        email: req.user.email,
        role: req.user.role,
        profileId: req.user.profileId,
      })

      res.json({
        message: "Token refreshed successfully",
        data: { token },
      })
    } catch (error: any) {
      res.status(500).json({
        message: "Token refresh failed",
        error: error.message,
      })
    }
  }
}
