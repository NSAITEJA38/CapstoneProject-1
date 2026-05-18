import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router";

function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get("/user-api/articles");

        setArticles(res?.data?.payload || []);
      } catch (err) {
        console.log("Fetch articles error:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Failed to fetch articles"
        );
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  const handleArticleClick = (article) => {
    navigate(`/article/${article._id}`, {
      state: article,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600 font-semibold">
        Loading articles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-lg">
          Welcome to Blog Application
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          Explore articles written by different authors
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              onClick={() => handleArticleClick(article)}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer overflow-hidden"
            >
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {article.title || "Untitled Article"}
                </h2>

                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {article.category || "Uncategorized"}
                </span>

                <p className="text-gray-600 text-sm mt-4">
                  Author: {article.author?.firstName || "Unknown"}
                </p>

                <p className="text-xs text-gray-400 mt-3">
                  {formatDate(article.createdAt || article.dateOfCreation)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No articles available
        </div>
      )}
    </div>
  );
}

export default Home;