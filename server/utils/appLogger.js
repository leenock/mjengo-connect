/**
 * Production-safe server logging (OTP, Twilio, setup scripts).
 * Never logs OTP codes, passwords, or full phone numbers in production.
 */

const isProduction = process.env.NODE_ENV === "production";
const isDev = !isProduction;

export function maskPhone(phone) {
  if (!phone || typeof phone !== "string") return "[redacted]";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "[redacted]";
  const last4 = digits.slice(-4);
  const prefix = phone.trim().startsWith("+") ? "+" : "";
  return `${prefix}****${last4}`;
}

export function maskEmail(email) {
  if (!email || typeof email !== "string") return "[redacted]";
  const [user, domain] = email.split("@");
  if (!domain) return "[redacted]";
  return `${(user[0] || "")}***@${domain}`;
}

function serializeError(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

export const serverLog = {
  /** Development-only diagnostic logs */
  debug(tag, message, context) {
    if (!isDev) return;
    const prefix = tag ? `[${tag}]` : "";
    if (context !== undefined) {
      console.log(`${prefix} ${message}`, context);
    } else {
      console.log(`${prefix} ${message}`);
    }
  },

  info(tag, message, context = {}) {
    const prefix = tag ? `[${tag}]` : "";
    console.log(`${prefix} ${message}`, context);
  },

  warn(tag, message, context = {}) {
    const prefix = tag ? `[${tag}]` : "";
    console.warn(`${prefix} ${message}`, context);
  },

  error(tag, message, error, context = {}) {
    const prefix = tag ? `[${tag}]` : "";
    console.error(`${prefix} ${message}`, {
      ...context,
      error: serializeError(error),
    });
  },
};
