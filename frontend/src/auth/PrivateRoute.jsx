import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  const getDashboard = (role) => {
    if (role === "student") return "/dashboard/my-courses";
    if (role === "instructor") return "/dashboard/instructor/courses";
    if (role === "admin") return "/dashboard/admin";
    return "/";
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (location.pathname.startsWith("/login") || location.pathname.startsWith("/register")) {
    return <Navigate to={getDashboard(user.role)} replace />;
  }

  // Role-based access
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboard(user.role)} replace />;
  }

  return children;
}