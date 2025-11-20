import { body } from "express-validator";

export const registerValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

export const postValidator = [
  body("content")
    .isLength({ min: 1, max: 500 })
    .withMessage("Content must be 1–500 characters"),

  body("platforms")
    .isArray({ min: 1 })
    .withMessage("Choose at least one platform"),

  body("scheduledAt")
    .isISO8601()
    .withMessage("ScheduledAt must be a valid date")
];
