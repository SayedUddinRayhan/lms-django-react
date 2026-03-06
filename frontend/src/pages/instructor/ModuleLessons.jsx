import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaPlus, FaEdit } from "react-icons/fa";

export default function ModuleLessons() {
  const { courseId, moduleId } = useParams(); // route: /courses/:courseId/modules/:moduleId
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch module info
        const resModule = await API.get(`/courses/modules/${moduleId}/`);
        setModule(resModule.data);

        // Fetch lessons for this module
        const resLessons = await API.get(`/courses/lessons/?module=${moduleId}`);
        setLessons(resLessons.data.results ?? resLessons.data ?? []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load module or lessons.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [moduleId]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!module) return <p className="p-6">Module not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{module.title} - Lessons</h1>
        <button
          onClick={() => navigate(`/dashboard/instructor/courses/${courseId}/modules/${moduleId}/add-lesson`)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <FaPlus /> Add Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons added yet.</p>
      ) : (
        <ul className="space-y-3">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex justify-between items-center border rounded-md p-3 hover:shadow"
            >
              <span>{lesson.title}</span>
              <Link
                to={`/dashboard/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lesson.id}/edit`}
                className="text-indigo-600 hover:underline flex items-center gap-1"
              >
                <FaEdit /> Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}