import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InstructorSidebar from "../components/dashboard/InstructorSidebar";
import StudentSidebar from "../components/dashboard/StudentSidebar";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import { useAuth } from "../auth/AuthContext";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const { user } = useAuth(); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); 

 
  const SidebarComponent =
    user?.role === "instructor"
      ? InstructorSidebar
      : StudentSidebar;

  return (
    <div className="flex min-h-screen overflow-x-auto">

      {/* Sidebar */}
      <SidebarComponent
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
        <DashboardNavbar
          onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Toast */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

        {/* Page Content */}
        <main className="flex-1 p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;