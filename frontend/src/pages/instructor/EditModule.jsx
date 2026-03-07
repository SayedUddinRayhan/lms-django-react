import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/apiClient";
import { toast } from "react-toastify";
import { FaSave } from "react-icons/fa";

export default function EditModule() {
  const { moduleId } = useParams(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

 
  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await API.get(`/courses/modules/${moduleId}/`);
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          order: res.data.order || 1,
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load module data.");
      } finally {
        setFetching(false);
      }
    };
    fetchModule();
  }, [moduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put(`/courses/modules/${moduleId}/`, form);
      toast.success("Module updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Failed to update module. Check your inputs.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p className="p-6">Loading module data...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Module</h1>

      <form
        className="bg-white shadow-sm border rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
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
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
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

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <FaSave />
          {loading ? "Updating..." : "Update Module"}
        </button>
      </form>
    </div>
  );
}