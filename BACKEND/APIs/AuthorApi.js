import exp from "express";
import { register } from "../services/authservice.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";

export const authorRoute = exp.Router();

// Register author public
authorRoute.post("/users", upload.single("profilePic"), async (req, res) => {
  try {
    const userObj = req.body;
    console.log("author register body:", userObj);

    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
    });

    res.status(201).json({
      message: "Author created",
      payload: newUserObj,
    });
  } catch (err) {
    console.log("author register error:", err);

    res.status(500).json({
      message: "Failed to create author",
      error: err.message,
    });
  }
});

// Create article protected route
authorRoute.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
  try {
    console.log("req body in creating article:", req.body);
    console.log("logged in author:", req.user);

    const loggedInAuthorId = req.user?.userId || req.user?._id || req.user?.id;

    if (!loggedInAuthorId) {
      return res.status(401).json({
        message: "Author id not found in token. Please login again.",
      });
    }

    const article = {
      ...req.body,
      author: req.body.author || loggedInAuthorId,
    };

    const newArticleDoc = new ArticleModel(article);

    const createdArticleDoc = await newArticleDoc.save();

    res.status(201).json({
      message: "Article created successfully",
      payload: createdArticleDoc,
    });
  } catch (err) {
    console.log("create article error:", err);

    res.status(500).json({
      message: "Failed to create article",
      error: err.message,
    });
  }
});

// Read articles of specific author protected route
authorRoute.get("/articles/:authorId", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const authorId = req.params.authorId;

    console.log("author id from params:", authorId);

    if (!authorId || authorId === "undefined") {
      return res.status(400).json({
        message: "Author ID is required",
      });
    }

    const articles = await ArticleModel.find({
      author: authorId,
      isArticleActive: true,
    }).populate("author", "firstName email");

    res.status(200).json({
      message: "Articles fetched successfully",
      payload: articles,
    });
  } catch (err) {
    console.log("get author articles error:", err);

    res.status(500).json({
      message: "Failed to fetch articles",
      error: err.message,
    });
  }
});

// Edit article protected route
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const { articleId, title, category, content } = req.body;

    console.log("update article body:", req.body);
    console.log("logged in author:", req.user);

    if (!articleId || articleId === "undefined") {
      return res.status(400).json({
        message: "Article ID is required",
      });
    }

    const loggedInAuthorId = req.user?.userId || req.user?._id || req.user?.id;

    if (!loggedInAuthorId) {
      return res.status(401).json({
        message: "Author id not found in token. Please login again.",
      });
    }

    const articleOfDB = await ArticleModel.findById(articleId);

    if (!articleOfDB) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    console.log("article author from DB:", articleOfDB.author.toString());
    console.log("logged in author id:", loggedInAuthorId.toString());

    if (articleOfDB.author.toString() !== loggedInAuthorId.toString()) {
      return res.status(403).json({
        message: "Forbidden. You can edit only your own article",
      });
    }

    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      articleId,
      {
        $set: {
          title,
          category,
          content,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Article updated successfully",
      payload: updatedArticle,
    });
  } catch (err) {
    console.log("update article error:", err);

    res.status(500).json({
      message: "Failed to update article",
      error: err.message,
    });
  }
});

// Soft delete / restore article protected route
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  try {
    const { id } = req.params;
    const { isArticleActive } = req.body;

    console.log("status update article id:", id);
    console.log("status body:", req.body);
    console.log("logged in author:", req.user);

    if (typeof isArticleActive !== "boolean") {
      return res.status(400).json({
        message: "isArticleActive must be boolean",
      });
    }

    const loggedInAuthorId = req.user?.userId || req.user?._id || req.user?.id;

    if (!loggedInAuthorId) {
      return res.status(401).json({
        message: "Author id not found in token. Please login again.",
      });
    }

    const article = await ArticleModel.findById(id);

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    if (article.author.toString() !== loggedInAuthorId.toString()) {
      return res.status(403).json({
        message: "Forbidden. You can only modify your own articles",
      });
    }

    if (article.isArticleActive === isArticleActive) {
      return res.status(400).json({
        message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
      });
    }

    article.isArticleActive = isArticleActive;
    await article.save();

    res.status(200).json({
      message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
      payload: article,
    });
  } catch (err) {
    console.log("article status update error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});