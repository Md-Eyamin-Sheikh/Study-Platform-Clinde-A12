import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Eye, Download, Calendar, User, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


const ViewAllMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/materials');
      const data = await response.json();
      setMaterials(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (materialId, materialTitle) => {
    const result = await Swal.fire({
      title: 'Delete Material?',
      text: `Are you sure you want to delete "${materialTitle}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/admin/materials/${materialId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Material has been removed successfully.', 'success');
          fetchMaterials();
        } else {
          throw new Error('Failed to delete material');
        }
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete material', 'error');
      }
    }
  };

  const handleView = (material) => {
    Swal.fire({
      title: material.title,
      html: `
        <div class="text-left space-y-3">
          <p><strong>Description:</strong> ${material.description}</p>
          <p><strong>Uploaded by:</strong> ${material.uploadedBy}</p>
          <p><strong>Upload Date:</strong> ${new Date(material.uploadDate).toLocaleDateString()}</p>
          <p><strong>File Type:</strong> ${material.fileType}</p>
          <p><strong>File Size:</strong> ${material.fileSize}</p>
          ${material.downloadUrl ? `<p><strong>Download:</strong> <a href="${material.downloadUrl}" target="_blank" class="text-blue-600 hover:underline">Click here</a></p>` : ''}
        </div>
      `,
      width: 600,
      showCloseButton: true,
      showConfirmButton: false
    });
  };

  const getFileTypeIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('video')) return '🎥';
    if (fileType?.includes('audio')) return '🎵';
    if (fileType?.includes('document') || fileType?.includes('word')) return '📝';
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return '📊';
    if (fileType?.includes('presentation') || fileType?.includes('powerpoint')) return '📈';
    return '📁';
  };

  const getFileTypeColor = (fileType) => {
    if (fileType?.includes('pdf')) return 'bg-red-100 text-red-800 border-red-200';
    if (fileType?.includes('image')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (fileType?.includes('video')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (fileType?.includes('audio')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const isOutdated = (uploadDate) => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(uploadDate) < sixMonthsAgo;
  };

  const filteredMaterials = materials.filter(material => {
    if (filter === 'all') return true;
    if (filter === 'outdated') return isOutdated(material.uploadDate);
    if (filter === 'recent') return !isOutdated(material.uploadDate);
    return material.fileType?.includes(filter);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Materials</h2>
        <p className="text-gray-600">Manage study materials and remove inappropriate content</p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Materials' },
            { key: 'recent', label: 'Recent' },
            { key: 'outdated', label: 'Outdated' },
            { key: 'pdf', label: 'PDFs' },
            { key: 'image', label: 'Images' },
            { key: 'video', label: 'Videos' }
          ].map((filterOption) => (
            <motion.button
              key={filterOption.key}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                filter === filterOption.key
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {filterOption.label}
              <span className="ml-2 text-sm">
                ({filterOption.key === 'all' ? materials.length : 
                  filterOption.key === 'recent' ? materials.filter(m => !isOutdated(m.uploadDate)).length :
                  filterOption.key === 'outdated' ? materials.filter(m => isOutdated(m.uploadDate)).length :
                  materials.filter(m => m.fileType?.includes(filterOption.key)).length})
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Materials Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredMaterials.map((material, index) => (
            <motion.div
              key={material._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Outdated Badge */}
              {isOutdated(material.uploadDate) && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Outdated
                  </div>
                </div>
              )}

              {/* File Icon */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{getFileTypeIcon(material.fileType)}</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium ${getFileTypeColor(material.fileType)}`}>
                  {material.fileType || 'Unknown'}
                </div>
              </div>

              {/* Material Info */}
              <div className="mb-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                  {material.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {material.description}
                </p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User size={14} />
                    <span>By: {material.uploadedBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{new Date(material.uploadDate).toLocaleDateString()}</span>
                  </div>
                  {material.fileSize && (
                    <div className="flex items-center gap-2">
                      <FileText size={14} />
                      <span>Size: {material.fileSize}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleView(material)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Eye size={14} />
                  View
                </motion.button>
                
                {material.downloadUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open(material.downloadUrl, '_blank')}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download size={14} />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(material._id, material.title)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 size={14} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredMaterials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No materials found for the selected filter</p>
        </motion.div>
      )}
    </div>
  );
};

export default ViewAllMaterials;
