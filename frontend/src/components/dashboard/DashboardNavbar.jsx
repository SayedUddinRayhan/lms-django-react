import React, { useState, useEffect, useRef } from "react";
import {
  HiMenu,
  HiSearch,
  HiSun,
  HiMoon,
  HiBell,
  HiUser,
  HiLogout,
} from "react-icons/hi";

const DashboardNavbar = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState("light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 flex items-center h-[85px] justify-between">
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <HiMenu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="w-80 px-4 py-2 pl-10 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          />
          <HiSearch className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === "light" ? (
            <HiMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <HiSun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-900 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <HiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
              <p className="px-4 py-2 font-semibold text-gray-900 dark:text-white">
                Notifications
              </p>
              <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* User Settings */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center gap-3 border rounded-xl px-3 py-1.5 bg-white dark:bg-gray-800 dark:text-white"
          >
            <HiUser className="w-6 h-6" />
            <span className="hidden md:block">Saroj Choudhury</span>
          </button>

          {settingsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-2">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HiUser /> Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <HiLogout /> Sign Out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;