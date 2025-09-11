import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// Admin Service - handles admin user operations such as registration, login, and management

//*****************Admin Service Registration & Management Functionality********************/

/**
 * Creates a new admin user.
 * @param {Object} adminData - The admin data containing fullName, email, phone, role, and password.
 * @returns {Promise<Object>} The newly created admin object.
 * @throws {Error} If the email or phone number is already in use.
 */
export const createAdmin = async (adminData) => {
  const { email, phone, password } = adminData

  // Check if admin with email or phone already exists
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  })

  if (existingAdmin) {
    if (existingAdmin.email === email) {
      throw new Error("Email is already registered.")
    }
    if (existingAdmin.phone === phone) {
      throw new Error("Phone number is already registered.")
    }
    throw new Error("Email or phone number is already registered.")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new admin
  const newAdmin = await prisma.admin.create({
    data: {
      ...adminData,
      password: hashedPassword,
    },
  })

  return newAdmin
}

/**
 * Gets all admin users.
 * @returns {Promise<Array>} Array of admin users.
 */
export const getAllAdmins = async () => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return admins
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw new Error("Failed to fetch admins")
  }
}

/**
 * Fetches an admin user by their ID.
 * @param {string} id - The ID of the admin user.
 * @returns {Promise<Object>} The admin user object.
 * @throws {Error} If the admin is not found.
 */
export const getAdminById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const admin = await prisma.admin.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!admin) {
    throw new Error("Admin not found")
  }

  return admin
}

/**
 * Updates an admin user.
 * @param {string} id - The ID of the admin user.
 * @param {Object} adminData - The updated admin data.
 * @returns {Promise<Object>} The updated admin user object.
 */
export const updateAdmin = async (id, adminData) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new Error("Admin not found")
  }

  // If password is present, hash it
  if (adminData.password) {
    const saltRounds = 10
    adminData.password = await bcrypt.hash(adminData.password, saltRounds)
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id },
    data: adminData,
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return updatedAdmin
}

/**
 * Updates an admin user's password using email or phone.
 * @param {string} identifier - Email or phone number.
 * @param {string} newPassword - New plain text password.
 * @returns {Promise<Object>} - Updated admin details.
 */
export const updateAdminPassword = async (identifier, newPassword) => {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("A valid email or phone number is required.")
  }

  // Find the admin by email or phone
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  })

  if (!admin) {
    throw new Error("Admin not found.")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  // Update password
  const updatedAdmin = await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      updatedAt: true,
    },
  })

  return updatedAdmin
}

/**
 * Deletes an admin user by ID.
 * @param {string} id - The ID of the admin user to delete.
 * @returns {Promise<Object>} - Success message.
 * @throws {Error} If the admin user does not exist or ID is invalid.
 */
export const deleteAdmin = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  // Check if the admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { id },
  })

  if (!existingAdmin) {
    throw new Error("Admin not found")
  }

  // Prevent deletion of SUPER_ADMIN if it's the last one
  if (existingAdmin.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.admin.count({
      where: { role: "SUPER_ADMIN" },
    })

    if (superAdminCount <= 1) {
      throw new Error("Cannot delete the last Super Admin")
    }
  }

  // Delete the admin
  await prisma.admin.delete({
    where: { id },
  })

  return { message: "Admin user deleted successfully" }
}

//****************************Admin Authentication Functionality*****************************************/

/**
 * Authenticates an admin user by email/phone and password.
 * @param {string} emailOrPhone
 * @param {string} password
 * @returns {Promise<{ token: string, admin: object }>} Authenticated admin details + JWT token.
 * @throws {Error} If authentication fails.
 */
export const loginAdmin = async ({ emailOrPhone, password }) => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    },
  })

  if (!admin) {
    throw new Error("Admin not found")
  }

  // Check if admin is active
  if (admin.status !== "ACTIVE") {
    throw new Error("Admin account is inactive")
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password)
  if (!isPasswordValid) {
    throw new Error("Invalid credentials, please try again")
  }

  // Update last login
  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() },
  })

  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  )

  return { token, admin }
}

/**
 * Logout admin user
 */
export const logoutAdmin = async () => {
  return { message: "Admin logged out successfully" }
}

/**
 * Updates admin role (only SUPER_ADMIN can do this)
 * @param {string} adminId - ID of admin to update
 * @param {string} newRole - New role to assign
 * @param {string} requesterId - ID of admin making the request
 * @returns {Promise<Object>} Updated admin object
 */
export const updateAdminRole = async (adminId, newRole, requesterId) => {
  // Verify requester is SUPER_ADMIN
  const requester = await prisma.admin.findUnique({
    where: { id: requesterId },
  })

  if (!requester || requester.role !== "SUPER_ADMIN") {
    throw new Error("Only Super Admins can update roles")
  }

  // Verify target admin exists
  const targetAdmin = await prisma.admin.findUnique({
    where: { id: adminId },
  })

  if (!targetAdmin) {
    throw new Error("Admin not found")
  }

  // Prevent changing the last SUPER_ADMIN's role
  if (targetAdmin.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.admin.count({
      where: { role: "SUPER_ADMIN" },
    })

    if (superAdminCount <= 1 && newRole !== "SUPER_ADMIN") {
      throw new Error("Cannot change the role of the last Super Admin")
    }
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id: adminId },
    data: { role: newRole },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return updatedAdmin
}
