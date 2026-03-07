import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/apiClient";

export default function CourseDetails() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});

  useEffect(() => {
    let mounted = true;

    const fetchCourse = async () => {
      try {
        setLoading(true);

        const res = await API.get(`/courses/public/courses/${slug}/`);

        if (!mounted) return;

        setCourse(res.data);

      } catch (err) {
        console.error(err);
        if (mounted) {
          setError(err.response?.status === 404 ? "not_found" : "error");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCourse();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-gray-500 dark:text-gray-400">
        Loading course...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="py-32 text-center text-gray-500 dark:text-gray-400">
        {error === "not_found"
          ? "Course not found"
          : "Failed to load course"}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      <div className="grid md:grid-cols-2 gap-10">

        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="w-full h-80 object-cover rounded-xl shadow"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/600x400?text=No+Image";
          }}
        />

        <div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {course.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Instructor: {course.instructor_name}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
            {course.description}
          </p>

          <div className="flex gap-6 text-gray-700 dark:text-gray-300 mb-6">
            <span>{course.total_modules} Modules</span>
            <span>{course.total_lessons} Lessons</span>
          </div>

          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
            {course.is_free
              ? "Free"
              : `৳ ${Number(course.price || 0).toLocaleString()}`}
          </div>

          <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            Enroll Now
          </button>

        </div>
      </div>

      {/* CURRICULUM */}

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Course Curriculum
        </h2>

        <div className="space-y-4">
          {course.modules?.length ? (
            course.modules.map((module, i) => {
              const expanded = expandedModules[module.id];

              return (
                <div
                  key={module.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
                >

                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      Module {i + 1}: {module.title}
                    </span>

                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {expanded ? "−" : "+"}
                    </span>
                  </button>

                  {/* Lessons */}
                  {expanded && (
                    <ul className="px-6 pb-4 space-y-2">
                      {module.lessons?.length ? (
                        module.lessons.map((lesson, j) => (
                          <li
                            key={lesson.id}
                            className="flex justify-between items-center text-gray-700 dark:text-gray-300 py-2"
                          >
                            <div className="flex items-center gap-3">
                              <span>{j + 1}.</span>
                              <span>{lesson.title}</span>
                              <span className="px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200">
                                {lesson.content_type}
                              </span>
                              <span className="text-gray-400 dark:text-gray-500">
                                🔒
                              </span>
                            </div>

                            {lesson.duration_minutes > 0 && (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {lesson.duration_minutes} min
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 dark:text-gray-400">
                          No lessons available
                        </li>
                      )}
                    </ul>
                  )}

                </div>
              );
            })
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No modules available for this course.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}