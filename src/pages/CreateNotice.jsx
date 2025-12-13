import { useState } from "react";
import { createNotice } from "../api/noticeApi";

export default function CreateNotice() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    noticeType: "",
    publishingDate: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

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

  async function handleSubmit(e, status = "published") {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    if (status === "published") {
      setLoadingPublish(true);
    } else {
      setLoadingDraft(true);
    }

    try {
      await createNotice({ ...form, status });
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        noticeType: "",
        publishingDate: "",
      });
    } catch (error) {
      console.error("Error creating notice:", error);
      // Handle error state if needed
    } finally {
      setLoadingPublish(false);
      setLoadingDraft(false);
    }
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Create Notice</h2>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <form onSubmit={(e) => handleSubmit(e, "published")} className="space-y-5">

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

          {/* Submit Buttons */}
          <div className="text-right space-x-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={loadingDraft || loadingPublish}
              className="border border-gray-400 text-gray-700 px-6 py-2 rounded hover:bg-gray-100"
            >
              {loadingDraft ? "Saving Draft..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={loadingPublish || loadingDraft}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loadingPublish ? "Publishing..." : "Publish Notice"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 text-center">
            <h3 className="font-semibold text-lg mb-2">
              Notice Created Successfully
            </h3>
            <button
              onClick={() => setSuccess(false)}
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
