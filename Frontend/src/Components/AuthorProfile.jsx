import { NavLink, Outlet, Navigate } from "react-router";
import { useAuth } from "../stores/authStore";
import { pageWrapper, divider } from "../styles/common";

// AUTHOR PROFILE => WRITE , READ ARTICLES
function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const authChecked = useAuth((state) => state.authChecked);

  const buttonBase =
    "px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200";

  const activeButton =
    "bg-blue-600 text-white shadow-md shadow-blue-500/20";

  const normalButton =
    "bg-white text-gray-600 border border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200";

  // Wait until authentication check is completed
  if (!authChecked) {
    return (
      <div className={pageWrapper}>
        <p className="text-center text-gray-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  // If user is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged-in user is not AUTHOR
  if (currentUser?.role !== "AUTHOR") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={pageWrapper}>
      {/* Author Info Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 flex items-center gap-6">
        {/* Profile Image */}
        <img
          src={
            currentUser?.profileImageUrl ||
            "https://ui-avatars.com/api/?name=Author&background=2563eb&color=fff"
          }
          alt="author"
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
        />

        {/* Author Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">
            {currentUser?.firstName || "Author"}{" "}
            {currentUser?.lastName || ""}
          </h1>

          <p className="text-gray-500 mt-2">
            {currentUser?.email || "No email available"}
          </p>

          <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
            Author
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <NavLink
          to="articles"
          className={({ isActive }) =>
            `${buttonBase} ${isActive ? activeButton : normalButton}`
          }
        >
          Articles
        </NavLink>

        <NavLink
          to="write-article"
          className={({ isActive }) =>
            `${buttonBase} ${isActive ? activeButton : normalButton}`
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* Nested Routes */}
      <Outlet />
    </div>
  );
}

export default AuthorProfile;