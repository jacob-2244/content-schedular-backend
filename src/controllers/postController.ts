import { Request, Response } from "express";
import Post from "../models/Post";
import { AuthRequest } from "../middlewares/authMiddleware";

// Create a new post
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, platforms, imageUrl, scheduledAt } = req.body;

    // Validate scheduled date
    if (new Date(scheduledAt) <= new Date()) {
      return res.status(400).json({
        message: "Scheduled time must be in the future"
      });
    }

    const post = await Post.create({
      user: req.user.id,
      content,
      platforms,
      imageUrl,
      scheduledAt,
      status: "scheduled"
    });

    res.json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Create error", err });
  }
};

// Get all posts (with pagination)
export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(filter);

    res.json({
      posts,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: "Get error", err });
  }
};

// Get single post
export const getPostById = async (req: AuthRequest, res: Response) => {
  const post = await Post.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json(post);
};

// Update a post
export const updatePost = async (req: AuthRequest, res: Response) => {
  const post = await Post.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!post) return res.status(404).json({ message: "Post not found" });

  // Prevent editing if published
  if (post.status === "published") {
    return res.status(400).json({ message: "Cannot edit published post" });
  }

  const { content, platforms, imageUrl, scheduledAt } = req.body;

  if (new Date(scheduledAt) <= new Date()) {
    return res.status(400).json({ message: "Scheduled time must be in the future" });
  }

  post.content = content;
  post.platforms = platforms;
  post.imageUrl = imageUrl;
  post.scheduledAt = scheduledAt;

  await post.save();

  res.json({ message: "Post updated", post });
};

// Delete a post
export const deletePost = async (req: AuthRequest, res: Response) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!post) return res.status(404).json({ message: "Post not found" });

  res.json({ message: "Post deleted" });
};
