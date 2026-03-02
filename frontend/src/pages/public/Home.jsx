// src/pages/public/Home.jsx
import { useState, useEffect } from "react";
import Hero from "../../components/Hero";
import CourseCard from "../../components/CourseCard";

const Home = () => {
  const [courses, setCourses] = useState([]);

  // Example: fetch courses later
  // useEffect(() => {
  //   fetch("/api/courses")
  //     .then(res => res.json())
  //     .then(data => setCourses(data));
  // }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />

      {/* Courses Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Popular Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map(course => <CourseCard key={course.id} course={course} />)
            ) : (
              <p className="text-center col-span-full">No courses available</p>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
        <p className="mb-6">Explore thousands of courses from top instructors.</p>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;