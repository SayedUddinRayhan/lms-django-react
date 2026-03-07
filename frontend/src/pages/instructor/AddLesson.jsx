import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";

export default function AddLesson() {
  const { courseId, moduleId } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    video_url: "",
    duration: 0,
    order: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/courses/lessons/", { ...form, module: moduleId });
      toast.success("Lesson added successfully!");
      navigate(
        `/dashboard/instructor/courses/${courseId}/modules/${moduleId}`
      );
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Failed to create lesson. Check your inputs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add New Lesson</h1>

      <form
        className="bg-white shadow-sm border rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video URL (YouTube/Vimeo)
          </label>
          <input
            type="url"
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            required
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min={1}
              className="w-32 border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order / Position
            </label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              min={1}
              className="w-32 border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaSave />
          {loading ? "Saving..." : "Add Lesson"}
        </button>
      </form>
    </div>
  );
}