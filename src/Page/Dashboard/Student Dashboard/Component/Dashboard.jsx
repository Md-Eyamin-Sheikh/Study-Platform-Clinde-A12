import React, { useContext } from 'react';
import { AuthContext } from '../../../../providers/AuthProvider';

const Dashboard = () => {
  const { user, role } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {user?.displayName || user?.email}
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Role: <span className="font-semibold text-green-600">{role}</span></p>
          <p className="text-gray-600 mt-2">Dashboard content coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
