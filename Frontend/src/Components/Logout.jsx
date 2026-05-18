import React, { useEffect } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";

// logout => removes token in user's device
export default function Logout() {
  const navigate = useNavigate();

  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const res = await axiosInstance.get("/common-api/logout");

        console.log("Logout Success:", res.data);

        // Clear Zustand auth state if logout function exists
        if (logout) {
          logout();
        }

        navigate("/login", { replace: true });
      } catch (err) {
        console.log("Error during logout:", err);

        // Even if backend logout fails, send user to login page
        navigate("/login", { replace: true });
      }
    };

    handleLogout();
  }, [navigate, logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-200">
      <div className="bg-white px-10 py-8 rounded-3xl shadow-2xl text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>

        <h1 className="text-3xl font-bold text-red-600 mb-2">
          Logging Out...
        </h1>

        <p className="text-gray-600">
          Please wait while we securely log you out.
        </p>
      </div>
    </div>
  );
}