import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, TrendingUp, Clock, CheckCircle, XCircle, DollarSign, Calendar, Activity, Target, Award } from 'lucide-react';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    totalMaterials: 0,
    pendingSessions: 0,
    approvedSessions: 0,
    rejectedSessions: 0,
    totalRevenue: 0,
    usersByRole: { student: 0, tutor: 0, admin: 0 },
    monthlyGrowth: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, sessionsRes, materialsRes] = await Promise.all([
        fetch('https://study-hub-survar-a12.vercel.app/admin/users'),
        fetch('https://study-hub-survar-a12.vercel.app/admin/sessions'),
        fetch('https://study-hub-survar-a12.vercel.app/api/tutor/materials/all')
      ]);

      const users = await usersRes.json();
      const sessions = await sessionsRes.json();
      const materialsData = await materialsRes.json();
      const materials = materialsData.materials || [];

      const usersByRole = users.reduce((acc, user) => {
        const role = user.role || 'student';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, { student: 0, tutor: 0, admin: 0 });

      const sessionStats = sessions.reduce((acc, session) => {
        acc[session.status] = (acc[session.status] || 0) + 1;
        if (session.status === 'approved' && session.registrationFee) {
          acc.revenue += session.registrationFee;
        }
        return acc;
      }, { pending: 0, approved: 0, rejected: 0, revenue: 0 });

      // Generate mock monthly growth data
      const monthlyGrowth = [
        { month: 'Jan', users: 45, sessions: 12, revenue: 580 },
        { month: 'Feb', users: 67, sessions: 18, revenue: 890 },
        { month: 'Mar', users: 89, sessions: 25, revenue: 1240 },
        { month: 'Apr', users: 112, sessions: 32, revenue: 1680 },
        { month: 'May', users: 134, sessions: 41, revenue: 2150 },
        { month: 'Jun', users: users.length, sessions: sessions.length, revenue: sessionStats.revenue }
      ];

      setStats({
        totalUsers: users.length,
        totalSessions: sessions.length,
        totalMaterials: materials.length,
        pendingSessions: sessionStats.pending,
        approvedSessions: sessionStats.approved,
        rejectedSessions: sessionStats.rejected,
        totalRevenue: sessionStats.revenue,
        usersByRole,
        monthlyGrowth
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  // Progress Bar Component
  const ProgressBar = ({ value, max, color, label }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
    </div>
  );

  // Chart Component (Simple Bar Chart)
  const SimpleBarChart = ({ data, title }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
      <div className="flex items-end justify-between h-40 gap-2">
        {data.map((item, index) => (
          <div key={item.month} className="flex-1 flex flex-col items-center">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.users / Math.max(...data.map(d => d.users))) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
              className="w-full bg-gradient-to-t from-green-400 to-green-600 rounded-t-md min-h-[4px] mb-2"
            />
            <span className="text-xs text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Donut Chart Component (CSS-based)
  const DonutChart = ({ data, title }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    const colors = ['#3B82F6', '#10B981', '#EF4444'];
    let cumulativePercentage = 0;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />
              {Object.entries(data).map(([key, value], index) => {
                const percentage = (value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = -cumulativePercentage;
                cumulativePercentage += percentage;
                
                return (
                  <motion.path
                    key={key}
                    initial={{ strokeDasharray: "0 100" }}
                    animate={{ strokeDasharray }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={colors[index]}
                    strokeWidth="3"
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{total}</span>
            </div>
          </div>
          <div className="ml-6 space-y-2">
            {Object.entries(data).map(([key, value], index) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: colors[index] }} />
                <span className="text-sm text-gray-600 capitalize">{key}: {value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      growth: '+12%'
    },
    {
      title: 'Active Sessions',
      value: stats.totalSessions,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      growth: '+8%'
    },
    {
      title: 'Study Materials',
      value: stats.totalMaterials,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      growth: '+15%'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      growth: '+23%'
    }
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-32 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">Comprehensive platform analytics and insights</p>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={28} />
                </div>
                <div className="text-right">
                  <span className="text-green-500 text-sm font-medium">{stat.growth}</span>
                  <TrendingUp className="text-green-500 inline ml-1" size={14} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{stat.title}</h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-3xl font-bold text-gray-800"
              >
                {stat.value}
              </motion.p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SimpleBarChart data={stats.monthlyGrowth} title="Monthly User Growth" />
        <DonutChart data={stats.usersByRole} title="User Distribution" />
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="text-green-600" size={24} />
            Session Status Overview
          </h3>
          <ProgressBar 
            value={stats.approvedSessions} 
            max={stats.totalSessions} 
            color="bg-green-500" 
            label="Approved Sessions" 
          />
          <ProgressBar 
            value={stats.pendingSessions} 
            max={stats.totalSessions} 
            color="bg-yellow-500" 
            label="Pending Sessions" 
          />
          <ProgressBar 
            value={stats.rejectedSessions} 
            max={stats.totalSessions} 
            color="bg-red-500" 
            label="Rejected Sessions" 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="text-blue-600" size={24} />
            Platform Health
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">System Status</span>
              <span className="text-green-600 font-bold">Operational</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Active Users</span>
              <span className="text-blue-600 font-bold">{Math.floor(stats.totalUsers * 0.7)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-purple-700 font-medium">Success Rate</span>
              <span className="text-purple-600 font-bold">94.2%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Award className="text-yellow-600" size={24} />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Approve Sessions', count: stats.pendingSessions, color: 'bg-green-500' },
            { label: 'Review Materials', count: stats.totalMaterials, color: 'bg-blue-500' },
            { label: 'User Management', count: stats.totalUsers, color: 'bg-purple-500' },
            { label: 'Revenue Reports', count: '$' + stats.totalRevenue.toFixed(0), color: 'bg-emerald-500' }
          ].map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center"
            >
              <div className={`w-8 h-8 ${action.color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm`}>
                {typeof action.count === 'number' ? action.count : action.count}
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminStats;
