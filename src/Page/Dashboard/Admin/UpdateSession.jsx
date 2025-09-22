import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Gift, Edit3 } from 'lucide-react';
import Swal from 'sweetalert2';

const UpdateSession = ({ isOpen, onClose, session, onUpdate }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setIsPaid(session.registrationFee > 0);
      setAmount(session.registrationFee || '');
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        isPaid,
        registrationFee: isPaid ? parseFloat(amount) : 0
      };

      const response = await fetch(`http://localhost:5000/admin/sessions/${session._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        Swal.fire({
          title: 'Updated!',
          text: 'Session has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
        onUpdate();
        resetForm();
      } else {
        throw new Error('Failed to update session');
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update session',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsPaid(false);
    setAmount('');
    onClose();
  };

  if (!session) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-green-50 bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Edit3 className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Update Session</h3>
                  <p className="text-sm text-gray-600">Modify session pricing</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Session Info */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-2">{session.sessionTitle}</h4>
              <p className="text-sm text-gray-600 mb-3">{session.sessionDescription}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Tutor: {session.tutorName}</span>
                <span>Duration: {session.sessionDuration}min</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Session Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Session Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPaid(false)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      !isPaid
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Gift className="mx-auto mb-2" size={24} />
                    <div className="font-medium">Free</div>
                    <div className="text-xs">No registration fee</div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsPaid(true)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      isPaid
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <DollarSign className="mx-auto mb-2" size={24} />
                    <div className="font-medium">Paid</div>
                    <div className="text-xs">Set registration fee</div>
                  </motion.button>
                </div>
              </div>

              {/* Amount Input */}
              <AnimatePresence>
                {isPaid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Fee (USD)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required={isPaid}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading || (isPaid && !amount)}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Edit3 size={16} />
                      Update Session
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpdateSession;
