import { useEffect, useState, useRef } from "react";
import API from "../api/apiClient";
import { FaChevronLeft, FaChevronRight, FaBook, FaLayerGroup } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);

  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await API.get("courses/public/courses/", { params: { limit: 10 } });
        const data = res.data.results ?? res.data ?? [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Featured courses fetch error:", err.response?.data || err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const scrollAmount = carouselRef.current.clientWidth * 0.7; // scroll 70% of container
    carouselRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) scroll("right");
    if (touchStartX.current - touchEndX.current < -50) scroll("left");
  };

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Featured Courses</h2>
          <Link
            to="/all-courses"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-semibold transition"
          >
            Browse All Courses
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full z-10 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
          >
            <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow-md p-2 rounded-full z-10 hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
          >
            <FaChevronRight className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Carousel container */}
          <div
            ref={carouselRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-6 overflow-hidden py-4"
          >
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-72 h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
                  />
                ))
              : courses.map((course) => (
                  <Link
                    to={`/courses/${course.slug}`}
                    key={course.id}
                    className="flex-shrink-0 w-72 group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-xl transition border border-gray-100 dark:border-gray-700"
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
        </div>
      </div>
    </section>
  );
}