export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,  // Show all errors, not just the first
      allowUnknown: false, // Disallow extra fields
      stripUnknown: true   // Remove any unknown fields
    });

    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ errors: messages });
    }

    // Replace req.body with the validated & cleaned version
    req.body = value;

    next();
  };
};
