// src/components/dashboard/StudentSidebar.jsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaBook, FaPlayCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import API from "../../api/apiClient";

export default function StudentSidebar({ sidebarOpen, setSidebarOpen, sidebarCollapsed }) {
  const [enrollments, setEnrollments] = useState([]);
  const [expandedCourseIds, setExpandedCourseIds] = useState([]);

  const activeClass = "bg-indigo-100 text-indigo-700 font-semibold";

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await API.get("/courses/enrollments/"); // your student enrollments API
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    }
  };

  const toggleCourse = (courseId) => {
    setExpandedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  return (
    <aside
      className={`fixed lg:static z-50 top-0 left-0 bg-white border-r h-screen p-4 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}`}
    >
      <h2 className={`text-lg font-bold text-gray-800 mb-4 ${sidebarCollapsed ? "hidden" : "block"}`}>
        Student Panel
      </h2>

      {/* Enrolled Courses */}
      <div>
        <button
          onClick={() => toggleCourse("all")}
          className="flex items-center justify-between w-full p-2 text-gray-600 hover:bg-gray-100 rounded"
        >
          <div className="flex items-center gap-2">
            <FaBook />
            {!sidebarCollapsed && "My Courses"}
          </div>
          {!sidebarCollapsed && <span>{expandedCourseIds.includes("all") ? <FaChevronUp /> : <FaChevronDown />}</span>}
        </button>

        {expandedCourseIds.includes("all") && !sidebarCollapsed && (
          <div className="pl-6 mt-2 space-y-1 max-h-64 overflow-y-auto">
            {enrollments.length === 0 ? (
              <p className="text-gray-400 text-sm">No courses enrolled yet</p>
            ) : (
              enrollments.map((enrollment) => (
                <div key={enrollment.id}>
                  <button
                    onClick={() => toggleCourse(enrollment.course.id)}
                    className="flex items-center justify-between w-full p-1 rounded hover:bg-gray-100 text-gray-700 text-sm"
                  >
                    <span>{enrollment.course_title}</span>
                    {expandedCourseIds.includes(enrollment.course.id) ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>

                  {/* Lessons / Progress */}
                  {expandedCourseIds.includes(enrollment.course.id) && enrollment.course.lessons && (
                    <div className="pl-4 mt-1 space-y-1">
                      {enrollment.course.lessons.map((lesson) => (
                        <NavLink
                          key={lesson.id}
                          to={`/dashboard/my-courses/${enrollment.course.id}/lessons/${lesson.id}`}
                          className={({ isActive }) =>
                            `block p-1 rounded text-gray-600 hover:bg-gray-100 text-sm ${isActive ? activeClass : ""}`
                          }
                        >
                          <FaPlayCircle className="inline mr-1 text-indigo-500" />
                          {lesson.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
}