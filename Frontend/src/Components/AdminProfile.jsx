import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../stores/authStore";
import axiosInstance from "../api/axios";
import { toast } from "react-hot-toast";
import { Users, FileText, CheckCircle, ShieldAlert, Ban, Check } from "lucide-react";
import { pageWrapper } from "../styles/common";

function AdminProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const authChecked = useAuth((state) => state.authChecked);

  const [activeTab, setActiveTab] = useState("users"); // "users" | "articles"
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats, users, and articles
  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, articlesRes] = await Promise.all([
        axiosInstance.get("/admin-api/stats").catch(() => ({ data: { payload: null } })),
        axiosInstance.get("/admin-api/users").catch(() => ({ data: { payload: [] } })),
        axiosInstance.get("/admin-api/articles").catch(() => ({ data: { payload: [] } })),
      ]);

      setStats(statsRes.data?.payload);
      setUsers(usersRes.data?.payload || []);
      setArticles(articlesRes.data?.payload || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Failed to load admin dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    if (authChecked && isAuthenticated && currentUser?.role === "ADMIN") {
      const fetchData = async () => {
        try {
          const [statsRes, usersRes, articlesRes] = await Promise.all([
            axiosInstance.get("/admin-api/stats").catch(() => ({ data: { payload: null } })),
            axiosInstance.get("/admin-api/users").catch(() => ({ data: { payload: [] } })),
            axiosInstance.get("/admin-api/articles").catch(() => ({ data: { payload: [] } })),
          ]);

          if (!ignore) {
            setStats(statsRes.data?.payload);
            setUsers(usersRes.data?.payload || []);
            setArticles(articlesRes.data?.payload || []);
            setLoading(false);
          }
        } catch (err) {
          if (!ignore) {
            console.error("Failed to load admin data:", err);
            toast.error("Failed to load admin dashboard data");
            setLoading(false);
          }
        }
      };

      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [authChecked, isAuthenticated, currentUser]);

  const toggleUserStatus = async (user) => {
    const newStatus = !user.isActive;
    const confirmMsg = newStatus
      ? `Unblock ${user.firstName || user.email}?`
      : `Block ${user.firstName || user.email}? They will not be able to log in.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axiosInstance.patch(`/admin-api/users/${user._id}/status`, {
        isActive: newStatus,
      });

      toast.success(res.data?.message || `User status updated`);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isActive: newStatus } : u))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user status");
    }
  };

  const toggleArticleStatus = async (article) => {
    const newStatus = !article.isArticleActive;
    const confirmMsg = newStatus
      ? `Restore article "${article.title}"?`
      : `Hide/delete article "${article.title}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await axiosInstance.patch(
        `/admin-api/articles/${article._id}/status`,
        { isArticleActive: newStatus }
      );

      toast.success(res.data?.message || `Article status updated`);
      setArticles((prev) =>
        prev.map((a) => (a._id === article._id ? { ...a, isArticleActive: newStatus } : a))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update article status");
    }
  };

  if (!authChecked) {
    return (
      <div className={pageWrapper}>
        <p className="text-center text-gray-500 py-16">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={pageWrapper}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 mb-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/20">
              Admin Console
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage registered users, author permissions, and article moderation.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="self-start md:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition cursor-pointer backdrop-blur-sm"
        >
          Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-3">
            <span>TOTAL USERS</span>
            <Users size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.totalUsers ?? users.filter((u) => u.role === "USER").length}
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-3">
            <span>TOTAL AUTHORS</span>
            <CheckCircle size={18} className="text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.totalAuthors ?? users.filter((u) => u.role === "AUTHOR").length}
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-3">
            <span>TOTAL ARTICLES</span>
            <FileText size={18} className="text-indigo-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.totalArticles ?? articles.length}
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-3">
            <span>ACTIVE ARTICLES</span>
            <ShieldAlert size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {stats?.activeArticles ?? articles.filter((a) => a.isArticleActive).length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === "users"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Users Management ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
            activeTab === "articles"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Articles Moderation ({articles.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading dashboard records...</p>
        </div>
      ) : activeTab === "users" ? (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 overflow-hidden">
                        {u.profileImageUrl ? (
                          <img
                            src={u.profileImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          (u.firstName || u.email || "U").charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {u.firstName || "Unnamed"} {u.lastName || ""}
                        </div>
                        <div className="text-xs text-gray-400">
                          Joined {new Date(u.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700 font-mono text-xs">
                      {u.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          u.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : u.role === "AUTHOR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          u.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : "bg-rose-50 text-rose-700 border border-rose-200/50"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {u.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => toggleUserStatus(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5 ${
                            u.isActive
                              ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <Ban size={14} /> Block
                            </>
                          ) : (
                            <>
                              <Check size={14} /> Unblock
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Article</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 max-w-sm truncate">
                        {a.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        Published {new Date(a.createdAt).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {a.author?.firstName
                        ? `${a.author.firstName} (${a.author.email || ""})`
                        : "Author"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full uppercase font-medium">
                        {a.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          a.isArticleActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {a.isArticleActive ? "Active" : "Deleted / Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleArticleStatus(a)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          a.isArticleActive
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {a.isArticleActive ? "Deactivate" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;