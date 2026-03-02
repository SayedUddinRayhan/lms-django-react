import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { dark, setDark } = useTheme();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600">
          Academix
        </h1>

        {/* Nav */}
        <nav className="hidden md:flex gap-10 font-medium text-gray-700 dark:text-gray-200">
          <a href="#">Home</a>
          <a href="#">Courses</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition"
          >
            {dark ? <HiSun /> : <HiMoon />}
          </button>

          {/* Login */}
          <a
            href="/login"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition font-medium"
          >
            Login
          </a>

          {/* Sign Up Button (Template Style) */}
          <a
            href="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Sign Up
          </a>

          
        </div>
      </div>
    </header>
  );
};

export default Navbar;