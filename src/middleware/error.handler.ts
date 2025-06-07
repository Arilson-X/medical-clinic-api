import type { Request, Response, NextFunction } from "express"

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Error:", error)

  // Handle specific error types
  if (error.name === "ValidationError") {
    res.status(400).json({
      message: "Validation Error",
      error: error.message,
    })
    return
  }

  if (error.name === "QueryFailedError") {
    res.status(400).json({
      message: "Database Error",
      error: "Invalid query or constraint violation",
    })
    return
  }

  // Default error response
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? "Something went wrong" : error.message,
  })
}
