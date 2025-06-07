import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator"
import { Appointment } from "./Appointment"

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @IsNotEmpty({ message: "First name is required" })
  @Length(2, 50, { message: "First name must be between 2 and 50 characters" })
  firstName: string

  @Column()
  @IsNotEmpty({ message: "Last name is required" })
  @Length(2, 50, { message: "Last name must be between 2 and 50 characters" })
  lastName: string

  @Column({ unique: true })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string

  @Column()
  @IsNotEmpty({ message: "Phone number is required" })
  phone: string

  @Column({ type: "date" })
  @IsNotEmpty({ message: "Date of birth is required" })
  dateOfBirth: Date

  @Column({ type: "text", nullable: true })
  @IsOptional()
  address?: string

  @Column({ type: "text", nullable: true })
  @IsOptional()
  medicalHistory?: string

  @OneToMany(
    () => Appointment,
    (appointment) => appointment.patient,
  )
  appointments: Appointment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
