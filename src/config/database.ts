import { DataSource } from "typeorm"
import { Patient } from "../entities/Patient"
import { Doctor } from "../entities/Doctor"
import { Appointment } from "../entities/Appointment"
import { User } from "../entities/User"
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV === "development",
  entities: [Patient, Doctor, Appointment, User],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscribers/*.ts"],
})
