import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// email config check
app.get("/api/email-config", (req, res) => {
  res.json({
    SMTP_HOST: process.env.SMTP_HOST || "smtp.mailtrap.io",
    SMTP_PORT: process.env.SMTP_PORT || 2525,
    SMTP_USER: process.env.SMTP_USER ? "***" + process.env.SMTP_USER.slice(-4) : "Not set",
    SMTP_FROM: process.env.SMTP_FROM || "Not set",
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "Not set",
    BASE_URL: process.env.BASE_URL || "Not set"
  });
});

// public routes
app.use("/api/campaigns", campaignRoutes);
app.use("/api/track", trackRoutes);

// private routes

//
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server bắt đầu trên cổng ${PORT}`)
    });
});
