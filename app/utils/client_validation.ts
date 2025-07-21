export interface ClientValidationFormData {
  email?: string;
  phone?: string;
  location?: string;
  password?: string;
  confirmPassword?: string;
  isActive?: boolean;
}

export interface FormErrors {
  email?: string;
  phone?: string;
  location?: string;
  password?: string;
  confirmPassword?: string;
  isActive?: string;
}
export const validateForm = (
  formData: ClientValidationFormData,
  isEdit: boolean = false
): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Email is invalid";
  }

  if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
    errors.phone = "Phone number must be 10 digits";
  }

  if (formData.location && formData.location.length < 3) {
    errors.location = "Location must be at least 3 characters long";
  }

  // Password validation (only for AddVisitorModal)
  if (!isEdit) {
    if (!formData.password?.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword?.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
