import { useState } from "react";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { dark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600">
          <Link to="/">LMS</Link>
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 font-medium text-gray-700 dark:text-gray-200">
          <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/">Home</Link>
          <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/courses">Courses</Link>
          <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/categories">Categories</Link>
          <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/about">About</Link>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
          >
            {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
          </button>

          {/* Login */}
          <Link
            to="/login"
            className="hidden md:inline text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
          >
            Login
          </Link>

          {/* Sign Up */}
          <Link
            to="/register"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 
                       hover:from-indigo-600 hover:to-blue-600
                       text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg 
                       transition transform hover:scale-105"
          >
            Sign Up
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 transition-all">
          <nav className="flex flex-col gap-4 px-4 py-6 font-medium text-gray-700 dark:text-gray-200">
            <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/courses" onClick={() => setMobileMenuOpen(false)}>Courses</Link>
            <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/categories" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link className="text-indigo-600 dark:text-indigo-400 font-semibold mt-2" to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;