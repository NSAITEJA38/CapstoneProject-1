import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const loading = useAuth((state) => state.loading);
  const error = useAuth((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForm = async (data) => {
    const result = await login(data);

    if (result.success) {
      toast.success("Login successful");

      if (result.user?.role === "AUTHOR") {
        navigate("/author-profile/articles", { replace: true });
      } else if (result.user?.role === "USER") {
        navigate("/user-profile", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated && currentUser?.role === "AUTHOR") {
      navigate("/author-profile/articles", { replace: true });
    }

    if (isAuthenticated && currentUser?.role === "USER") {
      navigate("/user-profile", { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit(handleForm)}
        className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h1>

        <p className="text-gray-500 mb-6">
          Enter your login details to continue
        </p>

        {error && (
          <p className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            placeholder="Enter email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password", {
              required: "Password is required",
            })}
          />

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;