import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Gift, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const ApprovalModal = ({ isOpen, onClose, session, onApprove }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const approvalData = {
        isPaid,
        registrationFee: isPaid ? parseFloat(amount) : 0
      };

      const response = await fetch(`https://study-hub-survar-a12.vercel.app/admin/sessions/${session._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });

      if (response.ok) {
        Swal.fire('Approved!', 'Session has been approved successfully.', 'success');
        onApprove();
        resetForm();
      } else {
        throw new Error('Failed to approve session');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to approve session', 'error');
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
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
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Approve Session</h3>
                  <p className="text-sm text-gray-600">Set pricing for this session</p>
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
                        ? 'border-green-500 bg-green-50 text-green-700'
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
                        ? 'border-green-500 bg-green-50 text-green-700'
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
                        className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
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
                  className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Approve Session
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

export default ApprovalModal;
