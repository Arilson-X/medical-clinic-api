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
const PORT = parseInt(process.env.PORT || '3000', 10);

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
  res.json({
    status: "OK",
    message: "Medical Clinic API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.npm_package_version || "1.0.0",
  })
})

// Readiness check (for Kubernetes/Docker health checks)
app.get("/ready", async (req, res) => {
  try {
    // Check database connection
    if (!AppDataSource.isInitialized) {
      throw new Error("Database not initialized")
    }

    await AppDataSource.query("SELECT 1")

    res.json({
      status: "READY",
      message: "API is ready to serve requests",
      database: "connected",
    })
  } catch (error) {
    res.status(503).json({
      status: "NOT_READY",
      message: "API is not ready",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
})

// Error handling middleware
app.use(errorHandler)

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...")

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
    console.log("Database connection closed")
  }

  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...")

  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy()
    console.log("Database connection closed")
  }

  process.exit(0)
})

// Initialize database and start server
const startServer = async () => {
  try {
    console.log("Initializing database connection...")
    await AppDataSource.initialize()
    console.log("Database connected successfully")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`Ready check: http://localhost:${PORT}/ready`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
