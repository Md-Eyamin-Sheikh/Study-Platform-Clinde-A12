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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Firebase Auth State Changed:', currentUser);
      if (currentUser) {
        console.log('User UID:', currentUser.uid);
        console.log('User Email:', currentUser.email);
        console.log('User Display Name:', currentUser.displayName);
        console.log('User Photo URL:', currentUser.photoURL);
        console.log('User Email Verified:', currentUser.emailVerified);
        console.log('User Provider Data:', currentUser.providerData);
        console.log('User Metadata:', currentUser.metadata);
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
