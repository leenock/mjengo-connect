/**
 * Fundi email-based password reset: same as client (token, hashed, expiry, one-time use).
 * Fundi_User has optional email - only users with email can use email reset.
 */
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendPasswordResetEmail } from "./emailService.js";

const prisma = new PrismaClient();

const TOKEN_BYTES = 32;
const SALT_ROUNDS = 10;
const EXPIRY_MINUTES = 60;

function generateToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

export async function findFundiByEmail(email) {
  if (!email || !email.trim()) return null;
  const normalized = email.trim().toLowerCase();
  return prisma.fundi_User.findFirst({
    where: {
      email: { equals: normalized, mode: "insensitive" },
    },
  });
}

export async function createFundiPasswordResetToken(userId) {
  const rawToken = generateToken();
  const hashedToken = await bcrypt.hash(rawToken, SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);
  await prisma.fundi_User.update({
    where: { id: userId },
    data: {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt: expiresAt,
    },
  });
  return { rawToken, expiresAt };
}

export async function requestFundiPasswordReset(email, baseUrl) {
  const user = await findFundiByEmail(email);
  if (!user) {
    return { sent: true, message: "If an account exists with this email, a reset link has been sent." };
  }
  if (!user.email) {
    return { sent: true, message: "If an account exists with this email, a reset link has been sent." };
  }
  const { rawToken } = await createFundiPasswordResetToken(user.id);
  const resetLink = `${baseUrl.replace(/\/$/, "")}/auth/fundi/reset-password-email?token=${encodeURIComponent(rawToken)}`;
  await sendPasswordResetEmail(user.email, resetLink, EXPIRY_MINUTES);
  return { sent: true, message: "If an account exists with this email, a password reset link has been sent." };
}

export async function findFundiByValidResetToken(rawToken) {
  if (!rawToken || !rawToken.trim()) return null;
  const users = await prisma.fundi_User.findMany({
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

export async function resetFundiPasswordWithToken(rawToken, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    return { success: false, message: "Password must be at least 6 characters." };
  }
  const user = await findFundiByValidResetToken(rawToken);
  if (!user) {
    return { success: false, message: "Invalid or expired reset link. Please request a new one." };
  }
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.fundi_User.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
    },
  });
  return { success: true, message: "Password has been reset. You can now log in." };
}
