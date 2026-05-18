import { Navigate } from "react-router";
import { useAuth } from "../stores/authStore";

//  PROTECTED ROUTES => to access content based on role / authorization
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, currentUser, authChecked } = useAuth();

  //  Wait until auth check completes
  if (!authChecked) {
    return <div>Checking authentication...</div>;
  }

  //  Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  //  Role not allowed
  if (!allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/login" />;
  }

  //  Allowed
  return children;
}

export default ProtectedRoute;