"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const Post_1 = __importDefault(require("../models/Post"));
// Runs every minute
node_cron_1.default.schedule("* * * * *", async () => {
    const now = new Date();
    try {
        // Find all posts that should be published NOW
        const posts = await Post_1.default.find({
            status: "scheduled",
            scheduledAt: { $lte: now }
        })
            .sort({ scheduledAt: 1, createdAt: 1 }) // maintain order
            .limit(50) // safety limit
            .lean();
        for (const p of posts) {
            // Prevent double-processing (atomic update)
            const updated = await Post_1.default.findOneAndUpdate({ _id: p._id, status: "scheduled" }, // still scheduled?
            {
                $set: { status: "published" },
                $push: {
                    publicationLogs: {
                        time: new Date(),
                        message: "Auto-published by scheduler"
                    }
                }
            }, { new: true }).lean();
            if (!updated)
                continue; // skip if already processed
            console.log(`Published post: ${p._id}`);
        }
    }
    catch (err) {
        console.error("Scheduler error:", err);
    }
});
