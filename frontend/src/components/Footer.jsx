import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { HiSun, HiMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

function Footer() {
  const { dark, toggleTheme } = useTheme(); // get current theme

  return (
    <footer className="bg-gray-900/90 dark:bg-gray-800 border-t border-white/10 text-gray-300 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">

          {/* Logo + About */}
          <div className="w-full md:w-1/2 min-w-0">
            <div className="flex items-center gap-2">
              <img
                className="h-8"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt="logo"
              />
              <span className="text-white font-semibold truncate">LMS</span>
            </div>
            <p className="mt-3 text-sm text-gray-400 break-words transition-colors duration-300">
              Learning Management System using React and Django REST Framework.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-indigo-500 transition-colors duration-300">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors duration-300">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="hover:text-indigo-500 transition-colors duration-300">
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="w-full md:w-1/2 min-w-0">
            <h3 className="mb-3 font-semibold text-white transition-colors duration-300">
              Contact
            </h3>
            <ul className="space-y-2 text-sm break-words text-gray-300 transition-colors duration-300">
              <li>Email: sayeduddin.cse@gmail.com</li>
              <li>Phone: +8801518-963010</li>
              <li>Feni, Bangladesh</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-white/10 pt-4 text-center text-sm text-gray-400 transition-colors duration-300 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Sayed. All rights reserved.</span>

          {/* Footer Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="mt-2 md:mt-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-300"
            title="Toggle Dark/Light Mode"
          >
            {dark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;