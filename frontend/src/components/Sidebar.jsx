import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <div className="w-64 bg-dark text-white p-6">
      <h2 className="text-xl font-bold mb-6">LMS</h2>

      {user?.role === "student" && (
        <>
          <Link to="/student/dashboard" className="block mb-3">
            Dashboard
          </Link>
          <Link to="/student/courses" className="block">
            My Courses
          </Link>
        </>
      )}

      {user?.role === "instructor" && (
        <>
          <Link to="/instructor/dashboard" className="block mb-3">
            Dashboard
          </Link>
          <Link to="/instructor/manage" className="block">
            Manage Courses
          </Link>
        </>
      )}
    </div>
  );
}