import * as jwt from "jsonwebtoken"
import type { Repository } from "typeorm"
import { AppDataSource } from "../config/database"
import { User, UserRole } from "../entities/User"
import { Patient } from "../entities/Patient"
import { Doctor } from "../entities/Doctor"

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  profileId?: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: UserRole
    profileId?: string
  }
  token: string
}

export class AuthService {
  private userRepository: Repository<User>
  private patientRepository: Repository<Patient>
  private doctorRepository: Repository<Doctor>
  private jwtSecret: string

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.patientRepository = AppDataSource.getRepository(Patient)
    this.doctorRepository = AppDataSource.getRepository(Doctor)
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key"
  }

  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    role: UserRole
    profileData?: any
  }): Promise<LoginResponse> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create user
    const user = this.userRepository.create({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
    })

    const savedUser = await this.userRepository.save(user)

    // Create profile based on role
    let profileId: string | undefined

    if (userData.role === UserRole.PATIENT && userData.profileData) {
      const patient = this.patientRepository.create({
        ...userData.profileData,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
      const savedPatient = await this.patientRepository.save(patient)
      profileId = savedPatient.id
    } else if (userData.role === UserRole.DOCTOR && userData.profileData) {
      const doctor = this.doctorRepository.create({
        ...userData.profileData,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      })
      const savedDoctor = await this.doctorRepository.save(doctor)
      profileId = savedDoctor.id
    }

    // Update user with profileId
    if (profileId) {
      savedUser.profileId = profileId
      await this.userRepository.save(savedUser)
    }

    // Generate token
    const token = this.generateToken({
      userId: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      profileId,
    })

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role,
        profileId,
      },
      token,
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    })

    if (!user) {
      throw new Error("Invalid credentials")
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      throw new Error("Invalid credentials")
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      profileId: user.profileId,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileId: user.profileId,
      },
      token,
    }
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: "1h",
    })
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload
    } catch (error) {
      throw new Error("Invalid or expired token")
    }
  }

  async findUserById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
    })
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } })

    if (!user) {
      throw new Error("User not found")
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect")
    }

    user.password = newPassword
    await user.hashPassword()
    await this.userRepository.save(user)
  }
}
