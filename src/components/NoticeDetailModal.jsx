import React from 'react';
import moment from 'moment';
import { FaSpinner, FaFileAlt, FaTimes } from 'react-icons/fa';

const NoticeDetailModal = ({ notice, onClose, loading }) => {
  if (!notice && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-2 relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-700 text-lg">
            <FaSpinner className="animate-spin text-4xl mb-3" />
            <p>Loading notice details...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <FaFileAlt className="text-blue-500 text-6xl" />
            </div>
            <div className="mb-4">
              <span className="text-2xl font-bold text-gray-600">Notice Title:</span>{" "}
              <h3 className="inline text-2xl font-bold text-gray-500">{notice.title}</h3>
            </div>
            
            <div className="mb-4">
              <span className="font-bold text-gray-600">Notice Body:</span>{" "}
              <p className="inline text-gray-500 whitespace-pre-wrap">{notice.description}</p>
            </div>

            <div className="mb-2">
              <span className="font-semibold text-gray-600">Target Department(s) or Individual:</span>{" "}
              <span className="text-gray-500">{notice.targetDepartmentOrIndividual}</span>
            </div>
            
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Notice Type:</span> {notice.noticeType}
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Status:</span> 
              <span
                className={`px-2 py-1 text-xs rounded-full text-white ml-2 ${
                  notice.status === "published" ? "bg-green-600" : notice.status === "draft" ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                {notice.status}
              </span>
            </div>
            {notice.publishingDate && (
              <div className="mb-2">
                <span className="font-semibold text-gray-800">Publish Date:</span> {moment(notice.publishingDate).format("DD MMMM YYYY")}
              </div>
            )}
            {notice.fileUrl && (
              <div className="mb-4">
                <span className="font-semibold text-gray-800">Attachment:</span>{" "}
                <a 
                  href={notice.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  View File
                </a>
              </div>
            )}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onClose}
                className="border border-gray-500 text-gray-500 font-bold px-6 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailModal;