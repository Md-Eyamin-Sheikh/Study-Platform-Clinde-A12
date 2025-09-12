import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;