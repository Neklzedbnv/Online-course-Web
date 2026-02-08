const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createLessonSchema = Joi.object({
  course: objectId.required().messages({
    "string.length": "course must be a valid ObjectId",
    "string.hex": "course must be a valid ObjectId",
    "any.required": "course is required",
  }),

  title: Joi.string().trim().min(3).max(120).required().messages({
    "string.empty": "title is required",
    "string.min": "title must be at least 3 characters",
    "string.max": "title must be at most 120 characters",
  }),

  content: Joi.string().trim().min(5).max(5000).required().messages({
    "string.empty": "content is required",
    "string.min": "content must be at least 5 characters",
    "string.max": "content must be at most 5000 characters",
  }),

  duration: Joi.number().integer().min(1).required().messages({
    "number.base": "duration must be a number",
    "number.integer": "duration must be an integer",
    "number.min": "duration must be >= 1",
    "any.required": "duration is required",
  }),

  videoUrl: Joi.string().trim().uri().allow("").optional().messages({
    "string.uri": "videoUrl must be a valid URL",
  }),
}).unknown(false);

const updateLessonSchema = Joi.object({
  course: objectId.optional().messages({
    "string.length": "course must be a valid ObjectId",
    "string.hex": "course must be a valid ObjectId",
  }),

  title: Joi.string().trim().min(3).max(120).optional().messages({
    "string.min": "title must be at least 3 characters",
    "string.max": "title must be at most 120 characters",
  }),

  content: Joi.string().trim().min(5).max(5000).optional().messages({
    "string.min": "content must be at least 5 characters",
    "string.max": "content must be at most 5000 characters",
  }),

  duration: Joi.number().integer().min(1).optional().messages({
    "number.base": "duration must be a number",
    "number.integer": "duration must be an integer",
    "number.min": "duration must be >= 1",
  }),

  videoUrl: Joi.string().trim().uri().allow("").optional().messages({
    "string.uri": "videoUrl must be a valid URL",
  }),
})
  .min(1)
  .unknown(false)
  .messages({
    "object.min": "At least one field must be provided",
  });

module.exports = { createLessonSchema, updateLessonSchema };
