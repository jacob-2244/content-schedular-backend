"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const Post_1 = __importDefault(require("../models/Post"));
// Create a new post
const createPost = async (req, res) => {
    try {
        const { content, platforms, imageUrl, scheduledAt } = req.body;
        // Validate scheduled date
        if (new Date(scheduledAt) <= new Date()) {
            return res.status(400).json({
                message: "Scheduled time must be in the future"
            });
        }
        const post = await Post_1.default.create({
            user: req.user.id,
            content,
            platforms,
            imageUrl,
            scheduledAt,
            status: "scheduled"
        });
        res.json({ message: "Post created", post });
    }
    catch (err) {
        res.status(500).json({ message: "Create error", err });
    }
};
exports.createPost = createPost;
// Get all posts (with pagination)
const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const filter = { user: req.user.id };
        const posts = await Post_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await Post_1.default.countDocuments(filter);
        res.json({
            posts,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    }
    catch (err) {
        res.status(500).json({ message: "Get error", err });
    }
};
exports.getPosts = getPosts;
// Get single post
const getPostById = async (req, res) => {
    const post = await Post_1.default.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    res.json(post);
};
exports.getPostById = getPostById;
// Update a post
const updatePost = async (req, res) => {
    const post = await Post_1.default.findOne({
        _id: req.params.id,
        user: req.user.id
    });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
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
exports.updatePost = updatePost;
// Delete a post
const deletePost = async (req, res) => {
    const post = await Post_1.default.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
};
exports.deletePost = deletePost;
