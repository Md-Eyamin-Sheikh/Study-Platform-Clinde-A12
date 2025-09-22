import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEye, FiUpload, FiFolder, FiBarChart } from 'react-icons/fi';
import { AuthContext } from '../../../providers/AuthProvider';
import CreateSession from './CreateSession';
import ViewSessions from './ViewSessions';
import UploadMaterials from './UploadMaterials';
import ViewMaterials from './ViewMaterials';

const TutorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart },
    { id: 'create', label: 'Create Session', icon: FiPlus },
    { id: 'sessions', label: 'My Sessions', icon: FiEye },
    { id: 'upload', label: 'Upload Materials', icon: FiUpload },
    { id: 'materials', label: 'My Materials', icon: FiFolder }
  ];

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
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Tutor Dashboard
          </h1>
          <p className="text-gray-600">Manage your study sessions and materials</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-lg overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-4 md:p-6"
        >
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'create' && <CreateSession />}
          {activeTab === 'sessions' && <ViewSessions />}
          {activeTab === 'upload' && <UploadMaterials />}
          {activeTab === 'materials' && <ViewMaterials />}
        </motion.div>
      </div>
    </motion.div>
  );
};

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalSessions: 0,
    approvedSessions: 0,
    pendingSessions: 0,
    materialsUploaded: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    if (!user?.email) return;
    
    try {
      // Fetch sessions
      const sessionsResponse = await fetch(`http://localhost:5000/api/tutor/sessions/${user.email}`);
      const sessionsResult = await sessionsResponse.json();
      
      // Fetch materials
      const materialsResponse = await fetch(`http://localhost:5000/api/tutor/materials/${user.email}`);
      const materialsResult = await materialsResponse.json();
      
      if (sessionsResult.success && materialsResult.success) {
        const sessions = sessionsResult.sessions;
        const materials = materialsResult.materials;
        
        setStats({
          totalSessions: sessions.length,
          approvedSessions: sessions.filter(s => s.status === 'approved').length,
          pendingSessions: sessions.filter(s => s.status === 'pending').length,
          materialsUploaded: materials.length
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
    setLoading(false);
  };

  const statsData = [
    { label: 'Total Sessions', value: stats.totalSessions, color: 'bg-blue-500', icon: FiBarChart },
    { label: 'Approved Sessions', value: stats.approvedSessions, color: 'bg-green-500', icon: FiEye },
    { label: 'Pending Sessions', value: stats.pendingSessions, color: 'bg-yellow-500', icon: FiPlus },
    { label: 'Materials Uploaded', value: stats.materialsUploaded, color: 'bg-purple-500', icon: FiFolder }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TutorDashboard;
