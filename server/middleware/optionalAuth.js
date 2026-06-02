import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  return parts.length === 2 ? parts[1] : null;
}

/**
 * Decode JWT for logout even when expired (still invalidate session server-side).
 */
function decodeLogoutJwt(token) {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
  } catch {
    return null;
  }
}

/**
 * Attach req.user when a client JWT is present; never blocks the request.
 */
export const optionalAuthenticateToken = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req);
    const decoded = decodeLogoutJwt(token);
    if (!decoded?.id) return next();

    const user = await prisma.client_User.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });
    if (user) req.user = user;
  } catch {
    // Still allow logout (cookie clear)
  }
  next();
};

/**
 * Attach req.fundiUser when a fundi JWT is present; never blocks the request.
 */
export const optionalAuthenticateFundiToken = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req);
    const decoded = decodeLogoutJwt(token);
    if (!decoded?.id) return next();

    const user = await prisma.fundi_User.findUnique({
      where: { id: decoded.id },
      select: { id: true },
    });
    if (user) req.user = user;
  } catch {
    // Still allow logout
  }
  next();
};

/**
 * Attach req.admin when a valid admin JWT is present; never blocks the request.
 */
export const optionalAdminAuth = async (req, _res, next) => {
  try {
    const token = extractBearerToken(req);
    const decoded = decodeLogoutJwt(token);
    if (!decoded?.id) return next();

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true },
    });
    if (admin) req.admin = admin;
  } catch {
    // Still allow logout
  }
  next();
};
