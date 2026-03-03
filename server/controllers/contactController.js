import { sendContactFormEmail, sendLaunchNotifyEmail, isEmailConfigured } from "../services/emailService.js"

/**
 * POST /api/contact
 * Body: { name, email, phone?, subject, message }
 * Sends the inquiry to CONTACT_EMAIL_TO (e.g. info@findm.online).
 */
export async function submitContact(req, res) {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Contact form is temporarily unavailable. Please try again later or email us directly.",
      })
    }

    const { name, email, subject, message, phone } = req.body || {}

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required.",
      })
    }

    const subjectLabels = {
      general: "General inquiry",
      services: "Services",
      support: "Technical support",
      partnership: "Partnership",
      other: "Other",
    }
    const subjectLabel = subjectLabels[subject] || subject

    await sendContactFormEmail({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phone != null ? String(phone).trim() : undefined,
      subject: subjectLabel,
      message: String(message).trim(),
    })

    res.status(200).json({
      success: true,
      message: "Your message has been sent. We'll get back to you soon.",
    })
  } catch (err) {
    console.error("Contact form submit error:", err)
    res.status(500).json({
      success: false,
      message: "Failed to send your message. Please try again or email us directly.",
    })
  }
}

/**
 * POST /api/contact/notify
 * Body: { email }
 * Sends the email to CONTACT_EMAIL_TO (e.g. info@findm.online) for app launch signups.
 */
export async function submitLaunchNotify(req, res) {
  try {
    if (!isEmailConfigured()) {
      return res.status(503).json({
        success: false,
        message: "Signup is temporarily unavailable. Please try again later.",
      })
    }

    const { email } = req.body || {}
    const trimmed = email != null ? String(email).trim() : ""

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      })
    }

    await sendLaunchNotifyEmail(trimmed)

    res.status(200).json({
      success: true,
      message: "You're on the list! We'll notify you when the app launches.",
    })
  } catch (err) {
    console.error("Launch notify submit error:", err)
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    })
  }
}
