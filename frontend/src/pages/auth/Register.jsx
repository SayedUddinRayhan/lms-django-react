import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      
      const { confirmPassword, ...registerData } = form;
      const payload = {
        ...registerData,
        password2: confirmPassword,
      };
      
      await API.post("/auth/register/", payload);
      
      navigate("/login", { 
        state: { message: "Registration successful! Please login." } 
      });
      
    } catch (err) {
      console.error("Registration error:", err);
     
      if (err.response?.data) {
        const responseData = err.response.data;
        
  
        if (typeof responseData === 'string' && responseData.trim().startsWith('<')) {
          if (responseData.includes('DEBUG = True')) {
            setError("Server error. Check Django terminal for details.");
            console.warn("Django returned HTML debug page. See backend logs below:");
            console.warn("Look for: ValidationError, IntegrityError, or field issues");
          } else {
            setError("Unexpected server response. Check console for details.");
          }
        } 
       
        else if (typeof responseData === 'object') {
          const errorMessages = Object.entries(responseData)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages) ? messages.join(", ") : messages;
        
              const fieldName = field === 'password2' ? 'Confirm password' : 
                               field === 'username' ? 'Username' :
                               field === 'email' ? 'Email' : field;
              return `${fieldName}: ${msg}`;
            })
            .join("\n");
          setError(errorMessages || "Registration failed");
        } 
        
        else {
          setError(String(responseData) || "Registration failed");
        }
      } else if (err.request) {
        setError("No response from server. Is Django running on http://localhost:8000?");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm max-h-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 transition mt-25 mb-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4 text-sm whitespace-pre-line">
          {error}
        </div>
      )}

  
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username *
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            minLength={3}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+8801XXXXXXXXX"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            pattern="^\+?[0-9\s\-()]{10,}$"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Min. 8 characters"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
            minLength={8}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            className="w-full border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                   text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="text-center mt-6 text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;