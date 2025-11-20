import cron from "node-cron";
import Post from "../models/Post";

// Runs every minute
cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    // Find all posts that should be published NOW
    const posts = await Post.find({
      status: "scheduled",
      scheduledAt: { $lte: now }
    })
      .sort({ scheduledAt: 1, createdAt: 1 }) // maintain order
      .limit(50) // safety limit
      .lean();

    for (const p of posts) {
      // Prevent double-processing (atomic update)
      const updated = await Post.findOneAndUpdate(
        { _id: p._id, status: "scheduled" }, // still scheduled?
        {
          $set: { status: "published" },
          $push: {
            publicationLogs: {
              time: new Date(),
              message: "Auto-published by scheduler"
            }
          }
        },
        { new: true }
      ).lean();

      if (!updated) continue; // skip if already processed
      console.log(`Published post: ${p._id}`);
    }
  } catch (err) {
    console.error("Scheduler error:", err);
  }
});
