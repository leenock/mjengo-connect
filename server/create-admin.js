import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "admin@mjengo.com" },
    })

    if (existingAdmin) {
      console.log("Admin already exists!")
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10)

   // Create admin
    await prisma.admin.create({
      data: {
        email: "admin@mjengo.com",
        password: hashedPassword,
        fullName: "Super Administrator",
        phone: "+254700000000",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      },
    })

    console.log("✅ Admin created successfully!")
    console.log("Email: admin@mjengo.com")
    console.log("Password: admin123")
  } catch (error) {
    console.error("❌ Error creating admin:", error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
