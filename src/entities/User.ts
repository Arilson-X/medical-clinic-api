import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from "typeorm"
import { IsEmail, IsNotEmpty, Length, IsEnum } from "class-validator"
import * as bcrypt from "bcryptjs"

export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PATIENT = "patient",
  RECEPTIONIST = "receptionist",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string

  @Column()
  @IsNotEmpty({ message: "Password is required" })
  @Length(6, 100, { message: "Password must be at least 6 characters long" })
  password: string

  @Column()
  @IsNotEmpty({ message: "First name is required" })
  @Length(2, 50, { message: "First name must be between 2 and 50 characters" })
  firstName: string

  @Column()
  @IsNotEmpty({ message: "Last name is required" })
  @Length(2, 50, { message: "Last name must be between 2 and 50 characters" })
  lastName: string

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.PATIENT,
  })
  @IsEnum(UserRole, { message: "Invalid user role" })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @Column({ type: "uuid", nullable: true })
  profileId?: string 

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12)
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
  }
}
