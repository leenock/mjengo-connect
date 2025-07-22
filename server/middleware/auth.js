import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Middleware to authenticate JWT token
 */
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Get user from database to ensure they still exist and are active
    const user = await prisma.client_User.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        company: true,
        location: true,
        isActive: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "Account is inactive" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth Middleware Error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token expired" })
    }

    return res.status(500).json({ message: "Authentication error" })
  }
}

/**
 * Middleware to check if user is admin (optional, for future use)
 */
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }
  next()
}
