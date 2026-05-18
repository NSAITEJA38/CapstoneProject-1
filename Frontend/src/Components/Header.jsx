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
    `px-4 py-2 rounded-lg font-medium transition duration-200
     ${
       isActive
         ? "bg-white text-blue-600"
         : "text-white hover:bg-blue-500"
     }`;

  return (

    <header className="bg-gradient-to-r bg-amber-300 to-indigo-700 shadow-lg">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold text-white tracking-wide"
        >
         <img className='w-8 rounded-full h-8 sm:w-12.5 sm:h-12.5 object-cover ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7aio1A8-DCI6O_fLPR_tBgPQc6Xuxxr4Lfg&s" alt="" />
        </NavLink>

        {/* Navigation */}
        <nav>

          <ul className="flex items-center gap-4">

            {/* Home */}
            <li>
              <NavLink
                to="/"
                end
                className={navLinkStyles}
              >
                Home
              </NavLink>
            </li>

            {/* Guest Links */}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={navLinkStyles}
                  >
                    Login
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/register"
                    className={navLinkStyles}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}

            {/* Authenticated Links */}
            {isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to={getProfilePath()}
                    className={navLinkStyles}
                  >
                    Profile
                  </NavLink>
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition duration-200"
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