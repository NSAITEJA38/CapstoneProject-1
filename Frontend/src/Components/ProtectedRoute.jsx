import { Navigate } from "react-router";
import { useAuth } from "../stores/authStore";

//  PROTECTED ROUTES => to access content based on role / authorization
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser, authChecked } = useAuth();

  // Wait until auth check completes
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
        Checking authentication...
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role check if allowedRoles provided
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/" replace />;
  }

  // Allowed
  return children;
}

export default ProtectedRoute;