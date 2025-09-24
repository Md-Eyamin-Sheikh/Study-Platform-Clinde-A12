import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const RejectionModal = ({ isOpen, onClose, onReject, sessionTitle }) => {
  const [rejectionData, setRejectionData] = useState({
    reason: '',
    response: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rejectionData.reason.trim() && rejectionData.response.trim()) {
      onReject(rejectionData);
      setRejectionData({ reason: '', response: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Reject Session</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">Session: {sessionTitle}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <input
              type="text"
              value={rejectionData.reason}
              onChange={(e) => setRejectionData(prev => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., Inappropriate content, Missing information"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Response *
            </label>
            <textarea
              value={rejectionData.response}
              onChange={(e) => setRejectionData(prev => ({ ...prev, response: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="4"
              placeholder="Provide detailed feedback to help the tutor improve..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject Session
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RejectionModal;
