import express from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRoute } from "./APIs/UserApi.js";
import { commonRouter } from "./APIs/CommonApi.js";
import { adminRoute } from "./APIs/AdminApi.js";
import { authorRoute } from "./APIs/AuthorApi.js";

config();

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/$/, ""),
  "http://localhost:5173",
  "https://blog-app-frontend-m1hy.onrender.com"
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend running successfully" });
});

app.use("/user-api", userRoute);
app.use("/common-api", commonRouter);
app.use("/admin-api", adminRoute);
app.use("/author-api", authorRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing in environment variables");
    }

    await connect(process.env.DB_URL);
    console.log("Connected to MongoDB Successfully");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log("MongoDB/server startup error:", err);
    process.exit(1);
  }
};

connectDB();
