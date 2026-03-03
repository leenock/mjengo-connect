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

const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || "info@findm.online";

/**
 * Send contact form submission to the configured inbox (e.g. info@findm.online).
 * @param {{ name: string, email: string, phone?: string, subject: string, message: string }} data
 * @returns {Promise<{ messageId: string }>}
 */
export async function sendContactFormEmail(data) {
  const { name, email, phone, subject, message } = data;
  const to = CONTACT_EMAIL_TO;
  const emailSubject = `[Contact] ${subject} – from ${name}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #1e293b;">New contact form submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${phone ? escapeHtml(phone) : "—"}</td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Subject</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(subject)}</td></tr>
      </table>
      <h3 style="color: #334155; margin-top: 20px;">Message</h3>
      <p style="color: #475569; white-space: pre-wrap;">${escapeHtml(message)}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">MJENGO Connect – Contact form. Reply to this email to respond to ${escapeHtml(name)}.</p>
    </div>
  `;
  const transport = getTransporter();
  const info = await transport.sendMail({
    from: `"MJENGO Connect" <${GMAIL_USER}>`,
    to,
    replyTo: email,
    subject: emailSubject,
    html,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nSubject: ${subject}\n\nMessage:\n${message}`,
  });
  return { messageId: info.messageId };
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Send app launch notify signup to domain email (e.g. info@findm.online).
 * @param {string} email - Subscriber email
 * @returns {Promise<{ messageId: string }>}
 */
export async function sendLaunchNotifyEmail(email) {
  const to = CONTACT_EMAIL_TO;
  const trimmed = String(email).trim();
  const subject = "[App launch] New signup – MJENGO Connect";
  const date = new Date().toISOString();
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1e293b;">App launch notification signup</h2>
      <p style="color: #475569;">Someone wants to be notified when the MJENGO Connect mobile app launches.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(trimmed)}">${escapeHtml(trimmed)}</a></td></tr>
        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date</td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(date)}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">MJENGO Connect – Coming soon page.</p>
    </div>
  `;
  const transport = getTransporter();
  const info = await transport.sendMail({
    from: `"MJENGO Connect" <${GMAIL_USER}>`,
    to,
    replyTo: trimmed,
    subject,
    html,
    text: `App launch signup\nEmail: ${trimmed}\nDate: ${date}`,
  });
  return { messageId: info.messageId };
}
