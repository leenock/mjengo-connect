import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

  // If password is present, hash it
  if (userData.password) {
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);
  }

  // Automatically sync isActive with accountStatus
  if (userData.accountStatus !== undefined) {
    userData.isActive = userData.accountStatus === "ACTIVE";
  }

  const updatedUser = await prisma.client_User.update({
    where: { id },
    data: userData,
  });

  return updatedUser;
};
// update client user password

/**
 * Updates a client user's password using email or phone.
 * @param {string} identifier - Email or phone number.
 * @param {string} newPassword - New plain text password.
 * @returns {Promise<Object>} - Updated user details.
 */
export const updateClientUserPassword = async (identifier, newPassword) => {
  if (!identifier || typeof identifier !== "string") {
    throw new Error("A valid email or phone number is required.");
  }

  // Find the user by email or phone
  const user = await prisma.client_User.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });

  if (!user) {
    throw new Error("Client not found.");
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password
  const updatedUser = await prisma.client_User.update({
    where: { id: user.id },
    data: { password: hashedPassword },
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
      email: user.email 
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
