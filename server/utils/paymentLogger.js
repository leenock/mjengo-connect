const isProduction = process.env.NODE_ENV === "production";
const isVerbose =
  process.env.KOPOKOPO_VERBOSE === "true" || !isProduction;

/**
 * Mask phone numbers for logs (e.g. +2547****9927).
 */
export function maskPhone(phone) {
  if (!phone || typeof phone !== "string") return "[redacted]";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "[redacted]";
  const last4 = digits.slice(-4);
  const prefix = phone.trim().startsWith("+") ? "+" : "";
  return `${prefix}****${last4}`;
}

/**
 * Mask email addresses for logs.
 */
export function maskEmail(email) {
  if (!email || typeof email !== "string") return "[redacted]";
  const [user, domain] = email.split("@");
  if (!domain) return "[redacted]";
  return `${(user[0] || "")}***@${domain}`;
}

/**
 * Redact PII from KopoKopo STK request payloads before logging.
 */
export function sanitizeStkPayload(payload) {
  if (!payload || typeof payload !== "object") return payload;

  const sanitized = { ...payload };

  if (sanitized.subscriber && typeof sanitized.subscriber === "object") {
    sanitized.subscriber = {
      ...sanitized.subscriber,
      phone_number: maskPhone(sanitized.subscriber.phone_number),
      first_name: sanitized.subscriber.first_name ? "[redacted]" : undefined,
      last_name: sanitized.subscriber.last_name ? "[redacted]" : undefined,
      email: sanitized.subscriber.email
        ? maskEmail(sanitized.subscriber.email)
        : undefined,
    };
  }

  return sanitized;
}

function serializeError(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

/**
 * Payment logging helpers.
 * - debug: development / KOPOKOPO_VERBOSE only
 * - info: production-safe audit trail (IDs, status, amounts — no raw PII)
 * - warn/error: always on, sanitized context
 */
export const paymentLog = {
  debug(message, context) {
    if (!isVerbose) return;
    if (context !== undefined) {
      console.log(`[KopoKopo:debug] ${message}`, context);
    } else {
      console.log(`[KopoKopo:debug] ${message}`);
    }
  },

  info(message, context = {}) {
    console.log(`[KopoKopo] ${message}`, context);
  },

  warn(message, context = {}) {
    console.warn(`[KopoKopo] ${message}`, context);
  },

  error(message, error, context = {}) {
    console.error(`[KopoKopo] ${message}`, {
      ...context,
      error: serializeError(error),
    });
  },
};
