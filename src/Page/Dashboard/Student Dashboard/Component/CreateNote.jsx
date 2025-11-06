import React, { useState, useContext, useEffect } from 'react';
import { Save, FileText, User, Edit3 } from 'lucide-react';
import { AuthContext } from '../../../../providers/AuthProvider';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const CreateNote = () => {
  const { user } = useContext(AuthContext);
  const [note, setNote] = useState({
    email: '',
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setNote(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('https://study-hub-survar-a12.vercel.app/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });

      const data = await response.json();
      if (data.success) {
        setNote({ ...note, title: '', description: '' });
        Swal.fire('Success!', 'Note created successfully!', 'success');
      } else {
        Swal.fire('Error!', 'Failed to create note', 'error');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      Swal.fire('Error!', 'Failed to create note', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Create New Note</h1>
          <p className="text-gray-600 text-sm sm:text-base">Organize your thoughts and study materials</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 mr-2 text-green-600" />
                Email Address
              </label>
              <input
                type="email"
                value={note.email}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none transition-colors"
                placeholder="Your email address"
              />
            </div>

            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <Edit3 className="w-4 h-4 mr-2 text-green-600" />
                Note Title
              </label>
              <input
                type="text"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                placeholder="Enter a descriptive title for your note"
                required
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                Note Content
              </label>
              <textarea
                value={note.description}
                onChange={(e) => setNote({ ...note, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                rows="8"
                placeholder="Write your note content here... You can include study materials, important points, reminders, or any other information."
                required
              />
              <div className="text-xs text-gray-500 text-right">
                {note.description.length} characters
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <Save className="w-5 h-5 mr-2" />
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Note...
                </>
              ) : (
                'Create Note'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6"
        >
          <h3 className="font-semibold text-green-800 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Note-Taking Tips
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Use clear, descriptive titles for easy searching</li>
            <li>• Include key concepts, formulas, or important dates</li>
            <li>• Organize information with bullet points or numbered lists</li>
            <li>• Review and update your notes regularly</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateNote;
