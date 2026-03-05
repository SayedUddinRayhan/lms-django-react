import { useState, useEffect } from "react";
import API from "../api/apiClient";
import { HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
  
      const res = await API.get("/courses/categories/");
      const data = res.data.results ?? res.data ?? [];
  
      if (!Array.isArray(data)) {
        console.warn("Unexpected categories response:", res.data);
        return;
      }
  
      setCategories(data);
  
      if (data.length > 0) {
        setActiveCategory(data[0].id);
        fetchCourses(data[0].id);
      }
    } catch (err) {
      console.error("Category fetch error:", err.response?.data || err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch courses by category
  const fetchCourses = async (categoryId) => {
    try {
      setLoadingCourses(true);
  
      const res = await API.get("/courses/courses/", {
        params: { category: categoryId },
      });
      console.log(res.data);
      const data = res.data.results ?? res.data ?? [];
  
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Course fetch error:", err.response?.data || err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    fetchCourses(id);
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
        <div className="flex gap-4 overflow-x-auto pb-4 mb-10 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap
                ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-indigo-50"
                }`}
            >
              {cat.name}
            </button>
          ))}
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
        {/* Thumbnail */}
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

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {course.instructor_name}
          </p>

          {/* Rating + Lessons */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>
              ⭐ {course.average_rating?.toFixed(1) || "0.0"}
            </span>
            <span>
              {course.total_lessons} Lessons
            </span>
          </div>

          {/* Price + Action */}
          <div className="flex items-center justify-between">
            <span className="text-indigo-600 font-bold text-lg">
              {course.is_free ? "Free" : `৳ ${Number(course.price).toLocaleString()}`}
            </span>

            <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Enroll
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

export default ExploreCategories;