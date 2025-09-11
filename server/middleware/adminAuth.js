import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Middleware to authenticate admin users
 */
export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Verify admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
      },
    })

    if (!admin) {
      return res.status(401).json({ message: "Invalid token. Admin not found." })
    }

    if (admin.status !== "ACTIVE") {
      return res.status(401).json({ message: "Admin account is inactive." })
    }

    req.admin = admin
    next()
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}

/**
 * Middleware to check if admin is Super Admin
 */
export const superAdminMiddleware = (req, res, next) => {
  if (req.admin?.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      message: "Access denied. Super Admin privileges required.",
    })
  }
  next()
}

/**
 * Middleware to check if admin has admin or higher privileges
 */
export const adminOrHigherMiddleware = (req, res, next) => {
  const allowedRoles = ["SUPER_ADMIN", "ADMIN"]
  if (!allowedRoles.includes(req.admin?.role)) {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
    })
  }
  next()
}

/**
 * Middleware to check if admin has moderator or higher privileges
 */
export const moderatorOrHigherMiddleware = (req, res, next) => {
  const allowedRoles = ["SUPER_ADMIN", "ADMIN", "MODERATOR"]
  if (!allowedRoles.includes(req.admin?.role)) {
    return res.status(403).json({
      message: "Access denied. Moderator privileges required.",
    })
  }
  next()
}
