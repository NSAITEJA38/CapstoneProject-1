import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import {
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  loadingClass,
  errorClass,
  emptyStateClass,
  articleStatusActive,
  articleStatusDeleted,
} from "../styles/common";

// AUTHOR ARTICLES => shows all articles published by specific author
function AuthorArticles() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const getAuthorArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const authorId = user?._id || user?.userId || user?.id;

        if (!authorId) {
          setError("Author ID not found. Please login again.");
          return;
        }

        const res = await axiosInstance.get(
          `/author-api/articles/${encodeURIComponent(authorId)}`
        );

        setArticles(res.data?.payload || []);
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to fetch articles"
        );
      } finally {
        setLoading(false);
      }
    };

    getAuthorArticles();
  }, [user]);

  const openArticle = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const editArticle = (article) => {
    navigate(`/edit-article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
    });
  };

  if (!user) {
    return <p className={loadingClass}>Loading author details...</p>;
  }

  if (loading) {
    return <p className={loadingClass}>Loading articles...</p>;
  }

  if (error) {
    return <p className={errorClass}>{error}</p>;
  }

  if (articles.length === 0) {
    return (
      <div className={emptyStateClass}>
        You haven't published any articles yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {articles.map((article, index) => (
        <div
          key={article._id || index}
          className={`${articleCardClass} relative flex flex-col min-h-[260px]`}
        >
          <span
            className={
              article.isArticleActive
                ? articleStatusActive
                : articleStatusDeleted
            }
          >
            {article.isArticleActive ? "ACTIVE" : "DELETED"}
          </span>

          <div className="flex flex-col gap-2 mb-5">
            <p className={articleMeta}>
              {article.category || "Uncategorized"}
            </p>

            <p className={articleTitle}>
              {article.title || "Untitled Article"}
            </p>

            <p className={articleExcerpt}>
              {article.content
                ? `${article.content.slice(0, 70)}...`
                : "No content available"}
            </p>

            {(article.dateOfCreation || article.createdAt) && (
              <p className="text-xs text-gray-400">
                {formatDate(article.dateOfCreation || article.createdAt)}
              </p>
            )}
          </div>

          <div className="mt-auto flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => openArticle(article)}
              className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Read
            </button>

            <button
              type="button"
              onClick={() => editArticle(article)}
              className="flex-1 border border-blue-600 text-blue-600 text-sm font-semibold py-2 rounded-lg hover:bg-blue-50 transition"
            >
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AuthorArticles;