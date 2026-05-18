import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";

// ─── Forms ────────────────────────────────────────────
const formCard = "bg-[#f5f5f7] rounded-2xl p-10 max-w-4xl mx-auto";
const formTitle =
  "text-2xl font-bold text-[#1d1d1f] tracking-tight text-center mb-7";
const labelClass = "text-xs font-medium text-[#6e6e73] mb-1.5 block";
const inputClass =
  "w-full bg-white border border-[#d2d2d7] rounded-xl px-4 py-2.5 text-[#1d1d1f] text-sm placeholder:text-[#a1a1a6] focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition";
const formGroup = "mb-4";
const submitBtn =
  "w-full bg-[#0066cc] text-white font-semibold py-2.5 rounded-full hover:bg-[#004499] transition-colors cursor-pointer mt-2 text-sm tracking-tight disabled:opacity-60 disabled:cursor-not-allowed";
const errorClass =
  "bg-[#ff3b30]/[0.06] text-[#cc2f26] border border-[#ff3b30]/[0.18] rounded-xl px-4 py-3 text-sm mt-2";
const loadingClass =
  "text-[#0066cc]/60 text-sm animate-pulse text-center py-10";

// EDIT ARTICLE => change / modify content of an article by author
function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const article = location.state;

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill form
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title || "");
    setValue("category", article.category || "");
    setValue("content", article.content || "");
  }, [article, setValue]);

  const updateArticle = async (data) => {
    const articleId = article?._id || article?.id || article?.articleId || id;

    if (!articleId) {
      toast.error("Article ID missing");
      return;
    }

    const updatedData = {
      ...data,
      articleId,
    };

    try {
      setLoading(true);

      const res = await axiosInstance.put(
        "/author-api/articles",
        updatedData
      );

      toast.success(res.data?.message || "Article updated successfully!");

      navigate(`/article/${articleId}`, {
        state: res.data.payload,
      });
    } catch (err) {
      console.log("Update article error:", err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update article"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!article) {
    return (
      <div className={`${formCard} mt-10 text-center`}>
        <h2 className={formTitle}>Article data not found</h2>

        <p className="text-gray-500 mb-5">
          Please open edit page from the article page again.
        </p>

        <button
          type="button"
          className={submitBtn}
          onClick={() => navigate("/author-profile/articles")}
        >
          Go Back to Articles
        </button>
      </div>
    );
  }

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>

          <input
            className={inputClass}
            {...register("title", {
              required: "Title required",
              minLength: {
                value: 5,
                message: "Title must be at least 5 characters",
              },
            })}
          />

          {errors.title && (
            <p className={errorClass}>{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>

          <select
            className={inputClass}
            {...register("category", {
              required: "Category required",
            })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>

          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>

          <textarea
            rows="14"
            className={inputClass}
            {...register("content", {
              required: "Content required",
              minLength: {
                value: 50,
                message: "Content must be at least 50 characters",
              },
            })}
          />

          {errors.content && (
            <p className={errorClass}>{errors.content.message}</p>
          )}
        </div>

        <button className={submitBtn} type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Article"}
        </button>

        {loading && <p className={loadingClass}>Updating article...</p>}
      </form>
    </div>
  );
}

export default EditArticle;