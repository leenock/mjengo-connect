const MIN_PASSWORD_LENGTH = 10
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export function validatePasswordStrength(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required." }
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { valid: false, message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.` }
  }
  if (!STRONG_PASSWORD_REGEX.test(password)) {
    return {
      valid: false,
      message: "Password must include at least one uppercase letter, one lowercase letter, and one number.",
    }
  }
  return { valid: true }
}

export const passwordPolicy = {
  minLength: MIN_PASSWORD_LENGTH,
}
