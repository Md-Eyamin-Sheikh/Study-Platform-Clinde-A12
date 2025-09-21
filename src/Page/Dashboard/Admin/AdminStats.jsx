import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, TrendingUp, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalMaterials: 0,
    pendingSessions: 0,
    approvedSessions: 0,
    rejectedSessions: 0,
    totalRevenue: 0,
    usersByRole: { student: 0, tutor: 0, admin: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, sessionsRes, materialsRes] = await Promise.all([
        fetch('http://localhost:5000/admin/users'),
        fetch('http://localhost:5000/admin/sessions'),
        fetch('http://localhost:5000/admin/materials')
      ]);

      const users = await usersRes.json();
      const sessions = await sessionsRes.json();
      const materials = await materialsRes.json();

      const usersByRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, { student: 0, tutor: 0, admin: 0 });

      const sessionStats = sessions.reduce((acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        if (session.status === 'approved' && session.registrationFee) {
          acc.revenue += session.registrationFee;
        }
        return acc;
      }, { pending: 0, approved: 0, rejected: 0, revenue: 0 });

      setStats({
        totalUsers: users.length,
        totalSessions: sessions.length,
        totalMaterials: materials.length,
        pendingSessions: sessionStats.pending,
        approvedSessions: sessionStats.approved,
        rejectedSessions: sessionStats.rejected,
        totalRevenue: sessionStats.revenue,
        usersByRole
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Sessions',
      value: stats.totalSessions,
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Materials',
      value: stats.totalMaterials,
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Pending Sessions',
      value: stats.pendingSessions,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Approved Sessions',
      value: stats.approvedSessions,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded"></div>
                </div>
                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-32 h-6 bg-gray-200 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Key metrics and statistics</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`px-3 py-1 ${stat.color} text-white rounded-full text-sm font-medium`}
                >
                  <TrendingUp size={14} />
                </motion.div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="text-2xl font-bold text-gray-800"
              >
                {stat.value}
              </motion.p>
            </motion.div>
          );
        })}
      </div>

      {/* User Role Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-4">User Distribution by Role</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(stats.usersByRole).map(([role, count], index) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                role === 'admin' ? 'bg-red-100 text-red-600' :
                role === 'tutor' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Users size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-600 capitalize">{role}s</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats;
