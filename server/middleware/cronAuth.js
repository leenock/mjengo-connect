import { adminAuthMiddleware } from "./adminAuth.js";

/**
 * Allows internal cron callers (X-Cron-Secret header) or authenticated admins.
 * In-process cron jobs call services directly and do not need this route.
 */
export const cronOrAdminAuth = (req, res, next) => {
  const cronSecret = process.env.CRON_SECRET;
  const provided = req.headers["x-cron-secret"];

  if (cronSecret && provided && provided === cronSecret) {
    return next();
  }

  return adminAuthMiddleware(req, res, next);
};
