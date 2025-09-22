
import { createContext, useEffect, useState } from 'react';
import { auth, db } from '../Firbas/Firbas.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, enableNetwork } from 'firebase/firestore';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('tutor');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          console.log('Current user detected:', currentUser.uid);
          setUser(currentUser);
          
          // Wait for auth token to be ready
          await currentUser.getIdToken(true);
          
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log('User data fetched:', userData);
            setRole(userData.role );
          } else {
            console.log('No user document found');
            // setRole('student');
          }
        } else {
          console.log('No user logged in');
          setUser(null);
          // setRole('student');
        }
      } catch (error) {
        console.log('Error fetching user role:', error);
        // setRole('student');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    setRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;