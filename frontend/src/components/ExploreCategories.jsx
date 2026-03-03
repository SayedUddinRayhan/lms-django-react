import { useState, useEffect } from "react";
import { HiChevronRight } from "react-icons/hi";

import API from "../api/apiClient";

function ExploreCategories() {
  const [categories, setCategories] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await API.get("/courses/categories");
      console.log(response.data);
      setCategories(response.data.results);
      setCount(response.data.results.length);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);



  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 transition">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Browse By Category
          </h2>
          <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:underline">
            View All Categories <HiChevronRight />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-8 text-center hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {cat.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {cat.count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;