import { useState, useEffect } from "react";
import API from "../api/apiClient";
import { HiChevronRight } from "react-icons/hi";

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
      const res = await API.get("/courses/categories");
      const data = res.data.results || res.data;

      setCategories(data);

      if (data.length > 0) {
        setActiveCategory(data[0].id);
        fetchCourses(data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch courses by category
  const fetchCourses = async (categoryId) => {
  try {
    setLoadingCourses(true);

    const res = await API.get(`/courses/courses/?category=${categoryId}`);

    let data = [];

    // Case 1: Paginated response
    if (Array.isArray(res.data.results)) {
      data = res.data.results;
    }
    // Case 2: Direct array response
    else if (Array.isArray(res.data)) {
      data = res.data;
    }
    // Case 3: Unexpected object
    else {
      console.warn("Unexpected courses response:", res.data);
      data = [];
    }

    setCourses(data);
  } catch (err) {
    console.error("Course fetch error:", err);
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
          <div className="text-center text-gray-500">Loading courses...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {course.instructor_name}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-indigo-600 font-bold">
                      ৳ {course.price}
                    </span>
                    <button className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ExploreCategories;