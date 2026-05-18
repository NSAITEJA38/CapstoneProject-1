import { NavLink, Outlet, Navigate } from "react-router";
import { useAuth } from "../stores/authStore";
import {
  pageWrapper,
  navLinkClass,
  navLinkActiveClass,
  divider,
} from "../styles/common";

// AUTHOR PROFILE => to navigate ARTICLES / WRITE ARTICLES
function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const authChecked = useAuth((state) => state.authChecked);

  // Wait until auth check completes
  if (!authChecked) {
    return (
      <div className={pageWrapper}>
        <p className="text-center text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // If not logged in, send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not AUTHOR, block access
  if (currentUser?.role !== "AUTHOR") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={pageWrapper}>
      {/* Author Info Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex items-center gap-6">
        <img
          src={
            currentUser?.profileImageUrl ||
            "https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff"
          }
          alt="author"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
        />

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {currentUser?.firstName || "Author"} {currentUser?.lastName || ""}
          </h1>

          <p className="text-gray-500 mt-2">
            {currentUser?.email || "No email available"}
          </p>

          <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
            Author
          </span>
        </div>
      </div>

      {/* Author Navigation */}
      <div className="flex gap-6 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive ? navLinkActiveClass : navLinkClass
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      <Outlet />
    </div>
  );
}

export default AuthorProfile;