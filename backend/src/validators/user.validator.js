const Joi = require("joi");

const updateProfileSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().optional().messages({
    "string.email": "email must be a valid email address",
  }),

  password: Joi.string().min(8).max(64).optional().messages({
    "string.min": "password must be at least 8 characters",
    "string.max": "password must be at most 64 characters",
  }),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "At least one field (email or password) must be provided",
  });

module.exports = { updateProfileSchema };