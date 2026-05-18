import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useAuth } from "../stores/authStore";
import { toast } from "react-hot-toast";
import {
  articlePageWrapper,
  articleHeader,
  articleCategory,
  articleMainTitle,
  articleAuthorRow,
  authorInfo,
  articleContent,
  articleFooter,
  articleActions,
  editBtn,
  deleteBtn,
  loadingClass,
  errorClass,
  inputClass,
} from "../styles/common";
import { useForm } from "react-hook-form";

// READ an ARTICLE by ID
function ArticleByID() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(location.state || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(`/user-api/article/${id}`);
        setArticle(res.data.payload);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load article"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Delete & restore article
  const toggleArticleStatus = async () => {
    const newStatus = !article.isArticleActive;

    const confirmMsg = newStatus
      ? "Restore this article?"
      : "Delete this article?";

    if (!window.confirm(confirmMsg)) return;

    try {
      setError(null);

      const res = await axiosInstance.patch(
        `/author-api/articles/${id}/status`,
        {
          isArticleActive: newStatus,
        }
      );

      setArticle(res.data.payload);
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Operation failed";

      if (err.response?.status === 400) {
        toast(msg);
      } else {
        setError(msg);
        toast.error(msg);
      }
    }
  };

  // Edit article
  const editArticle = (articleObj) => {
    navigate(`/edit-article/${articleObj._id}`, {
      state: articleObj,
    });
  };

  // Post comment by user
  const addComment = async (data) => {
    if (!data.comment?.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const payload = {
      articleId: article._id,
      comment: data.comment.trim(),
    };

    try {
      setError(null);

      const res = await axiosInstance.put("/user-api/articles", payload);

      toast.success(res.data.message);
      setArticle(res.data.payload);
      reset();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add comment";

      toast.error(msg);
      setError(msg);
    }
  };

  if (loading) return <p className={loadingClass}>Loading article...</p>;

  if (error) return <p className={errorClass}>{error}</p>;

  if (!article) return null;

  return (
    <div className={articlePageWrapper}>
      {/* Header */}
      <div className={articleHeader}>
        <span className={articleCategory}>{article.category}</span>

        <h1 className={`${articleMainTitle} uppercase`}>{article.title}</h1>

        <div className={articleAuthorRow}>
          <div className={authorInfo}>
            ✍️ {article.author?.firstName || "Author"}
          </div>

          <div>{formatDate(article.createdAt)}</div>
        </div>
      </div>

      {/* Content */}
      <div className={articleContent}>{article.content}</div>

      {/* AUTHOR actions */}
      {user?.role === "AUTHOR" && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete" : "Restore"}
          </button>
        </div>
      )}

      {/* USER comment form */}
      {user?.role === "USER" && (
        <div className={articleActions}>
          <form onSubmit={handleSubmit(addComment)}>
            <input
              type="text"
              {...register("comment", {
                required: "Comment is required",
              })}
              className={inputClass}
              placeholder="Write your comment here..."
            />

            {errors.comment && (
              <p className="text-red-500 text-sm mt-2">
                {errors.comment.message}
              </p>
            )}

            <button
              type="submit"
              className="bg-amber-600 text-white px-5 py-2 rounded-2xl mt-5"
            >
              Add comment
            </button>
          </form>
        </div>
      )}

      {/* Comments */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Comments</h2>

        {(article.comments || []).length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          (article.comments || []).map((comment, index) => (
            <div
              key={comment._id || index}
              className="bg-gray-300 p-6 rounded-2xl mt-4"
            >
              <p className="uppercase text-pink-400 font-bold mb-3">
                {comment.user?.email || "Unknown user"}
              </p>

              <p>{comment.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={articleFooter}>
        Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;