import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost
} from "../controllers/postController";

const router = Router();

// All routes require authentication
router.post("/", auth, createPost);
router.get("/", auth, getPosts);
router.get("/:id", auth, getPostById);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;
