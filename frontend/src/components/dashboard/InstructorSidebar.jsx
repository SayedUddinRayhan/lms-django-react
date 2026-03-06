// src/components/dashboard/InstructorSidebar.jsx
import { NavLink } from "react-router-dom";
import { FaBook, FaPlus, FaLayerGroup, FaChalkboardTeacher, FaTachometerAlt, FaBars } from "react-icons/fa";

export default function InstructorSidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/instructor/courses", icon: FaTachometerAlt },
    { name: "My Courses", path: "/dashboard/instructor/courses", icon: FaBook },
    { name: "Add Course", path: "/dashboard/instructor/create-course", icon: FaPlus },
    { name: "Manage Modules", path: "/dashboard/instructor/modules", icon: FaLayerGroup },
    { name: "Manage Lessons", path: "/dashboard/instructor/lessons", icon: FaChalkboardTeacher },
  ];

  return (
    <>
      {sidebarOpen && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 bg-gray-900 text-white shadow-lg z-50
          transform transition-all duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 flex flex-col
          ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Logo + Collapse toggle */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          {!sidebarCollapsed && <h1 className="text-lg font-semibold tracking-wide">Instructor Panel</h1>}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded hover:bg-gray-700"
          >
            <FaBars />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                  ${isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}