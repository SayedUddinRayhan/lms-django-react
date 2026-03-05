import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/apiClient";

function CourseDetails() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/courses/courses/${slug}/`);
      setCourse(res.data);

      // Expand first module by default
      if (res.data.modules?.length) {
        setExpandedModules({ [res.data.modules[0].id]: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (id) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleLesson = (id) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );

  if (!course)
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400">
        Course not found
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="rounded-2xl shadow-lg object-cover w-full h-80 md:h-auto"
        />
        <div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {course.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {course.instructor_name}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6 whitespace-pre-line">
            {course.description}
          </p>

          <div className="flex items-center gap-6 mb-6 text-gray-800 dark:text-gray-200">
            <span>⭐ {course.average_rating?.toFixed(1)}</span>
            <span>{course.total_lessons} Lessons</span>
            <span>{course.total_students} Students</span>
          </div>

          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
            {course.is_free
              ? "Free"
              : `৳ ${Number(course.price).toLocaleString()}`}
          </div>

          <button className="bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
            Enroll Now
          </button>
        </div>
      </div>

      {/* Collapsible Curriculum */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Course Curriculum
        </h2>
        <div className="space-y-4">
          {course.modules?.length ? (
            course.modules.map((module, i) => {
              const isExpanded = !!expandedModules[module.id];
              return (
                <div
                  key={module.id}
                  className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
                >
                  {/* Module Header */}
                  <button
                    className="w-full px-4 py-3 flex justify-between items-center focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    onClick={() => toggleModule(module.id)}
                  >
                    <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      Module {i + 1}: {module.title}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                      {isExpanded ? "-" : "+"}
                    </span>
                  </button>

                  {/* Module Lessons */}
                  {isExpanded && (
                    <ul className="pl-6 pb-4 space-y-2">
                      {module.lessons?.length ? (
                        module.lessons.map((lesson, j) => {
                          const unlocked = lesson.is_unlocked ?? true;
                          const lessonOpen = !!expandedLessons[lesson.id];

                          return (
                            <li key={lesson.id} className="space-y-1">
                              <div
                                className={`flex justify-between items-center p-2 rounded transition
                                  ${unlocked
                                    ? "text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                                    : "text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-70"
                                  }`}
                                onClick={() => unlocked && toggleLesson(lesson.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{j + 1}.</span>
                                  <span>{lesson.title}</span>
                                  <span
                                    className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold
                                      ${lesson.content_type === "video"
                                        ? "bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100"
                                        : lesson.content_type === "article"
                                          ? "bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-100"
                                          : "bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100"
                                      }`}
                                  >
                                    {lesson.content_type}
                                  </span>
                                </div>
                                {lesson.duration_minutes > 0 && (
                                  <span
                                    className={`text-sm ${
                                      unlocked
                                        ? "text-gray-500 dark:text-gray-400"
                                        : "text-gray-400 dark:text-gray-500"
                                    }`}
                                  >
                                    {lesson.duration_minutes} min
                                  </span>
                                )}
                              </div>

                              {/* Lesson Content */}
                              {lessonOpen && unlocked && (
                                <div className="pl-6 mt-2 text-gray-700 dark:text-gray-300 space-y-2">
                                  {lesson.content_type === "video" &&
                                    lesson.video_url && (
                                      <div className="aspect-video">
                                        <iframe
                                          src={lesson.video_url}
                                          title={lesson.title}
                                          className="w-full h-full rounded-lg"
                                          allowFullScreen
                                        />
                                      </div>
                                  )}
                                  {lesson.content_type === "article" &&
                                    lesson.content && (
                                      <div
                                        className="prose dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                          __html: lesson.content,
                                        }}
                                      />
                                  )}
                                  {lesson.content_type === "file" &&
                                    lesson.file && (
                                      <a
                                        href={lesson.file}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 dark:text-indigo-400 underline"
                                      >
                                        Download File
                                      </a>
                                  )}
                                </div>
                              )}
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-gray-500 dark:text-gray-400 p-2">
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

export default CourseDetails;