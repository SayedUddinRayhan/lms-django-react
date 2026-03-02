import { Link } from "react-router-dom";

const Dashboard = () => {
  const courses = [
    { id: 1, title: "React Masterclass", progress: 70 },
    { id: 2, title: "Django API Bootcamp", progress: 45 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 text-2xl font-bold text-indigo-600">
          SkillForge
        </div>

        <nav className="mt-6 space-y-4 px-6">
          <Link to="/dashboard" className="block text-gray-700 font-medium">
            Dashboard
          </Link>
          <Link to="/" className="block text-gray-700 font-medium">
            Browse Courses
          </Link>
          <Link to="/profile" className="block text-gray-700 font-medium">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Welcome Back 👋</h1>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Enrolled Courses</h3>
            <p className="text-3xl font-bold mt-2">2</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Completed</h3>
            <p className="text-3xl font-bold mt-2">1</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">Certificates</h3>
            <p className="text-3xl font-bold mt-2">1</p>
          </div>
        </div>

        {/* My Courses */}
        <h2 className="text-2xl font-bold mb-6">My Courses</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <h3 className="font-semibold text-lg">{course.title}</h3>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {course.progress}% Completed
                </p>
              </div>

              <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg">
                Continue
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;