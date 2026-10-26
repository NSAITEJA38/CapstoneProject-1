import exp from "express";
export const adminRoute = exp.Router();
import { UserTypeModel } from "../models/UserModel.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";

// Apply ADMIN verification to all admin routes
adminRoute.use(verifyToken("ADMIN"));

// Get Admin Analytics / Stats
adminRoute.get("/stats", async (req, res, next) => {
  try {
    const [totalUsers, totalAuthors, totalArticles, activeArticles] = await Promise.all([
      UserTypeModel.countDocuments({ role: "USER" }),
      UserTypeModel.countDocuments({ role: "AUTHOR" }),
      ArticleModel.countDocuments(),
      ArticleModel.countDocuments({ isArticleActive: true }),
    ]);

    res.status(200).json({
      message: "Platform stats fetched",
      payload: {
        totalUsers,
        totalAuthors,
        totalArticles,
        activeArticles,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Read all users
adminRoute.get("/users", async (req, res, next) => {
  try {
    const users = await UserTypeModel.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      message: "All users fetched",
      payload: users,
    });
  } catch (err) {
    next(err);
  }
});

// Update user active status
adminRoute.patch("/users/:userId/status", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }

    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${isActive ? "unblocked" : "blocked"} successfully`,
      payload: updatedUser,
    });
  } catch (err) {
    next(err);
  }
});

// Backward-compatible Block user
adminRoute.post("/block", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const userExists = await UserTypeModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found to block" });
    }
    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "User blocked", payload: updatedUser });
  } catch (err) {
    next(err);
  }
});

// Backward-compatible Unblock user
adminRoute.post("/unblock", async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const userExists = await UserTypeModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found to unblock" });
    }
    const updatedUser = await UserTypeModel.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "User unblocked", payload: updatedUser });
  } catch (err) {
    next(err);
  }
});

// Read all articles (active and inactive) for admin moderation
adminRoute.get("/articles", async (req, res, next) => {
  try {
    const articles = await ArticleModel.find()
      .populate("author", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All articles fetched",
      payload: articles,
    });
  } catch (err) {
    next(err);
  }
});

// Admin toggle article status
adminRoute.patch("/articles/:articleId/status", async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { isArticleActive } = req.body;

    if (typeof isArticleActive !== "boolean") {
      return res.status(400).json({ message: "isArticleActive must be a boolean" });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      { isArticleActive },
      { new: true }
    ).populate("author", "firstName lastName email");

    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({
      message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
      payload: updatedArticle,
    });
  } catch (err) {
    next(err);
  }
});