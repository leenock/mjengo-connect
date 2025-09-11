import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

/**
 * Creates the initial Super Admin user
 * This should be run once during setup
 */
export const createSuperAdmin = async () => {
  try {
    // Check if any Super Admin exists
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN" },
    })

    if (existingSuperAdmin) {
      console.log("Super Admin already exists. Skipping creation.")
      return existingSuperAdmin
    }

    // Create Super Admin with default credentials
    const superAdminData = {
      fullName: "Super Administrator",
      email: "superadmin@mjengo.com",
      phone: "+254700000000",
      role: "SUPER_ADMIN",
      password: "SuperAdmin@123", // This should be changed after first login
      status: "ACTIVE",
    }

    const hashedPassword = await bcrypt.hash(superAdminData.password, 10)

    const superAdmin = await prisma.admin.create({
      data: {
        ...superAdminData,
        password: hashedPassword,
      },
    })

    console.log("Super Admin created successfully!")
    console.log("Email:", superAdminData.email)
    console.log("Password:", superAdminData.password)
    console.log("⚠️  IMPORTANT: Change the default password after first login!")

    return superAdmin
  } catch (error) {
    console.error("Error creating Super Admin:", error)
    throw error
  }
}

/**
 * Setup script to initialize admin system
 */
export const setupAdminSystem = async () => {
  try {
    console.log("🚀 Setting up Admin System...")

    await createSuperAdmin()

    console.log("✅ Admin System setup completed!")
  } catch (error) {
    console.error("❌ Admin System setup failed:", error)
    throw error
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupAdminSystem()
    .then(() => {
      console.log("Setup completed successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Setup failed:", error)
      process.exit(1)
    })
}
