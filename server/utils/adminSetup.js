import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { serverLog, maskEmail } from "./appLogger.js"

const prisma = new PrismaClient()
const isDev = process.env.NODE_ENV !== "production"

/**
 * Creates the initial Super Admin user
 * This should be run once during setup
 */
export const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN" },
    })

    if (existingSuperAdmin) {
      serverLog.info("AdminSetup", "Super Admin already exists — skipping creation")
      return existingSuperAdmin
    }

    const superAdminData = {
      fullName: "Super Administrator",
      email: "superadmin@mjengo.com",
      phone: "+254700000000",
      role: "SUPER_ADMIN",
      password: "SuperAdmin@123",
      status: "ACTIVE",
    }

    const hashedPassword = await bcrypt.hash(superAdminData.password, 10)

    const superAdmin = await prisma.admin.create({
      data: {
        ...superAdminData,
        password: hashedPassword,
      },
    })

    serverLog.info("AdminSetup", "Super Admin created", {
      email: maskEmail(superAdminData.email),
      adminId: superAdmin.id,
    })

    if (isDev) {
      serverLog.warn(
        "AdminSetup",
        "Default super-admin password is set — change it after first login",
        { email: maskEmail(superAdminData.email) }
      )
    }

    return superAdmin
  } catch (error) {
    serverLog.error("AdminSetup", "Error creating Super Admin", error)
    throw error
  }
}

/**
 * Setup script to initialize admin system
 */
export const setupAdminSystem = async () => {
  try {
    serverLog.info("AdminSetup", "Setting up admin system")
    await createSuperAdmin()
    serverLog.info("AdminSetup", "Admin system setup completed")
  } catch (error) {
    serverLog.error("AdminSetup", "Admin system setup failed", error)
    throw error
  }
}

// Run setup directly
setupAdminSystem()
  .then(() => {
    serverLog.info("AdminSetup", "Setup script finished")
    process.exit(0)
  })
  .catch((error) => {
    serverLog.error("AdminSetup", "Setup script failed", error)
    process.exit(1)
  })
