import { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import API from "../api/apiClient";

const CoursesSection = ({ selectedCategory }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("courses/");
        setCourses(res.data);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = selectedCategory
    ? courses.filter((c) => c.category === selectedCategory)
    : courses;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8">All Courses</h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;