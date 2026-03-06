// src/pages/student/StudentCourseDetail.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/apiClient";
import { FaPlayCircle, FaCheckCircle, FaFileVideo, FaFileAlt } from "react-icons/fa";

export default function StudentCourseDetail() {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const videoRef = useRef(null);

  // Detect lesson type
  const getLessonType = (lesson) => {
    if (!lesson) return null;
    if (lesson.video_url && lesson.video_url.includes("youtu")) return "youtube";
    if (lesson.file) return "file";
    return null;
  };

  // Calculate course progress
  const getCourseProgress = () => {
    if (!course) return 0;
    let total = 0;
    let completed = 0;
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        if (getLessonType(lesson)) {
          total += 1;
          if (lesson.is_completed) completed += 1;
        }
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // Fetch course and pick first playable lesson
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetail = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/courses/student/courses/${courseId}/lessons/`);
        setCourse(res.data);

        outerLoop:
        for (let module of res.data.modules) {
          for (let lesson of module.lessons) {
            if (getLessonType(lesson)) {
              setCurrentLesson(lesson);
              break outerLoop;
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

  // Mark lesson as completed and move to next
  const handleLessonComplete = async (lesson) => {
    if (!lesson || lesson.is_completed) return;

    try {
      // Update lesson completion in API
      await API.post(`/courses/student/lessons/${lesson.id}/complete/`);
      // Update local state
      setCourse((prev) => {
        const updated = { ...prev };
        for (let module of updated.modules) {
          for (let l of module.lessons) {
            if (l.id === lesson.id) l.is_completed = true;
          }
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
    }

    handleNextLesson();
  };

  // Move to next lesson
  const handleNextLesson = () => {
    if (!course || !currentLesson) return;

    let foundCurrent = false;
    outerLoop:
    for (let module of course.modules) {
      for (let lesson of module.lessons) {
        const playable = getLessonType(lesson);
        if (!playable) continue;

        if (foundCurrent) {
          setCurrentLesson(lesson);
          break outerLoop;
        }
        if (lesson.id === currentLesson.id) {
          foundCurrent = true;
        }
      }
    }
  };

  if (loading)
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!course)
    return <p className="text-center mt-10 text-gray-500">Course not found.</p>;

  const lessonType = getLessonType(currentLesson);
  const progress = getCourseProgress();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-500 mt-2">{course.description}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
        <div
          className="bg-indigo-600 h-4 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-500 mt-1">{progress}% completed</p>

      {/* Video Player */}
      {currentLesson && lessonType === "file" && (
        <div className="mt-4 w-full aspect-video rounded-md overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={encodeURI(currentLesson.file)}
            controls
            width="100%"
            height="100%"
            onEnded={() => handleLessonComplete(currentLesson)}
            autoPlay
          />
        </div>
      )}

      {currentLesson && lessonType === "youtube" && (
        <div className="mt-4 w-full aspect-video rounded-md overflow-hidden bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${extractYoutubeId(currentLesson.video_url)}?autoplay=1&rel=0&enablejsapi=1`}
            title={currentLesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {!lessonType && <p className="text-gray-500 mt-2">No playable video.</p>}

      {/* Modules and Lessons */}
      {course.modules.map((module) => (
        <div key={module.id} className="border rounded-lg p-4 mt-4">
          <h2 className="font-semibold">{module.title}</h2>
          {module.lessons.map((lesson) => {
            const isActive = currentLesson?.id === lesson.id;
            const playable = getLessonType(lesson);
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
                  {lesson.is_completed && <FaCheckCircle className="inline text-green-500" />}
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

// Extract YouTube video ID from URL
function extractYoutubeId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}