import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineChevronDown,
  HiOutlineCube,
  HiOutlineCode,
} from "react-icons/hi";
import { useAuth } from "../auth/AuthContext"; // your auth context

const navItems = [
  { label: "Courses", path: "/" },
  { label: "Live", path: "/" },
  { label: "Categories", path: "/" },
  { label: "About", path: "/" },
];

const Navbar = () => {
  const { user, logout } = useAuth(); // get user from AuthContext
  const [openNav, setOpenNav] = useState(false);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          LMS
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8 font-medium text-gray-600">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            // Profile menu
            <div className="relative">
              <button
                onClick={() => setOpenProfileMenu((cur) => !cur)}
                className="flex items-center gap-1 rounded-full py-0.5 px-2 border border-gray-300"
              >
                <HiOutlineUser className="w-5 h-5" />
                <HiOutlineChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openProfileMenu && (
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <HiOutlineUser /> My Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <HiOutlineCube /> Edit Profile
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <HiOutlineCode /> Inbox
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <HiOutlineUser /> Help
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-red-100 cursor-pointer flex items-center gap-2 text-red-500"
                    onClick={logout}
                  >
                    <HiOutlineX /> Sign Out
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpenNav((cur) => !cur)}
          className="md:hidden text-gray-700"
        >
          {openNav ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {openNav && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} className="block">
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 mt-2">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-indigo-600 font-medium hover:underline"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <li
                  className="px-4 py-2 hover:bg-red-100 cursor-pointer flex items-center gap-2 text-red-500"
                  onClick={logout}
                >
                  <HiOutlineX /> Sign Out
                </li>
              )}
            </div>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;