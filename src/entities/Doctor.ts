import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator"
import { Appointment } from "./Appointment"

@Entity("doctors")
export class Doctor {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column()
  @IsNotEmpty({ message: "First name is required" })
  @Length(2, 50, { message: "First name must be between 2 and 50 characters" })
  firstName!: string

  @Column()
  @IsNotEmpty({ message: "Last name is required" })
  @Length(2, 50, { message: "Last name must be between 2 and 50 characters" })
  lastName!: string

  @Column({ unique: true })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email!: string

  @Column()
  @IsNotEmpty({ message: "Phone number is required" })
  phone!: string

  @Column()
  @IsNotEmpty({ message: "Specialization is required" })
  @Length(2, 100, { message: "Specialization must be between 2 and 100 characters" })
  specialization!: string

  @Column({ unique: true })
  @IsNotEmpty({ message: "License number is required" })
  licenseNumber!: string

  @Column({ type: "int", default: 0 })
  @IsOptional()
  yearsOfExperience?: number

  @OneToMany(
    () => Appointment,
    (appointment) => appointment.doctor,
  )
  appointments!: Appointment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
