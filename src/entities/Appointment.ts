import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm"
import { IsNotEmpty, IsOptional, IsDateString, IsEnum } from "class-validator"
import { Patient } from "./Patient"
import { Doctor } from "./Doctor"

export enum AppointmentStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

@Entity("appointments")
export class Appointment {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ type: "timestamp" })
  @IsNotEmpty({ message: "Appointment date and time is required" })
  @IsDateString({}, { message: "Please provide a valid date and time" })
  appointmentDateTime: Date

  @Column({ type: "text", nullable: true })
  @IsOptional()
  reason: string

  @Column({ type: "text", nullable: true })
  @IsOptional()
  notes: string

  @Column({
    type: "enum",
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  @IsEnum(AppointmentStatus, { message: "Invalid appointment status" })
  status: AppointmentStatus

  @Column({ type: "int", default: 30 })
  duration: number 

  @ManyToOne(
    () => Patient,
    (patient) => patient.appointments,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "patientId" })
  patient: Patient

  @Column()
  patientId: string

  @ManyToOne(
    () => Doctor,
    (doctor) => doctor.appointments,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "doctorId" })
  doctor: Doctor

  @Column()
  doctorId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
