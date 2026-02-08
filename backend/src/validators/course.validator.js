const Joi = require("joi");

const CATEGORY_VALUES = [
  "Programming",
  "Data Science",
  "Web Development",
  "AI Basics",
  "Blockchain",
  "Mobile Dev",
];

const PACKAGE_VALUES = ["basic", "premium", "vip"];

const priceUsdCreateSchema = Joi.object({
  basic: Joi.number().min(0).required(),
  premium: Joi.number().min(0).required(),
  vip: Joi.number().min(0).required(),
}).required();

const priceUsdUpdateSchema = Joi.object({
  basic: Joi.number().min(0).optional(),
  premium: Joi.number().min(0).optional(),
  vip: Joi.number().min(0).optional(),
}).min(1);

const createCourseSchema = Joi.object({
  courseId: Joi.number().integer().positive().required().messages({
    "any.required": "courseId is required",
    "number.base": "courseId must be a number",
    "number.integer": "courseId must be an integer",
    "number.positive": "courseId must be positive",
  }),

  title: Joi.string().trim().min(3).max(120).required().messages({
    "any.required": "title is required",
    "string.empty": "title is required",
    "string.min": "title must be at least 3 characters",
    "string.max": "title must be at most 120 characters",
  }),

  description: Joi.string().trim().min(10).max(2000).required().messages({
    "any.required": "description is required",
    "string.empty": "description is required",
    "string.min": "description must be at least 10 characters",
    "string.max": "description must be at most 2000 characters",
  }),

  category: Joi.string().valid(...CATEGORY_VALUES).required().messages({
    "any.required": "category is required",
    "string.empty": "category is required",
    "any.only": `category must be one of: ${CATEGORY_VALUES.join(", ")}`,
  }),

  packages: Joi.array().items(Joi.string().valid(...PACKAGE_VALUES)).min(1).optional(),

  priceUsd: priceUsdCreateSchema.messages({
    "any.required": "priceUsd is required",
  }),

  rating: Joi.number().min(0).max(5).optional(),
  reviews: Joi.number().integer().min(0).optional(),

  cover: Joi.string().trim().uri().required().messages({
    "any.required": "cover is required",
    "string.empty": "cover is required",
    "string.uri": "cover must be a valid URL",
  }),
}).unknown(false);

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(120).optional(),
  description: Joi.string().trim().min(10).max(2000).optional(),
  category: Joi.string().valid(...CATEGORY_VALUES).optional(),
  packages: Joi.array().items(Joi.string().valid(...PACKAGE_VALUES)).min(1).optional(),
  priceUsd: priceUsdUpdateSchema.optional(),
  rating: Joi.number().min(0).max(5).optional(),
  reviews: Joi.number().integer().min(0).optional(),
  cover: Joi.string().trim().uri().optional().messages({
    "string.uri": "cover must be a valid URL",
  }),
})
  .min(1)
  .unknown(false)
  .messages({ "object.min": "At least one field must be provided" });

module.exports = { createCourseSchema, updateCourseSchema };
