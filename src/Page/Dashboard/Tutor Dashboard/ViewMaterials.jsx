import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiExternalLink, FiImage, FiFolder } from 'react-icons/fi';
import Swal from 'sweetalert2';

const ViewMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    driveLink: ''
  });

  // Mock materials data - replace with actual API call
  const mockMaterials = [
    {
      id: 1,
      title: 'React Hooks Cheat Sheet',
      studySessionId: 1,
      sessionTitle: 'Advanced React Concepts',
      driveLink: 'https://drive.google.com/file/d/example1',
      imageUrl: 'https://via.placeholder.com/300x200?text=React+Hooks',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      title: 'JavaScript ES6 Examples',
      studySessionId: 2,
      sessionTitle: 'JavaScript ES6+ Features',
      driveLink: 'https://drive.google.com/file/d/example2',
      imageUrl: 'https://via.placeholder.com/300x200?text=ES6+Examples',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: 3,
      title: 'Node.js Project Structure',
      studySessionId: 3,
      sessionTitle: 'Node.js Fundamentals',
      driveLink: 'https://drive.google.com/file/d/example3',
      imageUrl: 'https://via.placeholder.com/300x200?text=Node.js+Structure',
      createdAt: new Date('2024-01-17'),
      updatedAt: new Date('2024-01-17')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setMaterials(mockMaterials);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = (material) => {
    setEditingMaterial(material.id);
    setEditForm({
      title: material.title,
      driveLink: material.driveLink
    });
  };

  const handleUpdate = async (materialId) => {
    try {
      setMaterials(prev =>
        prev.map(material =>
          material.id === materialId
            ? {
                ...material,
                title: editForm.title,
                driveLink: editForm.driveLink,
                updatedAt: new Date()
              }
            : material
        )
      );

      setEditingMaterial(null);
      setEditForm({ title: '', driveLink: '' });

      Swal.fire({
        title: 'Updated!',
        text: 'Material has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update material.',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDelete = async (materialId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setMaterials(prev => prev.filter(material => material.id !== materialId));
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Material has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3B82F6'
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setEditForm({ title: '', driveLink: '' });
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Materials</h2>
        <p className="text-gray-600">View, edit, and delete your uploaded materials</p>
      </motion.div>

      {loading ? (
        <motion.div
          variants={itemVariants}
          className="flex justify-center items-center py-12"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </motion.div>
      ) : materials.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="text-center py-12 bg-gray-50 rounded-xl"
        >
          <FiFolder size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Materials Found</h3>
          <p className="text-gray-500">You haven't uploaded any materials yet.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {materials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Material Image */}
              <div className="relative h-48 bg-gray-100">
                <img
                  src={material.imageUrl}
                  alt={material.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ID: {material.studySessionId}
                  </span>
                </div>
              </div>

              {/* Material Content */}
              <div className="p-6">
                {editingMaterial === material.id ? (
                  /* Edit Form */
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Material title"
                    />
                    <input
                      type="url"
                      value={editForm.driveLink}
                      onChange={(e) => setEditForm(prev => ({ ...prev, driveLink: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Google Drive link"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(material.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                      {material.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      Session: {material.sessionTitle}
                    </p>
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Created: {material.createdAt.toLocaleDateString()}</p>
                      <p>Updated: {material.updatedAt.toLocaleDateString()}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.open(material.driveLink, '_blank')}
                        className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
                      >
                        <FiExternalLink size={14} />
                        View
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(material)}
                        className="flex items-center gap-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-300 text-sm"
                      >
                        <FiEdit2 size={14} />
                        Edit
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(material.id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 text-sm"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ViewMaterials;
