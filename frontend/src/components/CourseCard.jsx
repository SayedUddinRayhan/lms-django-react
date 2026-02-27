import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition">
      <img
        src={course.thumbnail}
        className="h-48 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{course.title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          ⭐ {course.average_rating || 0}
        </p>
        <p className="text-primary font-semibold">
          {course.is_free ? "Free" : `৳ ${course.price}`}
        </p>
        <Link
          to={`/courses/${course.slug}`}
          className="block mt-3 bg-primary text-white text-center py-2 rounded-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}