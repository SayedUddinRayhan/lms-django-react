import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary">
          LMS
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary">
            Home
          </Link>

          {user?.role === "student" && (
            <>
              <Link to="/student/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link to="/student/courses" className="hover:text-primary">
                My Courses
              </Link>
            </>
          )}

          {user?.role === "instructor" && (
            <>
              <Link to="/instructor/dashboard" className="hover:text-primary">
                Dashboard
              </Link>
              <Link to="/instructor/manage" className="hover:text-primary">
                Manage Courses
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          {/* We'll add mobile menu toggle here if needed */}
          <span className="text-gray-700 font-bold">☰</span>
        </div>
      </div>
    </nav>
  );
}