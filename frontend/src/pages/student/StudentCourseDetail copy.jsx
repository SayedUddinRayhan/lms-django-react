// src/pages/student/StudentCourseDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/apiClient";
import { FaPlayCircle, FaCheckCircle, FaFileVideo, FaFileAlt } from "react-icons/fa";
import ReactPlayer from "react-player";

export default function StudentCourseDetail() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);

  // Helper: return playable URL for ReactPlayer
  const getVideoSource = (lesson) => {
  if (!lesson) return null;

  // 1️⃣ YouTube / Vimeo / other ReactPlayer supported URLs
  if (lesson.video_url && ReactPlayer.canPlay(lesson.video_url)) {
    return lesson.video_url;
  }

  // 2️⃣ Local uploaded file (assume API returns absolute URL)
  if (lesson.file) {
    return lesson.file; // Use as is, no base URL prepending
  }

  return null;
};

  // Fetch course details
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetail = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/courses/student/courses/${courseId}/lessons/`);
        console.log(res.data);
        setCourse(res.data);

        // Pick first playable lesson as default
        for (let module of res.data.modules) {
          for (let lesson of module.lessons) {
            if (getVideoSource(lesson)) {
              setCurrentLesson(lesson);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">Loading...</div>
    );

  if (!course)
    return <p className="text-center mt-10 text-gray-500">Course not found.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-500 mt-2">{course.description}</p>

      {/* Video Player */}
      {currentLesson?.content_type === 'video' && currentLesson?.file ? (
  <video
    src={currentLesson.file}
    controls
    width="100%"
    height="100%"
    className="rounded-md"
  />
) : currentLesson?.video_url ? (
  <ReactPlayer
    url={currentLesson.video_url}
    controls
    width="100%"
    height="100%"
  />
) : (
  <p className="text-gray-500 mt-2">No playable video.</p>
)}

      {/* Modules and Lessons */}
      {course.modules.map((module) => (
        <div key={module.id} className="border rounded-lg p-4 mt-4">
          <h2 className="font-semibold">{module.title}</h2>
          {module.lessons.map((lesson) => {
            const isActive = currentLesson?.id === lesson.id;
            const playable = getVideoSource(lesson);
            return (
              <button
                key={lesson.id}
                onClick={() => playable && setCurrentLesson(lesson)}
                disabled={!playable}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded mt-2
                  ${isActive ? "bg-indigo-100 text-indigo-700 font-semibold" : "text-gray-700"}
                  ${!playable ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
              >
                <span className="flex items-center gap-2">
                  {lesson.title}
                  {lesson.is_completed && (
                    <FaCheckCircle className="inline text-green-500" />
                  )}
                  {/* Icon based on content type */}
                  {lesson.content_type === "video" && <FaFileVideo className="inline text-gray-400" />}
                  {lesson.content_type === "article" && <FaFileAlt className="inline text-gray-400" />}
                </span>
                <FaPlayCircle className={`${isActive ? "text-indigo-700" : "text-indigo-600"}`} />
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}