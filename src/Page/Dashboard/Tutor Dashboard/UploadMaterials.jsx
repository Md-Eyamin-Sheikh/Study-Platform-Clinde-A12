import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiLink, FiImage, FiCheck } from 'react-icons/fi';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const UploadMaterials = () => {
  const { user } = useContext(AuthContext);
  const [approvedSessions, setApprovedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    driveLink: ''
  });

  // Mock approved sessions - replace with actual API call
  const mockApprovedSessions = [
    {
      id: 1,
      sessionTitle: 'Advanced React Concepts',
      status: 'approved'
    },
    {
      id: 2,
      sessionTitle: 'JavaScript ES6+ Features',
      status: 'approved'
    },
    {
      id: 3,
      sessionTitle: 'Node.js Fundamentals',
      status: 'approved'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch approved sessions
    setApprovedSessions(mockApprovedSessions);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSession) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a study session.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
      return;
    }

    setLoading(true);

    try {
      // Here you would upload the image and save the material data
      const materialData = {
        title: formData.title,
        studySessionId: selectedSession,
        tutorEmail: user?.email,
        driveLink: formData.driveLink,
        image: formData.image,
        createdAt: new Date()
      };

      console.log('Material Data:', materialData);

      Swal.fire({
        title: 'Success!',
        text: 'Material uploaded successfully!',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });

      // Reset form
      setFormData({
        title: '',
        image: null,
        driveLink: ''
      });
      setSelectedSession('');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload material. Please try again.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
    setLoading(false);
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
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Materials</h2>
        <p className="text-gray-600">Upload study materials for your approved sessions</p>
      </motion.div>

      {approvedSessions.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-gray-50 rounded-xl"
        >
          <FiCheck size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Approved Sessions</h3>
          <p className="text-gray-500">You need approved sessions to upload materials.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Approved Sessions List */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Approved Sessions</h3>
            <div className="space-y-3">
              {approvedSessions.map((session) => (
                <motion.div
                  key={session.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    selectedSession === session.id.toString()
                      ? 'border-green-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSession(session.id.toString())}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedSession === session.id.toString()
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedSession === session.id.toString() && (
                        <FiCheck size={12} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{session.sessionTitle}</h4>
                      <p className="text-sm text-green-600">Approved</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-3 w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Upload Material
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upload Form */}
          <div className="lg:col-span-2">
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-100 space-y-6"
            >
              <h3 className="text-lg font-semibold text-gray-800">Material Details</h3>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter material title"
                />
              </div>

              {/* Study Session ID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Session ID
                </label>
                <input
                  type="text"
                  value={selectedSession || 'Please select a session'}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Tutor Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tutor Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  <FiImage className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Google Drive Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Drive Link *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="driveLink"
                    value={formData.driveLink}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="https://drive.google.com/..."
                  />
                  <FiLink className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Paste your Google Drive shareable link (Google Doc, Sheet, etc.)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  disabled={loading || !selectedSession}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiUpload size={18} />
                  {loading ? 'Uploading...' : 'Upload Material'}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadMaterials;
