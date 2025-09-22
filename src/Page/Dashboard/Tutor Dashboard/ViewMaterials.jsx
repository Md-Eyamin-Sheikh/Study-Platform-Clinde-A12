import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2, FiExternalLink, FiImage, FiFolder } from 'react-icons/fi';
import { AuthContext } from '../../../providers/AuthProvider';
import Swal from 'sweetalert2';

const ViewMaterials = () => {
  const { user } = useContext(AuthContext);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    imageUrl: '',
    driveLink: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, [user]);

  const fetchMaterials = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tutor/materials/${user.email}`);
      const result = await response.json();
      
      if (result.success) {
        setMaterials(result.materials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
    setLoading(false);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material._id);
    setEditForm({
      title: material.title,
      imageUrl: material.imageUrl,
      driveLink: material.driveLink
    });
  };

  const handleUpdate = async (materialId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tutor/materials/${materialId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });

      const result = await response.json();

      if (result.success) {
        setMaterials(prev =>
          prev.map(material =>
            material._id === materialId
              ? {
                  ...material,
                  title: editForm.title,
                  imageUrl: editForm.imageUrl,
                  driveLink: editForm.driveLink
                }
              : material
          )
        );

        setEditingMaterial(null);
        setEditForm({ title: '', imageUrl: '', driveLink: '' });

        Swal.fire({
          title: 'Updated!',
          text: 'Material has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#3B82F6'
        });
      }
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
      try {
        const response = await fetch(`http://localhost:5000/api/tutor/materials/${materialId}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          setMaterials(prev => prev.filter(material => material._id !== materialId));
          
          Swal.fire({
            title: 'Deleted!',
            text: 'Material has been deleted.',
            icon: 'success',
            confirmButtonColor: '#3B82F6'
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete material.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setEditForm({ title: '', imageUrl: '', driveLink: '' });
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
              key={material._id}
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
                {editingMaterial === material._id ? (
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
                      value={editForm.imageUrl}
                      onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Image URL"
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
                        onClick={() => handleUpdate(material._id)}
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
                    
                    <div className="text-xs text-gray-500 mb-4">
                      <p>Created: {new Date(material.uploadedAt).toLocaleDateString()}</p>
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
                        onClick={() => handleDelete(material._id)}
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
