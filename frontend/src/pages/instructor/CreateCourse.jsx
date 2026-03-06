import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/apiClient";
import { FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    is_free: false,
    status: "draft",
    thumbnail: null,
  });
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/courses/categories/");
      setCategories(res.data.results ?? res.data ?? []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    
    // Required fields for CourseSerializer
    formData.append("title", form.title);
    formData.append("description", form.description);

    // Category must be ID (integer)
    if (form.category) {
      formData.append("category", form.category);
    }

    // Thumbnail if selected
    if (form.thumbnail) {
      formData.append("thumbnail", form.thumbnail);
    }

    // Optional fields if your model has them
    if (form.is_free) {
      formData.append("is_free", form.is_free); // If serializer expects boolean
      formData.append("price", 0); // Override price if free
    } else {
      formData.append("price", form.price);
    }

    // Status only if your serializer/model has it
    if (form.status) {
      formData.append("status", form.status);
    }

    const res = await API.post("/courses/courses/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Course created successfully!");
    navigate(`/dashboard/instructor/courses/${res.data.id}/modules`);
  } catch (error) {
    console.error(error);
    const msg =
      error.response?.data ||
      "Failed to create course. Check your inputs.";
    toast.error(JSON.stringify(msg));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create New Course</h1>
      <p className="text-gray-500 text-sm">
        Fill in the details to create a course.
      </p>

      <form
        className="bg-white shadow-sm border rounded-xl p-6 space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Enter course title"
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
            required
            rows={4}
            placeholder="Write a brief description of the course"
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          {categoryLoading ? (
            <p className="text-gray-500 text-sm">Loading categories...</p>
          ) : (
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Image
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm"
          />
        </div>

        {/* Price / Free */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min={0}
              step={0.01}
              disabled={form.is_free}
              className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              name="is_free"
              checked={form.is_free}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-gray-700 text-sm">Free Course</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
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
          {loading ? "Saving..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}