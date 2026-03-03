import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="fixed w-full z-50 bg-white dark:bg-gray-900 shadow-sm transition">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-indigo-600">
          Academix
        </h1>

        <nav className="hidden md:flex gap-10 font-medium text-gray-700 dark:text-gray-200">
          <a href="#">Home</a>
          <a href="#">Courses</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        <div className="flex items-center gap-6">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
          >
            {dark ? (
              <HiSun className="w-5 h-5" />
            ) : (
              <HiMoon className="w-5 h-5" />
            )}
          </button>

          <a
            href="/login"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition font-medium"
          >
            Login
          </a>

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