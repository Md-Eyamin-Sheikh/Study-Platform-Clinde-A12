import { createContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../Firbas/Firbas';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  const createUser = (email, password) => {
    setLoading(true);
    console.log('Creating user with email:', email);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    console.log('Signing in user with email:', email);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    console.log('Initiating Google sign in');
    return signInWithPopup(auth, googleProvider);
  };

  const githubSignIn = () => {
    setLoading(true);
    console.log('Initiating GitHub sign in');
    return signInWithPopup(auth, githubProvider);
  };

  const logOut = () => {
    setLoading(true);
    console.log('Logging out user');
    localStorage.removeItem('authToken');
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo
    });
  };

  const updateRole = (userRole) => {
    console.log('Setting user role:', userRole);
    setRole(userRole);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Firebase Auth State Changed:', currentUser);
      if (currentUser) {
        console.log('User UID:', currentUser.uid);
        console.log('User Email:', currentUser.email);
        
        // Generate JWT token
        try {
          const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              uid: currentUser.uid, 
              email: currentUser.email 
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            setRole(data.user.role);
          } else {
            setRole('student'); // Default role
          }
        } catch (error) {
          console.error('Error generating JWT:', error);
          setRole('student'); // Default role
        }
      } else {
        localStorage.removeItem('authToken');
        setRole(null);
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const value = {
    user,
    role,
    loading,
    createUser,
    signIn,
    googleSignIn,
    githubSignIn,
    logOut,
    updateUserProfile,
    setRole: updateRole,
    setUser,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
