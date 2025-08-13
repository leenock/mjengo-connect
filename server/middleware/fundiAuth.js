import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

/**
 * Middleware to authenticate JWT token for Fundi users
 */
export const authenticateFundiToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Get fundi user from database to ensure they still exist and are active
    const user = await prisma.fundi_User.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        phone: true,
        location: true,
        primary_skill: true,
        experience_level: true,
        accountStatus: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        trialEndsAt: true,
      },
    })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    if (user.accountStatus !== "ACTIVE") {
      return res.status(401).json({ message: "Account is not active" })
    }

    // Check if trial has expired and update status
    if (user.subscriptionStatus === "TRIAL" && user.trialEndsAt && new Date() > user.trialEndsAt) {
      // Update user status to expired
      await prisma.fundi_User.update({
        where: { id: user.id },
        data: { subscriptionStatus: "EXPIRED" },
      })
      user.subscriptionStatus = "EXPIRED" // Update local object
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Fundi Auth Middleware Error:", error)

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
 * Middleware to check if fundi can access premium features
 * (Either on active trial OR has premium subscription)
 */
export const requirePremiumAccess = (req, res, next) => {
  const { subscriptionStatus, subscriptionPlan } = req.user

  // Allow access if:
  // 1. User has PREMIUM plan with ACTIVE status, OR
  // 2. User is on TRIAL (regardless of plan)
  const hasPremiumAccess =
    (subscriptionPlan === "PREMIUM" && subscriptionStatus === "ACTIVE") || subscriptionStatus === "TRIAL"

  if (!hasPremiumAccess) {
    return res.status(403).json({
      message: "Premium access required. Upgrade your subscription or start your free trial.",
      upgradeRequired: true,
    })
  }
  next()
}

/**
 * Middleware to check if fundi has paid premium subscription (no trial)
 */
export const requirePaidPremium = (req, res, next) => {
  if (req.user?.subscriptionPlan !== "PREMIUM" || req.user?.subscriptionStatus !== "ACTIVE") {
    return res.status(403).json({
      message: "Paid premium subscription required",
      upgradeRequired: true,
    })
  }
  next()
}

// Export with alternative names for backward compatibility
export const requireActiveSubscription = requirePremiumAccess
export const requirePremiumSubscription = requirePaidPremium

/**
 * Middleware to add user's access level to request
 */
export const addAccessLevel = (req, res, next) => {
  const { subscriptionStatus, subscriptionPlan, trialEndsAt } = req.user

  let accessLevel = "FREE"
  let hasTrialAccess = false
  let trialDaysLeft = 0

  if (subscriptionStatus === "TRIAL" && trialEndsAt) {
    const now = new Date()
    const trialEnd = new Date(trialEndsAt)

    if (now < trialEnd) {
      hasTrialAccess = true
      trialDaysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24))
      accessLevel = "TRIAL"
    }
  } else if (subscriptionPlan === "PREMIUM" && subscriptionStatus === "ACTIVE") {
    accessLevel = "PREMIUM"
  }

  req.accessInfo = {
    level: accessLevel,
    hasTrialAccess,
    trialDaysLeft,
    canAccessPremiumFeatures: hasTrialAccess || accessLevel === "PREMIUM",
  }

  next()
}
