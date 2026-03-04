/**
 * Client-only validation for support tickets.
 * Mirrors server rules so the frontend can validate without importing server/joi.
 * Server still validates with Joi on the API.
 */

const CATEGORIES = [
  "PAYMENT_ISSUES",
  "ACCOUNT_VERIFICATION",
  "HARASSMENT_REPORT",
  "GENERAL_INQUIRY",
  "OTHER",
] as const

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const

type Detail = { context?: { key: string }; message: string }

function addDetail(
  details: Detail[],
  key: string,
  message: string
): void {
  details.push({ context: { key }, message })
}

export function validateFundiSupportTicket(data: {
  fundiId: string
  subject: string
  message: string
  category: string
  priority: string
}): { error: null } | { error: { details: Detail[] } } {
  const details: Detail[] = []

  if (!data.fundiId || typeof data.fundiId !== "string" || data.fundiId.trim() === "") {
    addDetail(details, "fundiId", "Fundi ID is required")
  }

  if (!data.subject || typeof data.subject !== "string") {
    addDetail(details, "subject", "Subject is required")
  } else {
    const s = data.subject.trim()
    if (s.length < 5) addDetail(details, "subject", "Subject must be at least 5 characters long")
    else if (s.length > 200) addDetail(details, "subject", "Subject cannot exceed 200 characters")
  }

  if (!data.message || typeof data.message !== "string") {
    addDetail(details, "message", "Message is required")
  } else {
    const m = data.message.trim()
    if (m.length < 10) addDetail(details, "message", "Message must be at least 10 characters long")
    else if (m.length > 2000) addDetail(details, "message", "Message cannot exceed 2000 characters")
  }

  if (!data.category || !CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])) {
    addDetail(
      details,
      "category",
      "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER"
    )
  }

  if (!data.priority || !PRIORITIES.includes(data.priority as (typeof PRIORITIES)[number])) {
    addDetail(details, "priority", "Priority must be one of: LOW, MEDIUM, HIGH, URGENT")
  }

  if (details.length > 0) return { error: { details } }
  return { error: null }
}

export function validateSupportTicket(data: {
  clientId: string
  subject: string
  message: string
  category: string
  priority: string
}): { error: null } | { error: { details: Detail[] } } {
  const details: Detail[] = []

  if (!data.clientId || typeof data.clientId !== "string" || data.clientId.trim() === "") {
    addDetail(details, "clientId", "Client ID is required")
  }

  if (!data.subject || typeof data.subject !== "string") {
    addDetail(details, "subject", "Subject is required")
  } else {
    const s = data.subject.trim()
    if (s.length < 5) addDetail(details, "subject", "Subject must be at least 5 characters long")
    else if (s.length > 200) addDetail(details, "subject", "Subject cannot exceed 200 characters")
  }

  if (!data.message || typeof data.message !== "string") {
    addDetail(details, "message", "Message is required")
  } else {
    const m = data.message.trim()
    if (m.length < 10) addDetail(details, "message", "Message must be at least 10 characters long")
    else if (m.length > 2000) addDetail(details, "message", "Message cannot exceed 2000 characters")
  }

  if (!data.category || !CATEGORIES.includes(data.category as (typeof CATEGORIES)[number])) {
    addDetail(
      details,
      "category",
      "Category must be one of: PAYMENT_ISSUES, ACCOUNT_VERIFICATION, HARASSMENT_REPORT, GENERAL_INQUIRY, OTHER"
    )
  }

  if (!data.priority || !PRIORITIES.includes(data.priority as (typeof PRIORITIES)[number])) {
    addDetail(details, "priority", "Priority must be one of: LOW, MEDIUM, HIGH, URGENT")
  }

  if (details.length > 0) return { error: { details } }
  return { error: null }
}
