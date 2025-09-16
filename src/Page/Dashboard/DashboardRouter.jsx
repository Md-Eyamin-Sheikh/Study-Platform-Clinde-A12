import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import StudentDashboard from './Student Dashboard/StudentDashboard';
import TutorDashboard from './Tutor Dashboard/TutorDashboard';

const DashboardRouter = () => {
  const { user, role, loading } = useContext(AuthContext);

  // Debug logging
  console.log('DashboardRouter - User:', user);
  console.log('DashboardRouter - Role:', role);
  console.log('DashboardRouter - Loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-900">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  // Route based on user role
  const userRole = String(role || '').toLowerCase().trim();
  console.log('DashboardRouter - Processed role:', userRole);
  
  if (userRole === 'tutor' || userRole === 'teacher') {
    return <TutorDashboard />;
  } else if (userRole === 'student') {
    return <StudentDashboard />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Role Not Assigned</h2>
          <p className="text-gray-600">Please contact admin to assign your role.</p>
          <p className="text-sm text-gray-500 mt-2">Current role: "{role}" (type: {typeof role})</p>
          <p className="text-sm text-gray-500">Processed role: "{userRole}"</p>
          <p className="text-sm text-gray-500">User ID: {user?.uid}</p>
        </div>
      </div>
    );
  }
};

export default DashboardRouter;
