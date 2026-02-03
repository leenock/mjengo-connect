/**
 * Email-based password reset: random token, hashed in DB, expiry 15–60 min, one-time use.
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "./emailService.js";

const prisma = new PrismaClient();

const TOKEN_BYTES = 32; // 32 bytes = 64 hex chars
const SALT_ROUNDS = 10;
const EXPIRY_MINUTES = 60;

/**
 * Generate a random token (hex string).
 * @returns {string}
 */
function generateToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

/**
 * Find client by email (case-insensitive).
 * @param {string} email
 * @returns {Promise<import("@prisma/client").Client_User | null>}
 */
export async function findClientByEmail(email) {
  if (!email || !email.trim()) return null;
  const normalized = email.trim().toLowerCase();
  return prisma.client_User.findFirst({
    where: {
      email: { equals: normalized, mode: "insensitive" },
    },
  });
}

/**
 * Create reset token for user: generate token, hash it, store in DB, set expiry.
 * @param {string} userId - Client_User id
 * @returns {Promise<{ rawToken: string; expiresAt: Date }>} Raw token to put in link; never store raw.
 */
export async function createPasswordResetToken(userId) {
  const rawToken = generateToken();
  const hashedToken = await bcrypt.hash(rawToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await prisma.client_User.update({
    where: { id: userId },
    data: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });

  return { rawToken, expiresAt };
}

/**
 * Request password reset: find user by email, create token, send email with link.
 * @param {string} email
 * @param {string} baseUrl - Frontend base URL (e.g. http://localhost:3000)
 * @returns {Promise<{ sent: boolean; message: string }>}
 */
export async function requestPasswordReset(email, baseUrl) {
  const user = await findClientByEmail(email);
  if (!user) {
    return { sent: true, message: "If an account exists with this email, a reset link has been sent." };
  }

  const { rawToken } = await createPasswordResetToken(user.id);
  const resetLink = `${baseUrl.replace(/\/$/, "")}/auth/reset-password-email?token=${encodeURIComponent(rawToken)}`;
  await sendPasswordResetEmail(user.email, resetLink, EXPIRY_MINUTES);

  return { sent: true, message: "If an account exists with this email, a password reset link has been sent." };
}

/**
 * Find user by valid reset token (hashed match, not expired, one-time use).
 * @param {string} rawToken - Token from link
 * @returns {Promise<import("@prisma/client").Client_User | null>}
 */
export async function findUserByValidResetToken(rawToken) {
  if (!rawToken || !rawToken.trim()) return null;

  const users = await prisma.client_User.findMany({
    where: {
      passwordResetToken: { not: null },
      passwordResetTokenExpiresAt: { gt: new Date() },
    },
  });

  for (const user of users) {
    if (!user.passwordResetToken) continue;
    const match = await bcrypt.compare(rawToken, user.passwordResetToken);
    if (match) return user;
  }
  return null;
}

/**
 * Reset password with token: validate token, update password, clear token (one-time use).
 * @param {string} rawToken
 * @param {string} newPassword - Plain password
 * @returns {Promise<{ success: boolean; message: string }>}
 */
export async function resetPasswordWithToken(rawToken, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "Password must be at least 6 characters." };
  }

  const user = await findUserByValidResetToken(rawToken);
  if (!user) {
    return { success: false, message: "Invalid or expired reset link. Please request a new one." };
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.client_User.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });

  return { success: true, message: "Password has been reset. You can now log in." };
}
