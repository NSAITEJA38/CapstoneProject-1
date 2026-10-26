import express from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";

import cookieParser from "cookie-parser";

import { userRoute } from "./APIs/UserApi.js";
// import { commonRoute } from "./APIs/CommonAPI.js"
import { commonRouter } from "./APIs/CommonApi.js";
import { adminRoute } from "./APIs/AdminApi.js";
import { authorRoute } from "./APIs/AuthorApi.js";

config();

const app = express();

const port = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://blog-app-frontend-m1hy.onrender.com"
].filter(Boolean);

// CORS should be before routes
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev, credentials still checked
  },
  credentials: true
}));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Routes
app.use("/user-api", userRoute);
app.use("/common-api", commonRouter);
app.use("/admin-api", adminRoute);
app.use("/author-api", authorRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {}),
  });
});

const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("Connected to MongoDB Successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }
};

connectDB();