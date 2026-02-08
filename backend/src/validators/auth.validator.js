const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "email must be valid",
    "string.empty": "email is required",
    "any.required": "email is required",
  }),

  password: Joi.string().min(8).max(64).required().messages({
    "string.min": "password must be at least 8 characters",
    "string.max": "password must be at most 64 characters",
    "string.empty": "password is required",
    "any.required": "password is required",
  }),
}).unknown(false);

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "email must be valid",
    "string.empty": "email is required",
    "any.required": "email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "password is required",
    "any.required": "password is required",
  }),
}).unknown(false);

module.exports = { registerSchema, loginSchema };
