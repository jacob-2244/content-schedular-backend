"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Post_1 = __importDefault(require("../models/Post"));
const mongoose_1 = __importDefault(require("mongoose"));
// Dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const userId = new mongoose_1.default.Types.ObjectId(req.user.id);
        // Total posts
        const totalPosts = await Post_1.default.countDocuments({ user: userId });
        // Count by status
        const statusCounts = await Post_1.default.aggregate([
            { $match: { user: userId } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const statusMap = {
            scheduled: 0,
            published: 0,
            failed: 0
        };
        statusCounts.forEach((s) => {
            statusMap[s._id] = s.count;
        });
        // Group by platform
        const byPlatformAgg = await Post_1.default.aggregate([
            { $match: { user: userId } },
            { $unwind: "$platforms" },
            { $group: { _id: "$platforms", count: { $sum: 1 } } }
        ]);
        const byPlatform = {};
        byPlatformAgg.forEach((p) => {
            byPlatform[p._id] = p.count;
        });
        // Upcoming 5 scheduled posts
        const upcoming = await Post_1.default.find({
            user: userId,
            status: "scheduled",
            scheduledAt: { $gte: new Date() }
        })
            .sort({ scheduledAt: 1 })
            .limit(5)
            .lean();
        return res.json({
            totalPosts,
            scheduled: statusMap.scheduled,
            published: statusMap.published,
            failed: statusMap.failed,
            byPlatform,
            upcoming
        });
    }
    catch (err) {
        res.status(500).json({ message: "Dashboard error", err });
    }
};
exports.getDashboardStats = getDashboardStats;
