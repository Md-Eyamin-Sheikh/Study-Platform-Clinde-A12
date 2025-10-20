import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera, Shield, Award, BookOpen } from 'lucide-react';
import { AuthContext } from '../../providers/AuthProvider';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { user, role, updateUserProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
    dateOfBirth: '',
    profileImage: user?.photoURL || '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/users/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileData(prev => ({
          ...prev,
          displayName: userData.displayName || user.displayName || '',
          email: userData.email || user.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          bio: userData.bio || '',
          dateOfBirth: userData.dateOfBirth || '',
          profileImage: userData.profileImage || user.photoURL || '',
          joinDate: userData.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setProfileData(prev => ({
          ...prev,
          profileImage: data.data.url
        }));
        Swal.fire('Success!', 'Profile image updated successfully', 'success');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to upload image', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Update Firebase profile
      if (profileData.displayName !== user.displayName || profileData.profileImage !== user.photoURL) {
        await updateUserProfile(profileData.displayName, profileData.profileImage);
      }

      // Update backend profile
      const response = await fetch(`https://study-hub-survar-a12.vercel.app/users/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        setIsEditing(false);
        Swal.fire('Success!', 'Profile updated successfully', 'success');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      Swal.fire('Error!', 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'admin': return <Shield className="text-red-600" size={20} />;
      case 'tutor': return <Award className="text-green-600" size={20} />;
      default: return <BookOpen className="text-blue-600" size={20} />;
    }
  };

  const getRoleBadge = () => {
    const badges = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      tutor: 'bg-green-100 text-green-800 border-green-200',
      student: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return badges[role] || badges.student;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cover Section */}
          <div className="h-32 bg-gradient-to-r from-green-400 via-green-600 to-green-500 relative">
            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/30 transition-colors"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(false)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <X size={16} />
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
              <div className="relative">
                <img
                  src={profileData.profileImage || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {profileData.displayName || 'User Name'}
                  </h2>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 ${getRoleBadge()}`}>
                    {getRoleIcon()}
                    {role?.charAt(0).toUpperCase() + role?.slice(1)}
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{profileData.email}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-700">
                  <Calendar size={16} />
                  <span className='text-gray-800'>Joined {new Date(profileData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="text-green-600" size={24} />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 text-gray-800 rounded-lg">{profileData.displayName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <Mail className="text-gray-400" size={16} />
                      <span className='text-gray-900'>{profileData.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center gap-2">
                        <Phone className="text-gray-400" size={16} />
                        <span className='text-gray-700'>{profileData.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={profileData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="text-blue-600" size={24} />
                  Additional Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300  text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="px-4 text-gray-700 py-3 bg-gray-50 rounded-lg min-h-[80px]">
                        {profileData.address || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tell us about yourself"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-gray-50 text-gray-700 rounded-lg min-h-[100px]">
                        {profileData.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>

                  {/* Account Stats */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Account Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {role === 'student' ? '12' : role === 'tutor' ? '8' : '156'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {role === 'student' ? 'Sessions Attended' : role === 'tutor' ? 'Sessions Created' : 'Total Users'}
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">
                          {role === 'student' ? '4.8' : role === 'tutor' ? '4.9' : '98%'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {role === 'student' ? 'Avg Rating' : role === 'tutor' ? 'Tutor Rating' : 'System Health'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
