import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axios";
import { useAuth } from "../stores/authStore";

// ADD ARTICLE => writing a new article by author
function AddArticle() {
  const navigate = useNavigate();
  const currentUser = useAuth((state) => state.currentUser);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleForm = async (data) => {
    const authorId = currentUser?._id || currentUser?.userId || currentUser?.id;

    if (!authorId) {
      toast.error("Author not found. Please login again.");
      return;
    }

    const articleObj = {
      title: data.title,
      category: data.category,
      content: data.content,
      author: authorId,
      isArticleActive: true,
      dateOfCreation: new Date(),
      dateOfModification: new Date(),
    };

    try {
      setLoading(true);

      const res = await axiosInstance.post("/author-api/article", articleObj);

      toast.success(res.data.message || "Article created successfully");

      reset();

      navigate("/author-profile/articles");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create article"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit(handleForm)}
        className="bg-white w-full max-w-2xl shadow-lg rounded-2xl p-8 space-y-5"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Write Article
        </h1>

        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Title"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 4,
                message: "Title must be at least 4 characters",
              },
            })}
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <select
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("category", {
              required: "Category is required",
            })}
          >
            <option value="">Select Category</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>

          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <textarea
            rows="8"
            placeholder="Content"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            {...register("content", {
              required: "Content is required",
              minLength: {
                value: 10,
                message: "Content must be at least 10 characters",
              },
            })}
          />

          {errors.content && (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
          type="submit"
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
}

export default AddArticle;