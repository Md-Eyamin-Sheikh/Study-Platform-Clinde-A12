import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const CreateSession = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sessionTitle: '',
    sessionDescription: '',
    registrationStartDate: '',
    registrationEndDate: '',
    classStartDate: '',
    classEndDate: '',
    sessionDuration: '',
    registrationFee: 0,
    status: 'pending'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sessionData = {
        ...formData,
        tutorName: user?.displayName || '',
        tutorEmail: user?.email || '',
        registrationFee: 0,
        status: 'pending'
      };

      const response = await fetch('http://localhost:5000/api/tutor/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData)
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          sessionTitle: '',
          sessionDescription: '',
          registrationStartDate: '',
          registrationEndDate: '',
          classStartDate: '',
          classEndDate: '',
          sessionDuration: '',
          registrationFee: 0,
          status: 'pending'
        });
      } else {
        throw new Error(result.message || 'Failed to create session');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create session. Please try again.',
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Study Session</h2>
        <p className="text-gray-600">Fill in the details to create a new study session</p>
      </motion.div>

      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Title */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Title *
            </label>
            <input
              type="text"
              name="sessionTitle"
              value={formData.sessionTitle}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter session title"
            />
          </motion.div>

          {/* Tutor Name (Read-only) */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tutor Name
            </label>
            <input
              type="text"
              value={user?.displayName || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            />
          </motion.div>

          {/* Tutor Email (Read-only) */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tutor Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
            />
          </motion.div>

          {/* Session Description */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Description *
            </label>
            <textarea
              name="sessionDescription"
              value={formData.sessionDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="Describe your study session"
            />
          </motion.div>

          {/* Registration Start Date */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Start Date *
            </label>
            <input
              type="datetime-local"
              name="registrationStartDate"
              value={formData.registrationStartDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          {/* Registration End Date */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration End Date *
            </label>
            <input
              type="datetime-local"
              name="registrationEndDate"
              value={formData.registrationEndDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          {/* Class Start Date */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class Start Date *
            </label>
            <input
              type="datetime-local"
              name="classStartDate"
              value={formData.classStartDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          {/* Class End Date */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class End Date *
            </label>
            <input
              type="datetime-local"
              name="classEndDate"
              value={formData.classEndDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
            />
          </motion.div>

          {/* Session Duration */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Duration (hours) *
            </label>
            <input
              type="number"
              name="sessionDuration"
              value={formData.sessionDuration}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="e.g., 2"
            />
          </motion.div>

          {/* Registration Fee (Read-only) */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Fee
            </label>
            <input
              type="number"
              value={formData.registrationFee}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-800 mt-1">Only admin can modify this field</p>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end pt-6"
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Session'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default CreateSession;
