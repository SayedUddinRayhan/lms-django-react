import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { FaSpinner } from "react-icons/fa";

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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

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
            onChange={(e) => setIdentifier(e.target.value.trim())}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
            disabled={isAuthLoading}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
            type="submit"
            disabled={isAuthLoading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold p-3 rounded transition-all"
            >
            {isAuthLoading && <FaSpinner className="animate-spin text-white" />}
            {isAuthLoading ? "Logging in..." : "Login"}
            </button>
        </form>
        </div>
  );
};

export default Login;