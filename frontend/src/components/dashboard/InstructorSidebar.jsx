// src/components/dashboard/InstructorSidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaBook, 
  FaPlus, 
  FaLayerGroup, 
  FaChalkboardTeacher, 
  FaTachometerAlt, 
  FaBars, 
  FaChevronDown 
} from "react-icons/fa";
import API from "../../api/apiClient";

export default function InstructorSidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed }) {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  // Menu order: Dashboard, My Courses, Add Course, Manage Modules, Manage Lessons
  const menuItems = [
    { name: "Dashboard", path: "/dashboard/instructor/courses", icon: FaTachometerAlt },
    {
      name: "My Courses",
      icon: FaBook,
      submenu: courses.map(course => ({
        name: course.title,
        path: `/dashboard/instructor/courses/${course.id}/modules`,
        submenu: course.modules?.map(module => ({
          name: module.title,
          path: `/dashboard/instructor/courses/${course.id}/modules/${module.id}/lessons`,
        })) || []
      }))
    },
    { name: "Add Course", path: "/dashboard/instructor/create-course", icon: FaPlus },
    { name: "Manage Modules", path: "/dashboard/instructor/modules", icon: FaLayerGroup },
    { name: "Manage Lessons", path: "/dashboard/instructor/lessons", icon: FaChalkboardTeacher },
  ];

  // Fetch courses + modules for sidebar
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/courses/instructor/dashboard/");
        setCourses(res.data.recent_courses || []);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    fetchCourses();
  }, []);

  const isSubmenuActive = (submenu) => 
    submenu?.some(sub => location.pathname.startsWith(sub.path));

  useEffect(() => {
    menuItems.forEach((item, idx) => {
      if (item.submenu && isSubmenuActive(item.submenu)) {
        setOpenMenu(idx);
      }
    });
  }, [location.pathname, courses]);

  return (
    <>
      {/* Mobile overlay */}
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
            const hasSubmenu = !!item.submenu;
            const submenuActive = isSubmenuActive(item.submenu);

            return (
              <div key={idx} className="relative">
                {hasSubmenu ? (
                  <>
                    <button
                      onClick={() => {
                        if (sidebarCollapsed) setSidebarCollapsed(false);
                        setOpenMenu(openMenu === idx ? null : idx);
                      }}
                      className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg transition-all
                        ${openMenu === idx || submenuActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5" />}
                        {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                      </div>
                      {!sidebarCollapsed && <FaChevronDown className={`transition-transform ${openMenu === idx ? "rotate-180" : ""}`} />}
                    </button>

                    {openMenu === idx && !sidebarCollapsed && (
                      <div className="ml-6 mt-1 flex flex-col space-y-1">
                        {item.submenu.map((sub, sIdx) => {
                          const hasSubSubmenu = !!sub.submenu;
                          return hasSubSubmenu ? (
                            <div key={sIdx}>
                              <span className="text-gray-300 text-sm font-semibold">{sub.name}</span>
                              {sub.submenu.map((subsub, ssIdx) => (
                                <NavLink
                                  key={ssIdx}
                                  to={subsub.path}
                                  onClick={() => setSidebarOpen(false)}
                                  className={({ isActive }) => `px-3 py-2 rounded-lg text-sm transition-all
                                    ${isActive ? "bg-indigo-500 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                                >
                                  {subsub.name}
                                </NavLink>
                              ))}
                            </div>
                          ) : (
                            <NavLink
                              key={sIdx}
                              to={sub.path}
                              onClick={() => setSidebarOpen(false)}
                              className={({ isActive }) => `px-3 py-2 rounded-lg text-sm transition-all
                                ${isActive ? "bg-indigo-500 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                            >
                              {sub.name}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                      ${isActive ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
                  </NavLink>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}