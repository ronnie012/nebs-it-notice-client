import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUpload,
  FaPaperclip,
  FaTimes,
  FaCheck,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { getNoticeById, updateNotice } from "../api/noticeApi";

export default function EditNotice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    noticeType: "",
    targetDepartmentOrIndividual: "",
    employeeId: "",
    employeeName: "",
    position: "",
    publishingDate: "",
    attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchNotice() {
      try {
        const notice = await getNoticeById(id);
        setForm({
          title: notice.title,
          description: notice.description,
          noticeType: notice.noticeType,
          targetDepartmentOrIndividual: notice.targetDepartmentOrIndividual,
          employeeId: notice.employeeId,
          employeeName: notice.employeeName,
          position: notice.position,
          publishingDate: notice.publishingDate
            ? notice.publishingDate.split("T")[0]
            : "",
          attachment: notice.attachment,
        });
      } catch (error) {
        console.error("Failed to fetch notice for editing:", error);
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
    if (!form.targetDepartmentOrIndividual)
      err.targetDepartmentOrIndividual =
        "Target Department(s) or Individual is required";
    if (!form.employeeId) err.employeeId = "Employee ID is required";
    if (!form.employeeName) err.employeeName = "Employee Name is required";
    if (!form.position) err.position = "Position is required";
    return err;
  }

  async function handleSubmit(e, status) {
    e.preventDefault();

    const err = validate();
    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setSaving(true);
    try {
      await updateNotice(id, { ...form, status: status || form.status });
      setSuccess(true);
    } catch (error) {
      console.error("Error updating notice:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-52 text-gray-700 text-lg">
        <FaSpinner className="animate-spin text-4xl mb-3" />
        <p>Loading Edit Notice Page, Please Wait...</p>
      </div>
    );
    // return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate("/notice-board")}
          className="bg-white p-2 rounded-md border text-gray-500 cursor-pointer"
        >
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-semibold text-gray-500">Edit Notice</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 w-full">
        <h3 className="text-lg font-semibold mb-4 text-gray-500">
          Please fill in the details below
        </h3>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
          {/* Target Department(s) or Individual */}
          <div className="bg-gray-100 rounded-lg p-6">
            <label className="block font-medium mb-1 text-gray-500">
              Target Department(s) or Individual{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              name="targetDepartmentOrIndividual"
              value={form.targetDepartmentOrIndividual}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
            >
              <option value="">Select One Option</option>
              <option value="All Departments" style={{ color: "#FF5733" }}>
                All Departments
              </option>
              <option value="Individual" style={{ color: "#008000" }}>
                Individual
              </option>
              <option value="Finance" style={{ color: "#3357FF" }}>
                Finance
              </option>
              <option value="Sales Team" style={{ color: "#FF33A1" }}>
                Sales Team
              </option>
              <option value="Web Team" style={{ color: "#B8860B" }}>
                Web Team
              </option>
              <option value="Database Team" style={{ color: "#A133FF" }}>
                Database Team
              </option>
              <option value="Admin" style={{ color: "#008B8B" }}>
                Admin
              </option>
              <option value="HR" style={{ color: "#FF9633" }}>
                HR
              </option>
            </select>
            {errors.targetDepartmentOrIndividual && (
              <p className="text-red-500 text-sm">
                {errors.targetDepartmentOrIndividual}
              </p>
            )}
          </div>

          {/* Notice Title */}
          <div>
            <label className="block font-medium text-gray-500">
              Notice Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Write the Title of Notice"
              className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          {/* Employee ID, Employee Name, Position */}
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block font-medium text-gray-500">
                Select Employee ID <span className="text-red-500">*</span>
              </label>
              <select
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
              >
                <option value="">Select Employee Designation</option>
                <option value="E-12345">Admin _ E-12345</option>
                <option value="E-12346">Web Developer _ E-12346</option>
                <option value="E-12347">HR _ E-12347</option>
              </select>
              {errors.employeeId && (
                <p className="text-red-500 text-sm">{errors.employeeId}</p>
              )}
            </div>
            <div className="w-1/3">
              <label className="block font-medium text-gray-500">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                name="employeeName"
                value={form.employeeName}
                onChange={handleChange}
                placeholder="Enter employee's full name"
                className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
              />
              {errors.employeeName && (
                <p className="text-red-500 text-sm">{errors.employeeName}</p>
              )}
            </div>
            <div className="w-1/3">
              <label className="block font-medium text-gray-500">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Enter employee's department"
                className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
              />
              {errors.position && (
                <p className="text-red-500 text-sm">{errors.position}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {/* Notice Type */}
            <div className="w-1/2">
              <label className="block font-medium text-gray-500">
                Notice Type <span className="text-red-500">*</span>
              </label>
              <select
                name="noticeType"
                value={form.noticeType}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
              >
                <option value="">Select Notice Type</option>
                <option value="General">Warning / Disciplinary</option>
                <option value="Urgent">Performance Improvement</option>
                <option value="Exam">Appreciation / Recognition</option>
                <option value="Exam">Attendance / Leave Issue</option>
                <option value="Exam">Payroll / Compensation</option>
                <option value="Exam">Contract / Role Update</option>
                <option value="Exam">Advisory / Personal Reminder</option>
              </select>
              {errors.noticeType && (
                <p className="text-red-500 text-sm">{errors.noticeType}</p>
              )}
            </div>

            {/* Publishing Date */}
            <div className="w-1/2">
              <label className="block font-medium text-gray-500">
                Publishing Date
              </label>
              <input
                type="date"
                name="publishingDate"
                value={form.publishingDate}
                onChange={handleChange}
                placeholderText="Select publishing date"
                className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
              />
            </div>
          </div>

          {/* Notice Body */}
          <div>
            <label className="block font-medium text-gray-500">
              Notice Body <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write details about the notice."
              className="w-full border rounded px-3 py-2 mt-1 text-gray-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-medium text-gray-500">
              Upload Attachments (Optional)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 cursor-pointer" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  >
                    <span>Upload</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) =>
                        setForm({ ...form, attachment: e.target.files[0] })
                      }
                    />
                  </label>
                  <p className="pl-1">
                    nominee profile image or drag and drop.
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Accepted File Type: .jpg, .png
                </p>
              </div>
            </div>
            {form.attachment && (
              <div className="mt-2 bg-gray-100 rounded-lg p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaPaperclip className="text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {form.attachment.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, attachment: null })}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end items-center text-right space-x-4">
            <button
              type="button"
              onClick={() => navigate("/notice-board")}
              className="border border-gray-400 text-gray-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "Draft")}
              disabled={saving}
              className="border border-blue-400 text-blue-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-2 rounded-full hover:bg-orange-600 cursor-pointer"
            >
              <FaCheck /> {saving ? "Updating..." : "Update Notice"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-14 w-auto text-center">
            <div className="flex justify-center">
              <FaCheckCircle className="text-green-500 text-6xl" />
            </div>
            <h3 className="font-semibold text-4xl mt-4">
              Notice Updated Successfully
            </h3>
            <p className="text-gray-500 mt-2">
              Your notice "{form.title} - {form.publishingDate}" has been
              updated.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => navigate("/notice-board")}
                className="border border-blue-500 text-blue-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                View Notice
              </button>
              <button
                onClick={() => {
                  setSuccess(false);
                  navigate("/notice-board");
                }}
                className="border border-gray-500 text-gray-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
