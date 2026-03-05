import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse

  return (
    <div className="flex min-h-screen overflow-x-auto">

      {/* Sidebar */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        {/* Navbar */}
        <DashboardNavbar onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />

        {/* Page Content */}
        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;