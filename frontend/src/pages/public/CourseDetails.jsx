import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();

  const course = {
    title: "React & Tailwind Masterclass",
    description:
      "Build production-ready applications using React and Tailwind CSS.",
    price: 4999,
    lessons: [
      "Introduction to React",
      "Components & Props",
      "State & Hooks",
      "Tailwind Layout System",
      "Deploying to Production",
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="mt-4 max-w-2xl">{course.description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        
        {/* Left Content */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>

          <div className="bg-white rounded-2xl shadow divide-y">
            {course.lessons.map((lesson, index) => (
              <div key={index} className="p-4">
                {lesson}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit sticky top-20">
          <h3 className="text-3xl font-bold text-indigo-600">
            ৳{course.price}
          </h3>

          <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700">
            Enroll Now
          </button>

          <ul className="mt-6 space-y-3 text-gray-600 text-sm">
            <li>✔ Full Lifetime Access</li>
            <li>✔ Certificate Included</li>
            <li>✔ Mentor Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;