import "reflect-metadata"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import { AppDataSource } from "./config/database"
import { errorHandler } from "./middleware/error.handler"
import patientRoutes from "./routes/patient.routes"
import doctorRoutes from "./routes/doctor.routes"
import appointmentRoutes from "./routes/appointment.routes"
import authRoutes from "./routes/auth.routes"

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/patients", patientRoutes)
app.use("/api/doctors", doctorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/auth", authRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Medical Clinic API is running" })
})

// Error handling middleware
app.use(errorHandler)

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully")
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Database connection failed:", error)
    process.exit(1)
  })
