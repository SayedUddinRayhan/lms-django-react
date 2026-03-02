import { Star } from "lucide-react";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      <img
        src={course.thumbnail}
        alt={course.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-5">
        <h3 className="font-semibold text-lg">{course.title}</h3>

        <div className="flex items-center mt-2 text-yellow-500">
          <Star size={16} />
          <span className="ml-1 text-gray-600">{course.rating || 4.8}</span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold text-indigo-600">
            ৳{course.price}
          </span>

          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;