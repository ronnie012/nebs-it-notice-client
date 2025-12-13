import React from 'react';
import moment from 'moment';

const NoticeDetailModal = ({ notice, onClose, loading }) => {
  if (!notice && !loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-2 relative">
        {loading ? (
          <div className="text-center py-8">Loading notice details...</div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">{notice.title}</h3>
            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{notice.description}</p>
            
            <div className="mb-2">
              <span className="font-semibold">Notice Type:</span> {notice.noticeType}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span> 
              <span
                className={`px-2 py-1 text-xs rounded-full text-white ml-2 ${
                  notice.status === "published" ? "bg-green-600" : notice.status === "draft" ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                {notice.status}
              </span>
            </div>
            {notice.publishedAt && (
              <div className="mb-2">
                <span className="font-semibold">Published On:</span> {moment(notice.publishedAt).format("DD MMMM YYYY")}
              </div>
            )}
            {notice.fileUrl && (
              <div className="mb-4">
                <span className="font-semibold">Attachment:</span>{" "}
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
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default NoticeDetailModal;