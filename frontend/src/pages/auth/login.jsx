import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { FaSpinner } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/apiClient";

const Login = () => {
  const { login, authError, isAuthLoading } = useAuth(); 
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await login({ identifier, password });
      
      const pendingCourseId = localStorage.getItem("pendingEnrollCourse");
      
      if (pendingCourseId) {
        console.log("🔄 Processing pending enrollment:", pendingCourseId);
        
        try {
      
          const getRes = await API.get("courses/enrollments/", {
            params: { course: pendingCourseId }
          });
          const results = getRes.data?.results || getRes.data || [];
          const isAlreadyEnrolled = Array.isArray(results)
            ? results.some(enr => enr.course == pendingCourseId)
            : false;

          if (isAlreadyEnrolled) {
            alert("You're already enrolled in this course!");
          } else {
     
            await API.post("courses/enrollments/", { course: pendingCourseId });
            alert("Enrolled successfully!");
          }
        } catch (err) {
          console.error("Auto-enroll error:", err);
          alert(err.response?.data?.detail || "Could not complete enrollment.");
        } finally {
     
          localStorage.removeItem("pendingEnrollCourse");
        }
      }
      
      const from = location.state?.from || "/dashboard/student";
      navigate(from, { replace: true });
      
    } catch (err) {
      console.error("Login error:", err);
  
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition">
      <h1 className="text-3xl font-bold mb-6 text-center dark:text-gray-100">Login</h1>

      {authError && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
          {authError}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          disabled={isAuthLoading}
          type="text"
          placeholder="Email or Phone"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          disabled={isAuthLoading}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <button
          type="submit"
          disabled={isAuthLoading}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 
                   disabled:bg-indigo-400 text-white font-semibold p-3 rounded-lg transition"
        >
          {isAuthLoading && <FaSpinner className="animate-spin" />}
          {isAuthLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;