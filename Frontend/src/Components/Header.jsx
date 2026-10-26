import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../stores/authStore";

//  USER NAVIGATION HEADER
function Header() {

  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Dynamic profile route
  const getProfilePath = () => {

    if (!currentUser) return "/";

    switch (currentUser.role) {

      case "AUTHOR":
        return "/author-profile";

      case "ADMIN":
        return "/admin-profile";

      default:
        return "/user-profile";
    }
  };

  // NavLink styles
  const navLinkStyles = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition duration-200
     ${
       isActive
         ? "bg-white text-blue-700 shadow-sm"
         : "text-white/90 hover:bg-white/15 hover:text-white"
     }`;

  const displayName =
    currentUser?.firstName ||
    currentUser?.name ||
    currentUser?.email?.split("@")[0] ||
    "User";

  return (
    <header className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold text-white tracking-tight hover:opacity-95 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm border border-white/20 shadow-sm">
            <span className="text-lg">✍️</span>
          </div>
          <span>BlogApp</span>
        </NavLink>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-3">
            {/* Home */}
            <li>
              <NavLink to="/" end className={navLinkStyles}>
                Home
              </NavLink>
            </li>

            {/* Guest Links */}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink to="/login" className={navLinkStyles}>
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/register" className={navLinkStyles}>
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Authenticated Links */}
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to={getProfilePath()} className={navLinkStyles}>
                    {currentUser?.role === "ADMIN"
                      ? "Admin Dashboard"
                      : currentUser?.role === "AUTHOR"
                      ? "Author Studio"
                      : "Profile"}
                  </NavLink>
                </li>

                {/* User info badge */}
                <li className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/20">
                  <span className="text-xs text-white/90 font-medium">
                    {displayName}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white">
                    {currentUser?.role}
                  </span>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="px-3.5 py-1.5 rounded-lg bg-red-500/90 text-white text-sm font-medium hover:bg-red-600 transition shadow-sm cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;