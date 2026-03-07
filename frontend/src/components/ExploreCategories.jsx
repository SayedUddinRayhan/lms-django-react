import { useState, useEffect, useRef } from "react";
import API from "../api/apiClient";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBook, FaLayerGroup } from "react-icons/fa";
import { toast } from "react-toastify";

export default function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [enrollingId, setEnrollingId] = useState(null);

  const scrollContainerRef = useRef(null);
  const tabRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await API.get("courses/public/categories/");
        const data = res.data.results ?? res.data ?? [];
        if (!Array.isArray(data)) return;
        setCategories(data);
        if (data.length > 0) setActiveCategory(data[0].id);
      } catch (err) {
        console.error("Category fetch error:", err.response?.data || err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const res = await API.get("courses/public/courses/", {
          params: { category__id: activeCategory },
        });
        const data = res.data.results ?? res.data ?? [];
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Course fetch error:", err.response?.data || err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [activeCategory]);


  const handleCategoryClick = (id, index) => {
    setActiveCategory(id);
    const container = scrollContainerRef.current;
    const btn = tabRefs.current[index];
    if (container && btn) {
      const offset = btn.offsetLeft + btn.offsetWidth / 2 - container.clientWidth / 2;
      container.scrollTo({ left: offset, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
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

      const res = await API.get("courses/enrollments/", {
        params: { course: course.id }
      });
      const results = res.data?.results || res.data || [];
      const isAlreadyEnrolled = Array.isArray(results)
        ? results.some(enr => enr.course == course.id)
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
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Explore Courses
          </h2>
          <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
            View All <HiChevronRight />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="relative mb-10">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <HiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-12"
          >
            {loadingCategories
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                  />
                ))
              : categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    ref={(el) => (tabRefs.current[index] = el)}
                    onClick={() => handleCategoryClick(cat.id, index)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                      activeCategory === cat.id
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50"
                    }`}
                  >
                    {cat.name} ({cat.total_courses || 0})
                  </button>
                ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <HiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-200" />
          </button>
        </div>

        {/* Courses Grid */}
        {loadingCourses ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No courses available in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link
                to={`/courses/${course.slug}`}
                key={course.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail || "/placeholder.jpg"}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
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

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {course.instructor_name}
                  </p>

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
                      {course.is_free
                        ? "Free"
                        : `৳ ${Number(course.price).toLocaleString()}`}
                    </span>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEnroll(e, course);
                      }}
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