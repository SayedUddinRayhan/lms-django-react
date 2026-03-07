import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/apiClient";
import { FaBook, FaPlayCircle, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses/?ordering=-created_at");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await API.delete(`/courses/${courseId}/`);
      toast.success("Course deleted successfully");
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete course");
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
    <div className="p-6 space-y-8 max-w-6xl mx-auto">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <Link
          to="/dashboard/instructor/create-course"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FaBook />
          Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">
          You have not created any courses yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition bg-white">
              
              {/* Thumbnail */}
              <img
                src={course.thumbnail || "/placeholder.jpg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{course.description}</p>

                {/* Stats */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{course.modules.length} Modules</span>
                  <span>{course.total_lessons} Lessons</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Link
                    to={`/dashboard/instructor/courses/${course.id}/modules`}
                    className="flex-1 text-center bg-indigo-600 text-white text-sm py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Manage Modules
                  </Link>
                  <Link
                    to={`/dashboard/instructor/courses/${course.id}/edit`}
                    className="flex-1 text-center bg-yellow-500 text-white text-sm py-2 rounded-md hover:bg-yellow-600 transition"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="flex-1 text-center bg-red-600 text-white text-sm py-2 rounded-md hover:bg-red-700 transition"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}