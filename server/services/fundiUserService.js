import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { validatePasswordStrength } from "../utils/security/passwordPolicy.js"

const prisma = new PrismaClient()

// This service handles fundi user operations such as registration, login, and fetching user data.

//*****************Fundi User Service Registration Functionality********************/

/**
 * Registers a new fundi user.
 * @param {Object} userData - The user data containing email, phone, firstName, lastName, location, primary_skill, experience_level, biography, and password.
 * @returns {Promise<Object>} The newly created fundi user object.
 * @throws {Error} If the email or phone number is already in use.
 */
export const registerFundi = async (userData) => {
  const passwordCheck = validatePasswordStrength(userData?.password)
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message)
  }
  const { email, phone, password } = userData

  // Build the OR condition dynamically based on provided fields
  const orConditions = []

  if (email && email.trim() !== "") {
    orConditions.push({ email })
  }

  if (phone) {
    orConditions.push({ phone })
  }

  // Only check for existing users if we have conditions to check
  if (orConditions.length > 0) {
    const existingUser = await prisma.fundi_User.findFirst({
      where: {
        OR: orConditions,
      },
    })

    if (existingUser) {
      if (existingUser.email === email && email) {
        throw new Error("Email is already registered.")
      }
      if (existingUser.phone === phone) {
        throw new Error("Phone number is already registered.")
      }
      throw new Error("Email or phone number is already registered.")
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Set trial end date to 7 days from now
  const trialEndsAt = new Date()
  trialEndsAt.setDate(trialEndsAt.getDate() + 7)

  // Prepare data for creation, handling optional email
  const createData = {
    ...userData,
    password: hashedPassword,
    trialEndsAt,
    subscriptionStatus: "TRIAL",
    subscriptionPlan: "FREE",
  }

  // If email is empty string or null, don't include it in the creation data
  if (!email || email.trim() === "") {
    delete createData.email
  }

  const newUser = await prisma.fundi_User.create({
    data: createData,
  })

  return newUser
}

/**
 * Get all fundi users
 * @returns {Promise<Array>} Array of all fundi users
 */
export const getAllFundis = async () => {
  try {
    const fundis = await prisma.fundi_User.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        primary_skill: true,
        experience_level: true,
        biography: true,
        accountStatus: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        planStartDate: true,
        planEndDate: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return fundis
  } catch (error) {
    console.error("Error fetching fundis:", error)
    throw new Error("Failed to fetch fundis")
  }
}

/**
 * Fetches a fundi user by their ID.
 * @param {string} id - The ID of the fundi user.
 * @returns {Promise<Object>} The fundi user object.
 * @throws {Error} If the user is not found.
 */
export const getFundiById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const fundi = await prisma.fundi_User.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      location: true,
      primary_skill: true,
      experience_level: true,
      biography: true,
      accountStatus: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      trialEndsAt: true,
      planStartDate: true,
      planEndDate: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!fundi) {
    throw new Error("Fundi not found")
  }

  return fundi
}

/**
 * Update fundi user
 * @param {string} id - The ID of the fundi user
 * @param {Object} userData - The data to update
 * @returns {Promise<Object>} Updated fundi user object
 */
export const updateFundiUser = async (id, userData) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const existingUser = await prisma.fundi_User.findUnique({
    where: { id },
  })

  if (!existingUser) {
    throw new Error("Fundi not found")
  }

  // Defensive: never allow updating password or other sensitive fields via this generic updater.
  if (userData.password !== undefined) delete userData.password

  // Handle optional email update
  if (userData.email !== undefined) {
    if (!userData.email || userData.email.trim() === "") {
      userData.email = null // Set to null if empty
    }
  }

  const updatedUser = await prisma.fundi_User.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      location: true,
      primary_skill: true,
      experience_level: true,
      biography: true,
      accountStatus: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      updatedAt: true,
    },
  })

  return updatedUser
}

/**
 * Updates a fundi user's password using email or phone.
 * @param {string} identifier - Email or phone number.
 * @param {string} newPassword - New plain text password.
 * @returns {Promise<Object>} - Updated user details.
 */
export const updateFundiUserPassword = async (input) => {
  const { userId, currentPassword, newPassword: nextPassword } = input || {}
  if (!userId || typeof userId !== "string") {
    throw new Error("A valid userId is required.")
  }
  if (!currentPassword || !nextPassword) {
    throw new Error("currentPassword and newPassword are required.")
  }
  const passwordCheck = validatePasswordStrength(nextPassword)
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message)
  }

  const user = await prisma.fundi_User.findUnique({
    where: { id: userId },
    select: { id: true, password: true, email: true, phone: true, updatedAt: true },
  })

  if (!user) {
    throw new Error("Fundi not found.")
  }

  const ok = await bcrypt.compare(currentPassword, user.password)
  if (!ok) {
    throw new Error("Invalid current password.")
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(nextPassword, 10)

  // Update password
  const updatedUser = await prisma.fundi_User.update({
    where: { id: user.id },
    data: { password: hashedPassword, tokenVersion: { increment: 1 } },
    select: {
      id: true,
      email: true,
      phone: true,
      updatedAt: true,
    },
  })

  return updatedUser
}

/**
 * Deletes a fundi user and all dependent records (wallet, payments, tickets, etc.).
 * @param {string} id - The ID of the fundi user to delete.
 * @returns {Promise<Object>} - Success message.
 * @throws {Error} If the fundi user does not exist or ID is invalid.
 */
export const deleteFundiUser = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required")
  }

  const existingUser = await prisma.fundi_User.findUnique({
    where: { id },
  })

  if (!existingUser) {
    throw new Error("Fundi not found")
  }

  await prisma.$transaction(async (tx) => {
    const wallet = await tx.fundiWallet.findUnique({ where: { fundiId: id } })
    if (wallet) {
      await tx.fundiWalletTransaction.deleteMany({ where: { walletId: wallet.id } })
      await tx.fundiWallet.delete({ where: { id: wallet.id } })
    }

    await tx.paymentLog.deleteMany({ where: { fundiId: id } })
    await tx.subscription.deleteMany({ where: { fundiId: id } })

    const tickets = await tx.supportTicket.findMany({
      where: { fundiId: id },
      select: { id: true },
    })
    if (tickets.length > 0) {
      const ticketIds = tickets.map((t) => t.id)
      await tx.supportReply.deleteMany({ where: { ticketId: { in: ticketIds } } })
      await tx.supportTicket.deleteMany({ where: { fundiId: id } })
    }

    await tx.jobReport.deleteMany({ where: { reporterId: id } })
    await tx.systemLog.deleteMany({ where: { fundiId: id } })

    // SavedJob rows cascade via schema onDelete: Cascade
    await tx.fundi_User.delete({ where: { id } })
  })

  return { message: "Fundi user deleted successfully" }
}

//****************************Fundi User Service Login Functionality*****************************************/

/**
 * Authenticates a fundi user by phone/email and password.
 * @param {string} emailOrPhone
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>} Authenticated user details + JWT token.
 * @throws {Error} If authentication fails.
 */
export const loginFundiUser = async ({ emailOrPhone, password }) => {
  const user = await prisma.fundi_User.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check account status for pending and suspended only
  if (user.accountStatus === "SUSPENDED") {
    throw new Error("Your account has been suspended. Please contact support.");
  }

  if (user.accountStatus === "PENDING" || user.accountStatus === "UNDER_REVIEW") {
    throw new Error("Your account is pending approval. Please contact support.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials, please try again");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      userType: "FUNDI",
      tv: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return { token, user };
};

/**
 * Logout fundi user
 * @returns {Promise<Object>} Success message
 */
export const logoutFundiUser = async (fundiId) => {
  if (fundiId) {
    await prisma.fundi_User.update({
      where: { id: fundiId },
      data: { tokenVersion: { increment: 1 } },
    })
  }
  return { message: "User logged out successfully" }
}
