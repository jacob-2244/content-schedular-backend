import { Request, Response } from "express";
import Post from "../models/Post";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/authMiddleware";

// Dashboard statistics
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Total posts
    const totalPosts = await Post.countDocuments({ user: userId });

    // Count by status
    const statusCounts = await Post.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const statusMap: any = {
      scheduled: 0,
      published: 0,
      failed: 0
    };

    statusCounts.forEach((s) => {
      statusMap[s._id] = s.count;
    });

    // Group by platform
    const byPlatformAgg = await Post.aggregate([
      { $match: { user: userId } },
      { $unwind: "$platforms" },
      { $group: { _id: "$platforms", count: { $sum: 1 } } }
    ]);

    const byPlatform: any = {};
    byPlatformAgg.forEach((p) => {
      byPlatform[p._id] = p.count;
    });

    // Upcoming 5 scheduled posts
    const upcoming = await Post.find({
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
  } catch (err) {
    res.status(500).json({ message: "Dashboard error", err });
  }
};
