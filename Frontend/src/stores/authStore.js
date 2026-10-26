import { create } from "zustand";
import axiosInstance from "../api/axios";

export const useAuth = create((set) => ({
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked: false,
  profileImageUrl: null,

  // LOGIN
  login: async (userCred) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.post(
        "/common-api/authenticate",
        userCred
      );

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
      }

      set({
        loading: false,
        isAuthenticated: true,
        currentUser: res.data.payload,
        profileImageUrl: res.data.payload?.profileImageUrl || null,
        authChecked: true,
        error: null,
      });

      return {
        success: true,
        user: res.data.payload,
      };
    } catch (err) {
      localStorage.removeItem("token");
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login Failed";

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        profileImageUrl: null,
        authChecked: true,
        error: message,
      });

      return {
        success: false,
        message,
      };
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      set({ loading: true, error: null });

      try {
        await axiosInstance.get("/common-api/logout");
      } catch {
        // Continue even if network error occurs during logout
      }

      localStorage.removeItem("token");

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        profileImageUrl: null,
        authChecked: true,
        error: null,
      });
    } catch (err) {
      localStorage.removeItem("token");
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Logout Failed";

      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        profileImageUrl: null,
        authChecked: true,
        error: message,
      });
    }
  },

  // CHECK AUTH ON PAGE REFRESH
  reload: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/common-api/check-auth");

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        profileImageUrl: res.data.payload?.profileImageUrl || null,
        loading: false,
        authChecked: true,
        error: null,
      });
    } catch (err) {
      localStorage.removeItem("token");
      // 401 or 403 when user is not logged in or token is missing/expired
      if (err.response?.status === 401 || err.response?.status === 403) {
        set({
          currentUser: null,
          isAuthenticated: false,
          profileImageUrl: null,
          loading: false,
          authChecked: true,
          error: null,
        });
        return;
      }

      set({
        currentUser: null,
        isAuthenticated: false,
        profileImageUrl: null,
        loading: false,
        authChecked: true,
        error:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Authentication check failed",
      });
    }
  },
}));