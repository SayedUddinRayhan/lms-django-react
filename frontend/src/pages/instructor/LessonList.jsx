import { useEffect, useState } from "react";
import API from "../../api/apiClient";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function LessonList() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await API.get("/courses/all_lessons/");
        setModules(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch lessons");
      }
    };
    fetchModules();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Lessons</h1>
      <Link
        to="/dashboard/instructor/courses/1/lessons/add"
        className="mb-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Add Lesson
      </Link>
      <ul className="space-y-2">
        {modules.map((mod) => (
          <li key={mod.id} className="border p-3 rounded">
            {mod.title}
          </li>
        ))}
      </ul>
    </div>
  );
}