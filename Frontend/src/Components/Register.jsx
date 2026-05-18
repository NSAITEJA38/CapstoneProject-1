import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axiosInstance from "../api/axios";
import {
  User,
  PenLine,
  Mail,
  Lock,
  Upload,
  ArrowRight,
  ImagePlus,
} from "lucide-react";

// REGISTER => both USER / AUTHORS to SIGN UP
function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const selectedRole = watch("role");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleForm = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      const { role, profileImageUrl, ...userObj } = data;

      if (!role) {
        setError("Please select a role");
        return;
      }

      formData.append("role", role);

      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });

      if (profileImageUrl && profileImageUrl[0]) {
        formData.append("profilePic", profileImageUrl[0]);
      }

      const url =
        role === "AUTHOR" ? "/author-api/users" : "/user-api/users";

      const res = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("SUCCESS", res.data);

      navigate("/login");
    } catch (err) {
      console.log("Failed:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <h1 className="text-xl font-semibold text-slate-800">
            Creating your account...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid lg:grid-cols-[0.9fr_1.1fr] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-950 text-white p-10">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-8">
              <PenLine size={28} />
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Start your writing journey today.
            </h1>

            <p className="text-slate-300 mt-5 leading-relaxed">
              Create your account as a reader or author and become part of our
              blogging platform.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-lg">Why join?</h3>
              <p className="text-sm text-slate-300 mt-2">
                Read blogs, publish articles, manage your profile, and connect
                with your audience.
              </p>
            </div>

            <p className="text-sm text-slate-400">
              Already registered? Login and continue your journey.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2">
              Fill your details to register
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(handleForm)} className="space-y-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Select Role
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label
                  className={`border rounded-2xl p-4 cursor-pointer transition flex items-center gap-4 ${
                    selectedRole === "USER"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="USER"
                    {...register("role", { required: "Select role" })}
                    className="hidden"
                  />

                  <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <User size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">User</h3>
                    <p className="text-sm text-slate-500">Read and explore</p>
                  </div>
                </label>

                <label
                  className={`border rounded-2xl p-4 cursor-pointer transition flex items-center gap-4 ${
                    selectedRole === "AUTHOR"
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    value="AUTHOR"
                    {...register("role", { required: "Select role" })}
                    className="hidden"
                  />

                  <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <PenLine size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">Author</h3>
                    <p className="text-sm text-slate-500">Write and publish</p>
                  </div>
                </label>
              </div>

              {errors.role && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>

                <input
                  type="text"
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: "First name required",
                    minLength: {
                      value: 3,
                      message: "Minimum length is 3",
                    },
                    maxLength: {
                      value: 8,
                      message: "Maximum length is 8",
                    },
                  })}
                  className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                />

                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>

                <input
                  type="text"
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: "Last name required",
                    minLength: {
                      value: 3,
                      message: "Minimum length is 3",
                    },
                    maxLength: {
                      value: 10,
                      message: "Maximum length is 10",
                    },
                  })}
                  className="w-full border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                />

                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="example@gmail.com"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="w-full pl-12 pr-4 border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password required",
                    minLength: {
                      value: 4,
                      message: "Minimum length is 4",
                    },
                    maxLength: {
                      value: 16,
                      message: "Maximum length is 16",
                    },
                  })}
                  className="w-full pl-12 pr-4 border border-slate-300 bg-slate-50 p-3 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Profile Picture
              </label>

              <label className="border-2 border-dashed border-slate-300 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <ImagePlus className="text-slate-500" size={30} />
                  </div>
                )}

                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Upload size={18} />
                  Upload profile image
                </div>

                <p className="text-xs text-slate-500 mt-1">
                  JPG or PNG, less than 2MB
                </p>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  {...register("profileImageUrl")}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      if (!["image/jpeg", "image/png"].includes(file.type)) {
                        setError("Only JPG or PNG allowed");
                        return;
                      }

                      if (file.size > 2 * 1024 * 1024) {
                        setError("File size must be less than 2MB");
                        return;
                      }

                      if (preview) {
                        URL.revokeObjectURL(preview);
                      }

                      const previewUrl = URL.createObjectURL(file);
                      setPreview(previewUrl);
                      setError(null);
                    }
                  }}
                />
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold shadow-md active:scale-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-7">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;