"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Valid email required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Valid email required"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
];
exports.postValidator = [
    (0, express_validator_1.body)("content")
        .isLength({ min: 1, max: 500 })
        .withMessage("Content must be 1–500 characters"),
    (0, express_validator_1.body)("platforms")
        .isArray({ min: 1 })
        .withMessage("Choose at least one platform"),
    (0, express_validator_1.body)("scheduledAt")
        .isISO8601()
        .withMessage("ScheduledAt must be a valid date")
];
