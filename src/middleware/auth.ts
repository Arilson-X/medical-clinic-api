import type { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"
import { UserRole } from "../entities/User"

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string
    email: string
    role: UserRole
    profileId?: string
  }
}

export class AuthMiddleware {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Access token required" })
        return
      }

      const token = authHeader.substring(7) // Remove "Bearer " prefix
      const payload = this.authService.verifyToken(token)

      // Verify user still exists and is active
      const user = await this.authService.findUserById(payload.userId)
      if (!user) {
        res.status(401).json({ message: "User no longer exists" })
        return
      }

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        profileId: payload.profileId,
      }

      next()
    } catch (error: any) {
      res.status(401).json({ message: "Invalid or expired token" })
    }
  }

  authorize = (...roles: UserRole[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ message: "Authentication required" })
        return
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: "Insufficient permissions" })
        return
      }

      next()
    }
  }

  // Middleware to check if user can access their own data or is admin/receptionist
  authorizeOwnerOrStaff = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" })
      return
    }

    const { role, profileId } = req.user
    const resourceId = req.params.id

    // Admin and receptionist can access all data
    if (role === UserRole.ADMIN || role === UserRole.RECEPTIONIST) {
      next()
      return
    }

    // Users can only access their own profile data
    if (profileId === resourceId) {
      next()
      return
    }

    res.status(403).json({ message: "Access denied" })
  }
}
