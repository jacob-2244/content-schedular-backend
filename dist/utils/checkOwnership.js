"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnership = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const checkOwnership = async (postId, userId) => {
    const post = await Post_1.default.findById(postId);
    if (!post)
        return false;
    return post.user.toString() === userId;
};
exports.checkOwnership = checkOwnership;
