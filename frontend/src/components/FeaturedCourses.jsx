import { FaStar } from "react-icons/fa";

const featuredCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "John Doe",
    price: "$42",
    rating: 4.8,
    students: "110",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  },
  {
    id: 2,
    title: "UI/UX Design Essentials",
    instructor: "Sarah Lee",
    price: "$39",
    rating: 4.7,
    students: "95",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d",
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    instructor: "Michael Smith",
    price: "$55",
    rating: 4.9,
    students: "130",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
  },
];

const FeaturedCourses = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Featured Courses
          </h2>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-semibold transition">
            Browse All Courses
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <div className="relative">
                <img
                  src={course.image}
                  className="h-56 w-full object-cover group-hover:scale-105 transition"
                />
                <span className="absolute top-4 right-4 bg-indigo-600 text-white font-semibold px-3 py-1 rounded-full">
                  {course.price}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold dark:text-white group-hover:text-indigo-600 transition">
                  {course.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                  By {course.instructor}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <FaStar /> <span className="dark:text-gray-300">{course.rating}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {course.students} Students
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCourses;