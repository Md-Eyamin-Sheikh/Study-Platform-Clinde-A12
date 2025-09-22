import { useContext, useEffect } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import StudentDashboard from './Student Dashboard/StudentDashboard';
import TutorDashboard from './Tutor Dashboard/TutorDashboard';
import AdminDashboard from './Admin/AdminDashboard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firbas/Firbas';

const DashboardRouter = () => {
  const { user, role, loading, setRole } = useContext(AuthContext);

  // If no role is assigned, try to fetch it again
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && !role) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.role) {
              setRole(userData.role);
            }
          }
        } catch (error) {
          console.log('Error fetching user role:', error);
        }
      }
    };

    fetchUserRole();
  }, [user, role, setRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <span className="loading loading-dots loading-xl"></span>
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

  const userRole = role ? String(role).toLowerCase().trim() : null;
  
  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'tutor' || userRole === 'teacher') {
    return <TutorDashboard />;
  } else if (userRole === 'student') {
    return <StudentDashboard />;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Role Not Assigned</h2>
          <p className="text-gray-600">Please contact admin to assign your role.</p>
          <p className="text-sm text-gray-500 mt-2">User ID: {user?.uid}</p>
          <p className="text-sm text-gray-500">Current role: {role === null ? 'null' : `"${role}"`}</p>
        </div>
      </div>
    );
  }
};

export default DashboardRouter;
