import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Edit3, User, Crown, GraduationCap, Save, X } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../Firbas/Firbas';
import Swal from 'sweetalert2';

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users from Firebase:', error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(user => 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role: newRole,
        updatedAt: new Date()
      });

      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );

      Swal.fire('Success!', 'User role updated successfully', 'success');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      Swal.fire('Error!', 'Failed to update user role', 'error');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="text-red-500" size={16} />;
      case 'tutor': return <GraduationCap className="text-green-500" size={16} />;
      default: return <User className="text-blue-500" size={16} />;
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      tutor: 'bg-green-100 text-green-800 border-green-200',
      student: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[role] || colors.student;
  };

  if (loading) {
    return (
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mb-4"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 font-medium"
          >
            Loading users from Firebase...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Users</h2>
        <p className="text-gray-600">Manage user roles and permissions (Data from Firebase)</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative max-w-md">
          <motion.div
            animate={searchTerm ? { scale: 1.1 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
          >
            <Search className="text-gray-400" size={20} />
          </motion.div>
          <motion.input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
          />
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </motion.button>
            </motion.div>
          )}
        </div>
        {searchTerm && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-500 mt-2"
          >
            Found {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} matching "{searchTerm}"
          </motion.p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user.displayName || 'No Name'}
                </h3>
                <p className="text-sm text-gray-600 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getRoleBadge(user.role)}`}>
                {getRoleIcon(user.role)}
                <span className="text-sm font-medium capitalize">{user.role || 'student'}</span>
              </div>
              
              {editingUser === user.id ? (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingUser(null)}
                    className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditingUser(user.id)}
                  className="p-2 text-gray-500 hover:text-green-600 transition-colors"
                >
                  <Edit3 size={16} />
                </motion.button>
              )}
            </div>

            {editingUser === user.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4"
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Role
                </label>
                <div className="flex gap-2">
                  {['student', 'tutor', 'admin'].map((role) => (
                    <motion.button
                      key={role}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateUserRole(user.id, role)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        user.role === role
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                      }`}
                    >
                      {role}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Joined: {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No users found</p>
        </motion.div>
      )}
    </div>
  );
};

export default ViewAllUsers;
