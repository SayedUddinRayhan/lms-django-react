import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify"; // Install: npm install dompurify
import API from "../../api/apiClient";

function CourseDetails() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedLessons, setExpandedLessons] = useState({});

  useEffect(() => {
    let isMounted = true;
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ Fixed: Single "/courses/" endpoint
        const res = await API.get(`/courses/courses/${slug}/`);
        
        if (!isMounted) return;
        setCourse(res.data);

        // Expand first module by default
        if (res.data.modules?.length) {
          setExpandedModules({ [res.data.modules[0].id]: true });
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        if (isMounted) {
          setError(err.response?.status === 404 ? "not_found" : "error");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourse();
    return () => { isMounted = false; }; // ✅ Cleanup for public pages
  }, [slug]);

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

  // ✅ XSS protection for article content (critical for public pages)
  const sanitizeHTML = (content) => ({
    __html: DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'code', 'pre'],
      ALLOWED_ATTR: []
    })
  });

  if (loading) {
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400" role="status">
        Loading...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-20 text-center text-gray-500 dark:text-gray-400">
        {error === "not_found" ? "Course not found" : "Failed to load course"}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      {/* Top Section */}
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="rounded-2xl shadow-lg object-cover w-full h-80 md:h-auto"
          loading="lazy"
          onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=No+Image"; }}
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
            <span>⭐ {course.average_rating?.toFixed(1) || "0.0"}</span>
            <span>{course.total_lessons || 0} Lessons</span>
            <span>{course.total_students?.toLocaleString() || 0} Students</span>
          </div>

          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
            {course.is_free
              ? "Free"
              : `৳ ${Number(course.price || 0).toLocaleString()}`}
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
              aria-expanded={isExpanded}
              aria-controls={`module-${module.id}-lessons`}
            >
              <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                Module {i + 1}: {module.title}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                {isExpanded ? "−" : "+"}
              </span>
            </button>

            {/* Module Lessons - Lazy rendered + accessible */}
            {isExpanded && (
              <ul 
                id={`module-${module.id}-lessons`} 
                className="pl-6 pb-4 space-y-2"
                role="region"
                aria-label={`Lessons for ${module.title}`}
              >
                {module.lessons?.length ? (
                  module.lessons.map((lesson, j) => {
                    // ✅ Critical: Default to FALSE for public users
                    const unlocked = lesson.is_unlocked ?? false;
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
                          role="button"
                          tabIndex={unlocked ? 0 : -1}
                          onKeyDown={(e) => {
                            if (unlocked && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault();
                              toggleLesson(lesson.id);
                            }
                          }}
                          aria-expanded={lessonOpen && unlocked}
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
                            {/* Show lock for non-unlocked lessons */}
                            {!unlocked && (
                              <span className="ml-2 text-gray-400" aria-label="Locked content">🔒</span>
                            )}
                          </div>
                          {lesson.duration_minutes > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {lesson.duration_minutes} min
                            </span>
                          )}
                        </div>

                        {/* Lesson Content - Only render if unlocked AND expanded */}
                        {lessonOpen && unlocked && (
                          <div 
                            className="pl-6 mt-2 text-gray-700 dark:text-gray-300 space-y-2"
                            aria-live="polite" // ✅ Announces content to screen readers
                          >
                            {lesson.content_type === "video" && lesson.video_url && (
                              <div className="aspect-video">
                                <iframe
                                  src={lesson.video_url}
                                  title={lesson.title}
                                  className="w-full h-full rounded-lg"
                                  allowFullScreen
                                  loading="lazy"
                                  sandbox="allow-same-origin allow-scripts allow-presentation"
                                />
                              </div>
                            )}
                            {lesson.content_type === "article" && lesson.content && (
                              <div
                                className="prose dark:prose-invert"
                                dangerouslySetInnerHTML={sanitizeHTML(lesson.content)}
                              />
                            )}
                            {lesson.content_type === "file" && lesson.file && (
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