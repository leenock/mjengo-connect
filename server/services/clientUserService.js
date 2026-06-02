import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validatePasswordStrength } from "../utils/security/passwordPolicy.js";

const prisma = new PrismaClient();

// This service handles client user operations such as registration, login, and fetching user data.

//*****************Client User Service Registration Functionality********************/

/**
 * Registers a new client user.
 * @param {Object} userData - The user data containing email, phone, and password.
 * @returns {Promise<Object>} The newly created user object.
 * @throws {Error} If the email or phone number is already in use.
 */
export const registerClient = async (userData) => {
  const { email, phone, password } = userData;
  const passwordCheck = validatePasswordStrength(password);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }

  const existingUser = await prisma.client_User.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("Email is already registered.");
    }
    if (existingUser.phone === phone) {
      throw new Error("Phone number is already registered.");
    }
    throw new Error("Email or phone number is already registered.");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.client_User.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  return newUser;
};

// get all client users
export const getAllClients = async () => {
  try {
    const clients = await prisma.client_User.findMany();
    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients");
  }
};
/**
 * Fetches a client user by their ID.
 * @param {string} id - The ID of the client user.
 * @returns {Promise<Object>} The client user object.
 * @throws {Error} If the user is not found.
 */
export const getClientById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required");
  }

  const client = await prisma.client_User.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      company: true,
      location: true,
      isActive: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  return client;
};
// update client user
export const updateClientUser = async (id, userData) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required");
  }

  const existingUser = await prisma.client_User.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("Client not found");
  }

  // Defensive: do not allow updating sensitive fields via this generic updater.
  if (userData.password !== undefined) delete userData.password;
  if (userData.isActive !== undefined) delete userData.isActive;
  if (userData.accountStatus !== undefined) delete userData.accountStatus;
  if (userData.passwordResetToken !== undefined) delete userData.passwordResetToken;
  if (userData.passwordResetTokenExpiresAt !== undefined) delete userData.passwordResetTokenExpiresAt;
  if (userData.otp !== undefined) delete userData.otp;
  if (userData.otpExpiresAt !== undefined) delete userData.otpExpiresAt;

  const updatedUser = await prisma.client_User.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      company: true,
      location: true,
      isActive: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
// update client user password

/**
 * Changes the authenticated client's password (requires current password).
 * @param {{ userId: string, currentPassword: string, newPassword: string }} input
 * @returns {Promise<Object>} - Updated user details.
 */
export const updateClientUserPassword = async (input) => {
  const { userId, currentPassword, newPassword } = input || {};
  if (!userId || typeof userId !== "string") {
    throw new Error("A valid userId is required.");
  }
  if (!currentPassword || !newPassword) {
    throw new Error("currentPassword and newPassword are required.");
  }
  const passwordCheck = validatePasswordStrength(newPassword);
  if (!passwordCheck.valid) {
    throw new Error(passwordCheck.message);
  }

  const user = await prisma.client_User.findUnique({
    where: { id: userId },
    select: { id: true, password: true, email: true, phone: true, updatedAt: true },
  });

  if (!user) {
    throw new Error("Client not found.");
  }

  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    throw new Error("Invalid current password.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  const updatedUser = await prisma.client_User.update({
    where: { id: user.id },
    data: { password: hashedPassword, tokenVersion: { increment: 1 } },
    select: {
      id: true,
      email: true,
      phone: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};
/**
 * Deletes a client user by ID.
 * @param {string} id - The ID of the client user to delete.
 * @returns {Promise<Object>} - Success message.
 * @throws {Error} If the client user does not exist or ID is invalid.
 */
export const deleteClientUser = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("A valid string ID is required");
  }

  // Check if the user exists
  const existingUser = await prisma.client_User.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new Error("Client not found");
  }

  // Delete the user
  await prisma.client_User.delete({
    where: { id },
  });

  return { message: "Client user deleted successfully" };
};

//****************************Client User Service Login Functionality*****************************************/

/**
 * Authenticates a client user by phone/email and password.
 * @param {string} emailOrPhone
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>} Authenticated user details + JWT token.
 * @throws {Error} If authentication fails.
 */
export const loginClientUser = async ({ emailOrPhone, password }) => {
  const user = await prisma.client_User.findFirst({
    where: {
      OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if account is active (both isActive and accountStatus)
  if (!user.isActive) {
    throw new Error("Account is deactivated. Please contact support.");
  }

  // Check account status
  if (user.accountStatus && user.accountStatus !== "ACTIVE") {
    const statusMessage = {
      "SUSPENDED": "Account is suspended. Please contact support.",
      "PENDING": "Account is pending approval. Please contact support.",
      "INACTIVE": "Account is inactive. Please contact support.",
      "DEACTIVATED": "Account is deactivated. Please contact support."
    }[user.accountStatus] || `Account is ${user.accountStatus.toLowerCase()}. Please contact support.`;
    
    throw new Error(statusMessage);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials, please try again");
  }

  const token = jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: "CLIENT",
      tv: user.tokenVersion,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token, user };
};

// Logout client user
export const logoutClientUser = async () => {
  return { message: "User logged out successfully" };
};
