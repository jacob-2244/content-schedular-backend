import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes"
import postRoutes from "./routes/postRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());




app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;
