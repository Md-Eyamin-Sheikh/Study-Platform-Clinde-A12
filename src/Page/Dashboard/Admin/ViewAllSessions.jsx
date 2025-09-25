import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, DollarSign, CheckCircle, XCircle, Edit3, Trash2, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import ApprovalModal from './ApprovalModal';
import UpdateSession from './UpdateSession';
import RejectionModal from './RejectionModal';
import { Link } from "react-router-dom";


const ViewAllSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('https://study-hub-survar-a12.vercel.app/admin/sessions');
      const data = await response.json();
      setSessions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleUpdate = (session) => {
    setSelectedSession(session);
    setShowUpdateModal(true);
  };

  const handleApprove = (session) => {
    setSelectedSession(session);
    setShowApprovalModal(true);
  };

  const handleReject = (session) => {
    setSelectedSession(session);
    setShowRejectionModal(true);
  };

  const handleRejectConfirm = async (rejectionData) => {
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/admin/sessions/${selectedSession._id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rejectionData)
      });

      if (response.ok) {
        Swal.fire('Rejected!', 'Session has been rejected with feedback.', 'success');
        fetchSessions();
        setShowRejectionModal(false);
      } else {
        throw new Error('Failed to reject session');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to reject session', 'error');
    }
  };

  const handleDelete = async (sessionId) => {
    const result = await Swal.fire({
      title: 'Delete Session?',
      text: 'This will permanently delete the session!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://study-hub-survar-a12.vercel.app/admin/sessions/${sessionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Session has been deleted.', 'success');
          fetchSessions();
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete session', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[status] || badges.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-yellow-500" size={16} />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Study Sessions</h2>
        <p className="text-gray-600">Manage and approve study sessions</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === status
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-sm">
                ({status === 'all' ? sessions.length : sessions.filter(s => s.status === status).length})
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Sessions Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AnimatePresence>
          {filteredSessions.map((session, index) => (
            <motion.div
              key={session._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Session Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{session.sessionTitle}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{session.sessionDescription}</p>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${getStatusBadge(session.status)}`}>
                  {getStatusIcon(session.status)}
                  <span className="text-sm font-medium capitalize">{session.status}</span>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} />
                  <span>Tutor: {session.tutorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>Duration: {session.sessionDuration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign size={16} />
                  <span>Fee: {session.registrationFee ? `$${session.registrationFee}` : 'Free'}</span>
                </div>
              </div>

              {/* Registration Dates */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-xs text-gray-500 mb-1">Registration Period</div>
                <div className="text-sm text-gray-700">
                  {new Date(session.registrationStartDate).toLocaleDateString()} - {new Date(session.registrationEndDate).toLocaleDateString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {session.status === 'pending' ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(session)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(session)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} />
                      Reject
                    </motion.button>
                  </>
                ) : session.status === 'approved' ? (
                  <>
                    <motion.Link to='/update-session'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdate(session)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 size={16} />
                      Update
                    </motion.Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(session._id)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredSessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Eye className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No sessions found for the selected filter</p>
        </motion.div>
      )}

      {/* Approval Modal */}
      <ApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        session={selectedSession}
        onApprove={() => {
          fetchSessions();
          setShowApprovalModal(false);
        }}
      />

      {/* Update Modal */}
      <UpdateSession
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        session={selectedSession}
        onUpdate={() => {
          fetchSessions();
          setShowUpdateModal(false);
        }}
      />

      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onReject={handleRejectConfirm}
        sessionTitle={selectedSession?.title}
      />
    </div>
  );
};

export default ViewAllSessions;
