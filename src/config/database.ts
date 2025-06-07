import { DataSource } from "typeorm"
import { Patient } from "../entities/Patient"
import { Doctor } from "../entities/Doctor"
import { Appointment } from "../entities/Appointment"
import { User } from "../entities/User"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "u_teste_api",
  password: process.env.DB_PASSWORD || "connect123!",
  database: process.env.DB_NAME || "medical_clinic",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [Patient, Doctor, Appointment, User],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
})
