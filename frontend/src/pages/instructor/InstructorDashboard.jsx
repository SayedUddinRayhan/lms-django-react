// src/pages/instructor/InstructorDashboard.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/apiClient";
import { FaBook, FaUsers, FaPlayCircle, FaPlus } from "react-icons/fa";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    courses: 0,
    students: 0,
    lessons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/courses/instructor/dashboard/");
      console.log(res.data);
      setCourses(res.data.recent_courses || []);
      setStats({
        courses: res.data.total_courses || 0,
        students: res.data.total_students || 0,
        lessons: res.data.total_lessons || 0,
      });
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your courses and track student engagement
          </p>
        </div>

        <Link
          to="/dashboard/instructor/create-course"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaPlus />
          Create Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg">
            <FaBook size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-xl font-semibold">{stats.courses}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-lg">
            <FaUsers size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-xl font-semibold">{stats.students}</p>
          </div>
        </div>

        <div className="bg-white shadow-sm border rounded-xl p-5 flex items-center gap-4">
          <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
            <FaPlayCircle size={20} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Lessons</p>
            <p className="text-xl font-semibold">{stats.lessons}</p>
          </div>
        </div>

      </div>

      {/* Recent Courses */}
      <div className="bg-white shadow-sm border rounded-xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Recent Courses</h2>

          <Link
            to="/dashboard/instructor/courses"
            className="text-indigo-600 text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No courses created yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition"
              >

               <img
                src={course.thumbnail || "/placeholder.jpg"}
                alt={course.title}
                className="w-full h-36 object-cover"
                />

                <div className="p-4 space-y-2">

                  <h3 className="font-semibold text-gray-800">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{course.total_modules} Modules</span>
                    <span>{course.total_lessons} Lessons</span>
                  </div>

                  <Link
                    to={`/dashboard/instructor/courses/${course.id}/modules`}
                    className="block text-center bg-indigo-600 text-white text-sm py-2 rounded-md mt-2 hover:bg-indigo-700"
                  >
                    Manage Course
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}