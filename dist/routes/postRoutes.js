"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const postController_1 = require("../controllers/postController");
const router = (0, express_1.Router)();
// All routes require authentication
router.post("/", authMiddleware_1.auth, postController_1.createPost);
router.get("/", authMiddleware_1.auth, postController_1.getPosts);
router.get("/:id", authMiddleware_1.auth, postController_1.getPostById);
router.put("/:id", authMiddleware_1.auth, postController_1.updatePost);
router.delete("/:id", authMiddleware_1.auth, postController_1.deletePost);
exports.default = router;
