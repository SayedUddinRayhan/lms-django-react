import { useEffect, useState } from "react";
import API from "../api/apiClient";
import { FaBook, FaLayerGroup } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await API.get("courses/public/courses/", { params: { limit: 100 } });
        const data = res.data.results ?? res.data ?? [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Courses fetch error:", err.response?.data || err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (e, course) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("access");
    if (!token) {
      localStorage.setItem("pendingEnrollCourse", course.id);
      toast.info("Please login to enroll");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    try {
      setEnrollingId(course.id);
      const res = await API.get("courses/enrollments/", { params: { course: course.id } });
      const results = res.data?.results || res.data || [];
      const isAlreadyEnrolled = Array.isArray(results)
        ? results.some((enr) => enr.course == course.id)
        : false;

      if (isAlreadyEnrolled) {
        toast.info("You're already enrolled in this course!");
        return;
      }

      await API.post("courses/enrollments/", { course: course.id });
      toast.success("Successfully enrolled!");
      navigate("/dashboard/student");
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.response?.data?.detail || "Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12">All Courses</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg">No courses available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link
                to={`/courses/${course.slug}`}
                key={course.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-xl transition border border-gray-100 dark:border-gray-700"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.jpg"}
                    alt={course.title}
                    className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {course.is_free && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Free
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.instructor_name}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <FaLayerGroup /> {course.total_modules ?? 0} Modules
                    </div>
                    <div className="flex items-center gap-1">
                      <FaBook /> {course.total_lessons ?? 0} Lessons
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-indigo-600 font-bold text-lg">
                      {course.is_free ? "Free" : `৳ ${Number(course.price).toLocaleString()}`}
                    </span>
                    <button
                      onClick={(e) => handleEnroll(e, course)}
                      disabled={enrollingId === course.id}
                      className={`text-sm px-4 py-2 rounded-lg transition ${
                        enrollingId === course.id
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {enrollingId === course.id ? "..." : "Enroll"}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}