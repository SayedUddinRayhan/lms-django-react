import { useEffect, useState } from "react";
import API from "../../api/axios";
import CourseCard from "../../components/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    API.get("/courses/").then((res) => setCourses(res.data.results));
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Explore Courses</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}