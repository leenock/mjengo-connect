/**
 * Email service using Gmail SMTP (Nodemailer).
 * Set in .env: GMAIL_USER, GMAIL_APP_PASSWORD
 * Gmail App Password: https://myaccount.google.com/apppasswords (requires 2FA)
 */
import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Gmail SMTP not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env");
  }
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
  return transporter;
}

/**
 * Send an email.
 * @param {string} to - Recipient email
 * @param {string} subject - Subject line
 * @param {string} html - HTML body
 * @param {string} [text] - Plain text fallback
 * @returns {Promise<{ messageId: string }>}
 */
export async function sendEmail({ to, subject, html, text }) {
  const transport = getTransporter();
  const info = await transport.sendMail({
    from: `"Mjengo Connect" <${GMAIL_USER}>`,
    to,
    subject,
    html: html || text,
    text: text || (html ? html.replace(/<[^>]+>/g, "") : undefined),
  });
  return { messageId: info.messageId };
}

/**
 * Send password reset email with link.
 * @param {string} to - User email
 * @param {string} resetLink - Full URL with token (e.g. https://yoursite.com/auth/reset-password-email?token=xxx)
 * @param {number} [expiresMinutes=60] - For display in email
 */
export async function sendPasswordResetEmail(to, resetLink, expiresMinutes = 60) {
  const subject = "Reset your password – Mjengo Connect";
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1e293b;">Reset your password</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Reset password</a>
      </p>
      <p style="color: #64748b; font-size: 14px;">This link expires in ${expiresMinutes} minutes and can only be used once.</p>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Mjengo Connect</p>
    </div>
  `;
  return sendEmail({ to, subject, html });
}

export function isEmailConfigured() {
  return !!(GMAIL_USER && GMAIL_APP_PASSWORD);
}
