import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 5,                    // limit to 5 requests per minute
  message: "Too many attempts, try again later"
});
