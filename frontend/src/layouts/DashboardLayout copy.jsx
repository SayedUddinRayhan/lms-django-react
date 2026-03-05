import React, { useState, useEffect } from "react";
import DashboardSidebar from "../components/dashboard/InstructorSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Auto collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false); // collapsed (icon only)
      } else {
        setIsOpen(true); // expanded
      }
    };

    handleResize(); // run once
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isOpen} closeSidebar={closeSidebar} />

      {/* Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "lg:ml-72 ml-20" : "ml-20"
        }`}
      >
        <DashboardNavbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;