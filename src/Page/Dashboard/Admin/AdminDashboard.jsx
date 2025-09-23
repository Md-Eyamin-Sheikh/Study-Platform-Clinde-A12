import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, BarChart3 } from 'lucide-react';
import AdminStats from './AdminStats';
import ViewAllUsers from './ViewAllUsers';
import ViewAllSessions from './ViewAllSessions';
import ViewAllMaterials from './ViewAllMaterials';
import { Link } from "react-router-dom";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, component: AdminStats },
    { id: 'users', label: 'View All Users', icon: Users, component: ViewAllUsers },
    { id: 'sessions', label: 'View All Sessions', icon: BookOpen, component: ViewAllSessions },
    { id: 'materials', label: 'View All Materials', icon: FileText, component: ViewAllMaterials }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, sessions, and materials</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-2 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {ActiveComponent && <ActiveComponent />}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
