import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />; // redirect to login if not authenticated
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/" />; // redirect if role not allowed
  }

  return children;
};

export default PrivateRoute;
