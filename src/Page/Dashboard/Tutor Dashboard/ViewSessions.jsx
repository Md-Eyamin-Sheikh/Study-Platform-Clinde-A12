import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiRefreshCw, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const ViewSessions = () => {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/tutor/sessions/${user.email}`);
      const result = await response.json();
      
      if (result.success) {
        setSessions(result.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const handleResubmit = async (sessionId) => {
    const result = await Swal.fire({
      title: 'Resubmit Session?',
      text: 'This will change the status from rejected to pending.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, resubmit!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`https://study-hub-survar-a12.vercel.app/api/tutor/sessions/${sessionId}/resubmit`, {
          method: 'PUT'
        });
        
        const result = await response.json();
        
        if (result.success) {
          setSessions(prev => 
            prev.map(session => 
              session._id === sessionId 
                ? { ...session, status: 'pending' }
                : session
            )
          );
          
          Swal.fire({
            title: 'Resubmitted!',
            text: 'Your session has been resubmitted for approval.',
            icon: 'success',
            confirmButtonColor: '#3B82F6'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to resubmit session.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FiCheck className="text-green-500" />;
      case 'pending':
        return <FiClock className="text-yellow-500" />;
      case 'rejected':
        return <FiX className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Study Sessions</h2>
          <p className="text-gray-600">View and manage your study sessions</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'approved', 'pending', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiEye size={48} className="mx-auto mb-4 opacity-50" />
              <p>No sessions found for the selected filter.</p>
            </div>
          ) : (
            filteredSessions.map((session, index) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {session.sessionTitle}
                      </h3>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="capitalize">{session.status}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {session.sessionDescription}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Duration:</span> {session.sessionDuration}h
                      </div>
                      <div>
                        <span className="font-medium">Registration:</span> {new Date(session.registrationStartDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Class Date:</span> {new Date(session.classStartDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Fee:</span> ${session.registrationFee}
                      </div>
                    </div>

                    {/* Rejection Details */}
                    {session.status === 'rejected' && session.rejectionReason && (
                      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Rejection Details</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-red-700">Reason:</span>
                            <span className="text-red-600 ml-2">{session.rejectionReason}</span>
                          </div>
                          <div>
                            <span className="font-medium text-red-700">Response:</span>
                            <p className="text-red-600 mt-1">{session.rejectionResponse}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {session.status === 'rejected' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleResubmit(session._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        <FiRefreshCw size={16} />
                        <span className="hidden sm:inline">Resubmit</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewSessions;
