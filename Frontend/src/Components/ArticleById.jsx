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

  const currentUserId = user?._id || user?.userId || user?.id;
  const authorId = article?.author?._id || article?.author?.id || article?.author;
  const isAuthor = Boolean(
    currentUserId &&
    authorId &&
    currentUserId.toString() === authorId.toString()
  );
  const isAdmin = user?.role === "ADMIN";
  const canModify = isAuthor || isAdmin;

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

    const userName =
      user?.firstName ||
      user?.username ||
      user?.name ||
      user?.email ||
      "Unknown User";

    const payload = {
      articleId: article._id,
      comment: data.comment.trim(),
      name: userName,
      email: user?.email || "",
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

      {/* Author / Admin Actions */}
      {canModify && (
        <div className={articleActions}>
          <button className={editBtn} onClick={() => editArticle(article)}>
            Edit Article
          </button>

          <button className={deleteBtn} onClick={toggleArticleStatus}>
            {article.isArticleActive ? "Delete Article" : "Restore Article"}
          </button>
        </div>
      )}

      {/* Comment Form Section */}
      <div className="mt-12 pt-8 border-t border-[#e8e8ed]">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          Discussion ({article.comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleSubmit(addComment)} className="mb-10">
            <div className="flex flex-col gap-3">
              <textarea
                rows="3"
                {...register("comment", {
                  required: "Comment is required",
                })}
                className={inputClass}
                placeholder="Share your thoughts on this article..."
              />

              {errors.comment && (
                <p className="text-red-500 text-xs">{errors.comment.message}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-full transition shadow-sm cursor-pointer"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mb-8">
            <p className="text-gray-700 font-medium mb-3">
              Want to join the discussion?
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2 rounded-full transition"
            >
              Sign in to Comment
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {(article.comments || []).length === 0 ? (
            <p className="text-gray-400 text-sm py-4">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            (article.comments || []).map((comment, index) => {
              const commenterName =
                comment.name ||
                comment.email ||
                "Reader";
              return (
                <div
                  key={comment._id || index}
                  className="bg-gray-50 border border-gray-200/70 rounded-2xl p-5 shadow-sm hover:shadow transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                        {commenterName.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">
                        {commenterName}
                      </span>
                    </div>

                    <span className="text-xs text-gray-400">
                      {formatDate(comment.date)}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed pl-11">
                    {comment.comment}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={articleFooter}>
        Last updated: {formatDate(article.updatedAt)}
      </div>
    </div>
  );
}

export default ArticleByID;