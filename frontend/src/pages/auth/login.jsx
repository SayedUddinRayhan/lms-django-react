import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
const Login = () => {
  const { login, authError, isAuthLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username: identifier, password });
    } catch (err) {
      console.error(err);
    }
  };

  return (
     <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Login
        </h1>

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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            disabled={isAuthLoading}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isAuthLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold p-3 rounded-lg transition"
          >
            {isAuthLoading && <FaSpinner className="animate-spin" />}
            {isAuthLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 font-semibold">
                  Sign Up
                </Link>
              </p>
      </div>
    );
};

export default Login;