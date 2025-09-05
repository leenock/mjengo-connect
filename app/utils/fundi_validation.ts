export interface FundiFormData {
  email?: string
  phone: string
  firstName?: string
  lastName?: string
  location: string
  primary_skill: string
  experience_level: string
  biography?: string
  password: string
  confirmPassword?: string
  agreeToTerms?: boolean
}

export interface ValidationErrors {
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  location?: string
  primary_skill?: string
  experience_level?: string
  biography?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
}

export const validateFundiForm = (data: FundiFormData): ValidationErrors => {
  const errors: ValidationErrors = {}

  // Email validation (optional)
  if (data.email && data.email.trim() !== "") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address."
    }
  }

  // Phone validation (required)
  if (!data.phone || data.phone.trim() === "") {
    errors.phone = "Phone number is required."
  } else {
    const phoneRegex = /^\d{10,15}$/
    if (!phoneRegex.test(data.phone.replace(/\s+/g, ""))) {
      errors.phone = "Phone number must be 10-15 digits."
    }
  }

  // First name validation (optional but if provided, must be valid)
  if (data.firstName && data.firstName.trim() !== "") {
    if (data.firstName.length < 2 || data.firstName.length > 30) {
      errors.firstName = "First name must be between 2-30 characters."
    }
  }

  // Last name validation (optional but if provided, must be valid)
  if (data.lastName && data.lastName.trim() !== "") {
    if (data.lastName.length < 2 || data.lastName.length > 30) {
      errors.lastName = "Last name must be between 2-30 characters."
    }
  }

  // Location validation (required)
  if (!data.location || data.location.trim() === "") {
    errors.location = "Location is required."
  } else if (data.location.length < 2 || data.location.length > 100) {
    errors.location = "Location must be between 2-100 characters."
  }

  // Primary skill validation (required)
  if (!data.primary_skill || data.primary_skill.trim() === "") {
    errors.primary_skill = "Primary skill is required."
  } else if (data.primary_skill.length < 2 || data.primary_skill.length > 50) {
    errors.primary_skill = "Primary skill must be between 2-50 characters."
  }

  // Experience level validation (required)
  if (!data.experience_level || data.experience_level.trim() === "") {
    errors.experience_level = "Experience level is required."
  } else {
    const validLevels = ["BEGINNER", "INTERMEDIATE", "EXPERIENCED", "EXPERT"]
    if (!validLevels.includes(data.experience_level.toUpperCase())) {
      errors.experience_level = "Please select a valid experience level."
    }
  }

  // Biography validation (optional but if provided, must be valid)
  if (data.biography && data.biography.trim() !== "") {
    if (data.biography.length < 10 || data.biography.length > 500) {
      errors.biography = "Biography must be between 10-500 characters."
    }
  }

  // Password validation (required)
  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required."
  } else if (data.password.length < 6 || data.password.length > 100) {
    errors.password = "Password must be between 6-100 characters."
  }

  // Confirm password validation (for signup)
  if (data.confirmPassword !== undefined) {
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match."
    }
  }

  // Terms agreement validation (for signup)
  if (data.agreeToTerms !== undefined && !data.agreeToTerms) {
    errors.agreeToTerms = "You must agree to the terms and conditions."
  }

  return errors
}

export const hasFormErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some((error) => error !== undefined && error !== "")
}
