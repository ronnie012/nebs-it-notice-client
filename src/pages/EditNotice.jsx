import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoticeById, updateNotice } from "../api/noticeApi";
import { FaSpinner } from "react-icons/fa"; // Added FaSpinner

export default function EditNotice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    noticeType: "",
    publishingDate: "",
    status: "", // Include status for editing
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [saving, setSaving] = useState(false); // Loading state for saving changes
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchNotice() {
      try {
        const notice = await getNoticeById(id);
        setForm({
          title: notice.title,
          description: notice.description,
          noticeType: notice.noticeType,
          publishingDate: notice.publishingDate ? notice.publishingDate.split('T')[0] : "", // Format date for input
          status: notice.status,
        });
      } catch (error) {
        console.error("Failed to fetch notice for editing:", error);
        // Optionally navigate away or show error
      } finally {
        setLoading(false);
      }
    }
    fetchNotice();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const err = {};
    if (!form.title) err.title = "Title is required";
    if (!form.description) err.description = "Description is required";
    if (!form.noticeType) err.noticeType = "Notice type is required";
    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setSaving(true);
    try {
      await updateNotice(id, form);
      setSuccess(true);
      // Optionally navigate back to notice board after successful update
      navigate("/notice-board");
    } catch (error) {
      console.error("Error updating notice:", error);
      // Handle error state
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-700 text-lg">
        <FaSpinner className="animate-spin text-4xl mb-3" />
        <p>Loading notice details for editing...</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Edit Notice</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block font-medium">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2 mt-1"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          {/* Notice Type */}
          <div>
            <label className="block font-medium">
              Notice Type <span className="text-red-500">*</span>
            </label>
            <select
              name="noticeType"
              value={form.noticeType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="">Select</option>
              <option value="General">General</option>
              <option value="Urgent">Urgent</option>
              <option value="Exam">Exam</option>
            </select>
            {errors.noticeType && <p className="text-red-500 text-sm">{errors.noticeType}</p>}
          </div>

          {/* Publishing Date */}
          <div>
            <label className="block font-medium">Publishing Date</label>
            <input
              type="date"
              name="publishingDate"
              value={form.publishingDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-medium">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            >
              <option value="draft">Draft</option>
              <option value="unpublished">Unpublished</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 text-center">
            <h3 className="font-semibold text-lg mb-2">
              Notice Updated Successfully
            </h3>
            <button
              onClick={() => { setSuccess(false); navigate("/notice-board"); }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}