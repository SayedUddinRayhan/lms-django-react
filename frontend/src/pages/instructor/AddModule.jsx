import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";

export default function AddModule() {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "",
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
      const payload = { ...form, course: courseId };

      const res = await API.post("/courses/modules/", payload);

      toast.success("Module added successfully!");


      navigate(`/dashboard/instructor/courses/${courseId}/modules`);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Failed to add module. Check your inputs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Add New Module</h1>
      <p className="text-gray-500 text-sm">Add a new module to your course.</p>

      <form
        className="bg-white shadow-sm border rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Module Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter module title"
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Brief description (optional)"
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Order */}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaSave />
          {loading ? "Saving..." : "Add Module"}
        </button>
      </form>
    </div>
  );
}