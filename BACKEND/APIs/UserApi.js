import exp from "express";
import { register } from "../services/authservice.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import { v2 as cloudinary } from "cloudinary";

export const userRoute = exp.Router();

// Register user
userRoute.post("/users", upload.single("profilePic"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    const userObj = req.body;

    // Upload image to cloudinary if file exists
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Register user
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Rollback cloudinary upload if registration fails
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
});

// Read all active articles
userRoute.get("/articles", async (req, res) => {
  try {
    const allActiveArticles = await ArticleModel.find({ isArticleActive: true })
      .populate("author", "firstName lastName email profileImageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "all active articles",
      payload: allActiveArticles,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch articles",
      error: err.message,
    });
  }
});

// Read single article by ID
userRoute.get("/article/:id", async (req, res) => {
  try {
    const articleId = req.params.id;

    const article = await ArticleModel.findById(articleId).populate(
      "author",
      "firstName lastName email profileImageUrl"
    );

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "Article fetched successfully",
      payload: article,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch article",
      error: err.message,
    });
  }
});

// Add comment to an article (accessible by any logged-in user: USER, AUTHOR, or ADMIN)
userRoute.put("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  try {
    const { articleId, comment, name, email } = req.body;

    console.log("comment body:", req.body);
    console.log("logged in user:", req.user);

    if (!articleId) {
      return res.status(400).json({
        message: "Article ID is required",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const userId = req.user?.userId || req.user?._id || req.user?.id;

    const commentUserName =
      name ||
      email ||
      req.user?.firstName ||
      req.user?.username ||
      req.user?.email ||
      "Unknown User";

    const newComment = {
      userId,
      name: commentUserName,
      email: email || req.user?.email || "",
      comment: comment.trim(),
      date: new Date(),
    };

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $push: {
          comments: newComment,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("author", "firstName email");

    if (!updatedArticle) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.status(200).json({
      message: "New comment added",
      payload: updatedArticle,
    });
  } catch (err) {
    console.log("add comment error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});