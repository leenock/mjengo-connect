import { PrismaClient } from "@prisma/client"
import { hasPermission } from "../utils/permissions.js"

const prisma = new PrismaClient()

/**
 * Get dashboard statistics for admin
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const adminRole = req.admin?.role

    // Base stats that all admins can see
    const stats = {}

    if (hasPermission(adminRole, "client.read")) {
      stats.totalClients = await prisma.client_User.count()
      stats.activeClients = await prisma.client_User.count({
        where: { accountStatus: "ACTIVE" },
      })
    }

    if (hasPermission(adminRole, "fundi.read")) {
      stats.totalFundis = await prisma.fundi_User.count()
      stats.activeFundis = await prisma.fundi_User.count({
        where: { accountStatus: "ACTIVE" },
      })
    }

    if (hasPermission(adminRole, "job.read")) {
      stats.totalJobs = await prisma.job.count()
      stats.activeJobs = await prisma.job.count({
        where: { status: "ACTIVE" },
      })
      stats.pendingJobs = await prisma.job.count({
        where: { status: "PENDING" },
      })
    }

    if (hasPermission(adminRole, "support.read")) {
      stats.totalTickets = await prisma.supportTicket.count()
      stats.openTickets = await prisma.supportTicket.count({
        where: { status: "OPEN" },
      })
    }

    if (hasPermission(adminRole, "admin.read")) {
      stats.totalAdmins = await prisma.admin.count()
      stats.activeAdmins = await prisma.admin.count({
        where: { status: "ACTIVE" },
      })
    }

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      stats,
    })
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error)
    res.status(500).json({ message: "Failed to retrieve dashboard statistics" })
  }
}

/**
 * Get recent activities/logs
 */
export const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "system.logs")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    const activities = await prisma.systemLog.findMany({
      take: Number.parseInt(limit),
      orderBy: { timestamp: "desc" },
      include: {
        admin: {
          select: { fullName: true, role: true },
        },
        client: {
          select: { firstName: true, lastName: true, email: true },
        },
        fundi: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    })

    res.status(200).json({
      message: "Recent activities retrieved successfully",
      activities,
    })
  } catch (error) {
    console.error("Get Recent Activities Error:", error)
    res.status(500).json({ message: "Failed to retrieve recent activities" })
  }
}

/**
 * Get system health status
 */
export const getSystemHealth = async (req, res) => {
  try {
    const adminRole = req.admin?.role

    if (!hasPermission(adminRole, "system.logs")) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      })
    }

    // Check database connection
    const dbHealth = await prisma.$queryRaw`SELECT 1 as status`

    // Get recent error logs
    const recentErrors = await prisma.systemLog.count({
      where: {
        level: "ERROR",
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    const health = {
      database: dbHealth ? "healthy" : "unhealthy",
      server: "healthy",
      recentErrors,
      timestamp: new Date().toISOString(),
    }

    res.status(200).json({
      message: "System health retrieved successfully",
      health,
    })
  } catch (error) {
    console.error("Get System Health Error:", error)
    res.status(500).json({
      message: "Failed to retrieve system health",
      health: {
        database: "unhealthy",
        server: "unhealthy",
        recentErrors: "unknown",
        timestamp: new Date().toISOString(),
      },
    })
  }
}

/**
 * Bulk operations for admin management
 */
export const bulkUpdateAdminStatus = async (req, res) => {
  try {
    const { adminIds, status } = req.body
    const requesterId = req.admin?.id
    const requesterRole = req.admin?.role

    if (requesterRole !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "Only Super Admins can perform bulk operations",
      })
    }

    if (!adminIds || !Array.isArray(adminIds) || adminIds.length === 0) {
      return res.status(400).json({ message: "Admin IDs array is required" })
    }

    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" })
    }

    // Prevent updating own status or other super admins
    const adminsToUpdate = await prisma.admin.findMany({
      where: {
        id: { in: adminIds },
        NOT: {
          OR: [{ id: requesterId }, { role: "SUPER_ADMIN" }],
        },
      },
    })

    const updatedAdmins = await prisma.admin.updateMany({
      where: {
        id: { in: adminsToUpdate.map((admin) => admin.id) },
      },
      data: { status },
    })

    res.status(200).json({
      message: `Successfully updated ${updatedAdmins.count} admin(s)`,
      updatedCount: updatedAdmins.count,
    })
  } catch (error) {
    console.error("Bulk Update Admin Status Error:", error)
    res.status(500).json({ message: "Failed to update admin statuses" })
  }
}
