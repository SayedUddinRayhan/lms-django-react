import React, { useState } from "react";
import {
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineFolder,
} from "react-icons/hi";

const DashboardSidebar = ({ isOpen, closeSidebar }) => {
  const [pagesOpen, setPagesOpen] = useState(false);

  const togglePages = () => setPagesOpen(!pagesOpen);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 ${
            isOpen ? "w-72" : "w-20"
        }`}
        >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 h-[85px]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>

              {/* Hide text when collapsed */}
              {isOpen && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Peoplia
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Smart HR Solutions
                  </p>
                </div>
              )}
            </div>

           {/* Close button mobile: only show when sidebar is open */}
            {isOpen && (
                <button
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={closeSidebar}
                >
                <HiOutlineX className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">

            {/* Dashboard */}
            <SidebarItem
              icon={<HiOutlineUsers />}
              label="Dashboard"
              isOpen={isOpen}
              active
            />

            <SidebarItem
              icon={<HiOutlineUsers />}
              label="Employee"
              isOpen={isOpen}
            />

            <SidebarItem
              icon={<HiOutlineClock />}
              label="Attendance"
              isOpen={isOpen}
            />

            <SidebarItem
              icon={<HiOutlineCalendar />}
              label="Calendar"
              isOpen={isOpen}
            />

            {/* Pages Dropdown */}
            <div>
              <button
                onClick={togglePages}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white font-medium transition-all"
              >
                <div className="flex items-center space-x-3">
                  <HiOutlineFolder className="w-5 h-5" />
                  {isOpen && <span>Pages</span>}
                </div>

                {isOpen && (
                  <HiOutlineChevronDown
                    className={`w-4 h-4 transition-transform ${
                      pagesOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {pagesOpen && isOpen && (
                <ul className="mt-1 space-y-1 pl-8">
                  <li>
                    <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      Login
                    </a>
                  </li>
                  <li>
                    <a className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      Signup
                    </a>
                  </li>
                </ul>
              )}
            </div>

          </nav>
        </div>
      </div>
    </>
  );
};

/* Sidebar Item Component */
const SidebarItem = ({ icon, label, isOpen, active }) => {
  return (
    <div
      className={`group relative flex items-center ${
        isOpen ? "space-x-3 px-4" : "justify-center"
      } py-3 rounded-xl cursor-pointer transition-all
      ${
        active
          ? "text-purple-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 font-medium shadow-sm"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>

      {isOpen && <span>{label}</span>}

      {/* Tooltip when collapsed */}
      {!isOpen && (
        <span className="absolute left-full ml-3 px-2 py-1 text-sm rounded-md bg-gray-900 text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

export default DashboardSidebar;