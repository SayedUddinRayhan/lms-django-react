import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/register/", form);
      navigate("/login");
    } catch (error) {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;