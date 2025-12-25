import { useEffect, useState, forwardRef, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdAdd, MdEdit, MdCalendarToday } from "react-icons/md";
import { getNotices, updateStatus, getNoticeById, deleteNotice, updateNotice } from "../../api/noticeApi";
import Pagination from "../../components/Pagination";
import NoticeDetailModal from "../../components/NoticeDetailModal";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaEye, FaEdit, FaToggleOn, FaToggleOff, FaEllipsisV, FaSpinner, FaCheckCircle } from "react-icons/fa"; // Added FaSpinner
import { getDepartmentHexColor } from "../../utils/colors";

// Custom Input for DatePicker
const CustomDateInput = forwardRef(({ value, onClick, placeholderText, ...props }, ref) => (
  <input
    type="text"
    readOnly
    value={value}
    onClick={onClick}
    placeholder={placeholderText}
    className="outline-none bg-transparent text-gray-700 w-full cursor-pointer custom-datepicker-input-field"
    ref={ref}
    {...props}
  />
));

// Helper function to get color classes based on department/individual
const getDepartmentColorStyle = (department) => {
  return { color: getDepartmentHexColor(department) };
};

export default function NoticeBoardPage() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();
  const datePickerRef = useRef(null);

  const [popover, setPopover] = useState({ show: false, id: null });
  const popoverRef = useRef(null);

  const [kebabMenu, setKebabMenu] = useState({ show: false, id: null, position: { x: 0, y: 0 } });
  const kebabMenuRef = useRef(null);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [noticeToDeleteId, setNoticeToDeleteId] = useState(null);
  const [noticeToDeleteTitle, setNoticeToDeleteTitle] = useState("");

  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedNoticeTitle, setDeletedNoticeTitle] = useState("");

  const [loadingTable, setLoadingTable] = useState(true); // New loading state for table
  const [loadingDelete, setLoadingDelete] = useState(false); // New loading state for delete operation

  // New states for dynamic counters
  const [activeNoticesCount, setActiveNoticesCount] = useState(0);
  const [draftNoticesCount, setDraftNoticesCount] = useState(0);

  const [selectedNotices, setSelectedNotices] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    departmentsOrIndividuals: "",
    status: "",
    publishedOn: null,
  });

  useEffect(() => {
    fetchData();
  }, [page, filters]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopover({ show: false, id: null });
      }
      if (kebabMenuRef.current && !kebabMenuRef.current.contains(event.target)) {
        setKebabMenu({ show: false, id: null, position: { x: 0, y: 0 } });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, kebabMenuRef]);


  async function fetchData() {
    setLoadingTable(true); // Set loading true
    const query = new URLSearchParams({
      page: page,
      search: filters.search,
      departmentsOrIndividuals: filters.departmentsOrIndividuals,
      status: filters.status,
      publishedOn: filters.publishedOn ? moment(filters.publishedOn).format("YYYY-MM-DD") : "",
    }).toString();
    try {
      const res = await getNotices(`?${query}`);
      setData(res.data);
      setPages(res.pagination.pages);
      // Update counters from backend response
      setActiveNoticesCount(res.pagination.publishedCount);
      setDraftNoticesCount(res.pagination.draftCount);
    } catch (error) {

      setData([]); // Clear data on error
      setPages(1);
      setActiveNoticesCount(0); // Reset counts on error
      setDraftNoticesCount(0);
    } finally {
      setLoadingTable(false); // Set loading false
    }
  }

  async function toggleStatus(id, current) {
    const newStatus = current === "Published" ? "Unpublished" : "Published";
    
    setData(prevData =>
      prevData.map(item =>
        item._id === id
          ? { ...item, status: newStatus, publishedAt: newStatus === 'Published' ? new Date().toISOString() : null }
          : item
      )
    );
    setPopover({ show: false, id: null });

    try {
      await updateStatus(id, newStatus);
    } catch (error) {

      fetchData();
    }
  }

  async function openModal(id) {
    setModalLoading(true); // Set loading true immediately
    setShowModal(true); // Open modal immediately
    try {
      const notice = await getNoticeById(id);
      setSelectedNotice(notice);
    } catch (error) {

      setSelectedNotice(null); // Clear selected notice on error
    } finally {
      setModalLoading(false); // Set loading false after fetch
    }
  }

  function closeModal() {
    setShowModal(false);
    setSelectedNotice(null);
    setModalLoading(false); // Reset loading state on close
  }

  function openKebabMenu(e, id) {
    setKebabMenu({
      show: true,
      id: id,
      // Position relative to the button
      position: { x: e.currentTarget.getBoundingClientRect().right, y: e.currentTarget.getBoundingClientRect().bottom }
    });
  }

  function handleDeleteClick(id, title) { // Added title parameter
    setKebabMenu({ show: false, id: null, position: { x: 0, y: 0 } }); // Close kebab menu
    setNoticeToDeleteId(id);
    setNoticeToDeleteTitle(title); // Store the title
    setShowDeleteConfirmModal(true);
  }

  async function confirmDelete() {
    if (!noticeToDeleteId) return; // Should not happen if modal is opened correctly

    setLoadingDelete(true); // Set loading true at the start of deletion

    try {
      await deleteNotice(noticeToDeleteId);
      setData(prevData => prevData.filter(item => item._id !== noticeToDeleteId));
      setDeletedNoticeTitle(noticeToDeleteTitle); // Store title for success modal
      setShowDeleteConfirmModal(false); // Close the confirm modal AFTER successful deletion
      setShowDeleteSuccessModal(true); // Show success modal
      setNoticeToDeleteId(null); // Clear the ID after deletion
      setNoticeToDeleteTitle(""); // Clear the title after deletion
    } catch (error) {
      console.error("Failed to delete notice:", error);
      fetchData(); // Re-fetch data to ensure UI is in sync
      setShowDeleteConfirmModal(false); // Close modal even on error
    } finally {
      setLoadingDelete(false); // Set loading false after fetch completes
    }
  }

  function cancelDelete() {
    setShowDeleteConfirmModal(false);
    setNoticeToDeleteId(null);
  }

  function handleEdit(id) {
    setKebabMenu({ show: false, id: null, position: { x: 0, y: 0 } });
    navigate(`/edit-notice/${id}`);
  }

  function handleSelectAll(e) {
    if (e.target.checked) {
      const allNoticeIds = data.map(n => n._id);
      setSelectedNotices(allNoticeIds);
    } else {
      setSelectedNotices([]);
    }
  }

  function handleSelect(e, id) {
    if (e.target.checked) {
      setSelectedNotices([...selectedNotices, id]);
    } else {
      setSelectedNotices(selectedNotices.filter(noticeId => noticeId !== id));
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-gray-800">Notice Management</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/create-notice")}
            className="bg-orange-500 cursor-pointer hover:bg-orange-600 text-white font-bld py-2 px-4 rounded-lg flex items-center space-x-1"
          >
            <MdAdd className="text-lg" /> <span>Create Notice</span>
          </button>
          <button
            onClick={() => setFilters({ ...filters, status: "Draft" })}
            className="border border-yellow-500 text-yellow-500 cursor-pointer hover:border-yellow-600 hover:text-yellow-600 font-bld py-2 px-4 rounded-lg flex items-center space-x-1"
          >
            <MdEdit className="text-base" /> <span>All Draft Notice</span>
          </button>
        </div>
      </div>
      {/* Notice Counters */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-base text-green-600 font-medium">Active Notice: {activeNoticesCount}</span>
        <div className="h-5 w-px bg-gray-300"></div> {/* Vertical separator */}
        <span className="text-base text-orange-500 font-medium">Draft Notice: {draftNoticesCount}</span>
      </div>

      {/* Filters */}
      <div className="bg-whit p- rounded shadw mb-4 flex items-center flex-wrap gap-4 justify-end">
        <span className="font-medium text-gray-700">Filter by:</span>

        {/* Departments or Individuals (Moved to first) */}
        <select
          className="border border-gray-300 px-3 py-2 rounded w-60 text-gray-500"
          value={filters.departmentsOrIndividuals}
          onChange={(e) => setFilters({ ...filters, departmentsOrIndividuals: e.target.value })}
        >
          <option value="">Departments or Individuals</option>
          <option value="all departments">All Departments</option>
          <option value="finance">Finance</option>
          <option value="sales team">Sales Team</option>
          <option value="web team">Web Team</option>
          <option value="database team">Database Team</option>
          <option value="admin">Admin</option>
          <option value="individual">Individual</option>
          <option value="hr">HR</option>
        </select>

        {/* Employee ID or Name */}
        <input
          placeholder="Employee ID or Name"
          className="border border-gray-300 px-3 py-2 rounded w-48"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        {/* Status */}
        <select
          className="border border-gray-300 px-3 py-2 rounded w-23 text-gray-500"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Status</option>
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Unpublished">Unpublished</option>
        </select>

        {/* Published On Date Picker */}
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 w-58 relative">
          <label htmlFor="published-on" className="text-gray-500 text-sm mr-1 shrink-0">Published On:</label>
          <DatePicker
            selected={filters.publishedOn}
            onChange={(date) => setFilters({ ...filters, publishedOn: date })}
            dateFormat="yyyy-MM-dd"
            placeholderText="YYYY-MM-DD"
            customInput={<CustomDateInput />}
            showOnInputClick={false}
            ref={datePickerRef}
          />
          <MdCalendarToday
            className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => datePickerRef.current.setOpen(true)}
          />
        </div>
        
        {/* Removed flex-1 here as justify-end handles alignment */}
        <button
          onClick={() => {
            setFilters({ search: "", departmentsOrIndividuals: "", status: "", publishedOn: null });
            setPage(1);
          }}
          className="border border-blue-400 px-4 py-2 rounded text-sm text-blue-400 cursor-pointer hover:border-blue-500 hover:text-blue-500"
        >
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-gray-300 overflow-x-auto">
        {loadingTable ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-700 text-lg">
            <FaSpinner className="animate-spin text-4xl mb-3" />
            <p>Loading Notice Table, Please Wait...</p>
          </div>
        ) : (
          <table className="w-full text-md text-gray-600 table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left w-10"><input type="checkbox" onChange={handleSelectAll} /></th>
                <th className="p-0 text-left w-85">Title</th>
                <th className="p-0 w-40">Notice Type</th>
                <th className="pr-5 w-48">Departments/Individuals</th>
                <th className="p-3 w-32">Published On</th>
                <th className="p-3 w-28">Status</th>
                <th className="p-3 w-">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((n) => (
                <tr key={n._id} className="border-t border-gray-300 hover:bg-gray-50">
                  <td className="p-3 text-left w-8"><input type="checkbox" checked={selectedNotices.includes(n._id)} onChange={(e) => handleSelect(e, n._id)} /></td>
                  <td className="p-3 w-85 text-left ">{n.title}</td>
                  <td className="p-3 w-40 text-center truncat">{n.noticeType}</td>
                  <td className={`p-3 w-48 text-center text-md`} style={n.targetDepartmentOrIndividual ? getDepartmentColorStyle(n.targetDepartmentOrIndividual) : { color: "#6B7280" }}>
                    {n.targetDepartmentOrIndividual || '-'}
                  </td>
                  <td className="p-3 w-32 text-center">
                    {n.publishingDate ? moment(n.publishingDate).format("DD MMM YYYY") : '-'}
                  </td>
                  <td className="p-1 w-28 text-center">
                    <span
                      className={`px-3 py-1 text-sm rounded-lg ${
                        n.status === "Published" ? "bg-green-200 text-green-600 font-bold text-" : n.status === "Draft" ? "bg-yellow-200 text-yellow-600 font-bold" : "bg-gray-200 text-gray-500 font-bold"
                      }`}
                    >
                      {n.status}
                    </span>
                  </td>
                  <td className="p-3 w-32 text-center relative">
                    <button onClick={() => openModal(n._id)} className="text-blue-500 hover:text-blue-400 mr-3 text-xl cursor-pointer">
                      <FaEye />
                    </button>
                    <button
                      onClick={() => setPopover({ show: !popover.show, id: n._id })}
                      className="text-green-500 hover:text-green-400 text-xl cursor-pointer"
                    >
                      <FaEdit />
                    </button>
                    <button onClick={(e) => openKebabMenu(e, n._id)} className="text-gray-500 ml-2 hover:text-gray-400 text-lg cursor-pointer">
                      <FaEllipsisV />
                    </button>

                    {/* Popover for Publish/Unpublish Toggle */}
                    {popover.show && popover.id === n._id && (
                      <div ref={popoverRef} className="absolute right-5 bottom-10 mt-2 w-43 bg-white border rounded shadow-lg z-10">
                        <div
                          onClick={() => toggleStatus(n._id, n.status)}
                          className="flex items-center justify-between px-4 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                          <span>{n.status === "Published" ? "Unpublish" : "Publish"}</span>
                          {n.status === "Published" ? <FaToggleOn className="text-green-500 text-2xl" /> : <FaToggleOff className="text-gray-500 text-2xl" />}
                        </div>
                      </div>
                    )}

                    {/* Kebab Menu Popover */}
                    {kebabMenu.show && kebabMenu.id === n._id && (
                      <div
                        ref={kebabMenuRef}
                        className="flex flex-row absolute right-5 bottom-10 w-43 bg-white border rounded shadow-lg z-30"
                      >
                        <div
                          onClick={() => handleEdit(n._id)}
                          className="px-6 py-1 hover:bg-gray-100 cursor-pointer text-green-600"
                        >
                          Edit
                        </div>
                        <div
                          onClick={() => handleDeleteClick(n._id, n.title)}
                          className="px-6 py-1 hover:bg-gray-100 cursor-pointer text-red-600"
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-0">
        <Pagination page={page} pages={pages} setPage={setPage} />
      </div>

      {/* Notice Detail Modal */}
      {showModal && <NoticeDetailModal notice={selectedNotice} onClose={closeModal} loading={modalLoading} />}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-12 w-auto text-center shadow-xl">
            <h3 className="font-semibold text-4xl text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 text-xl mb-6">Are you sure you want to delete the notice &quot;<span className="font-bold">{noticeToDeleteTitle}</span>&quot;? <br /> This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelDelete}
                className="border border-gray-400 text-gray-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loadingDelete} // Disable button when loading
                className="bg-red-500 text-white font-bold px-6 py-2 rounded-full hover:bg-red-600 cursor-pointer flex items-center justify-center"
              >
                {loadingDelete ? <FaSpinner className="animate-spin mr-2" /> : null}
                {loadingDelete ? "Deleting ..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Success Modal */}
      {showDeleteSuccessModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-14 w-auto text-center">
            <div className="flex justify-center">
              <FaCheckCircle className="text-green-500 text-6xl" />
            </div>
            <h3 className="font-semibold text-4xl mt-4">Notice Deleted Successfully</h3>
            <p className="text-gray-500 mt-2">The notice &quot;<span className="font-bold">{deletedNoticeTitle}</span>&quot; has been permanently deleted.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteSuccessModal(false);
                  setDeletedNoticeTitle("");
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

