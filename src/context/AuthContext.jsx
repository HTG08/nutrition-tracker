import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false); // Fallback for testing without real keys

  // Fallback Mock Functions
  const mockSignup = async (email, password, userData) => {
    console.warn("Using Mock Auth: Firebase not configured");
    const user = { uid: Date.now().toString(), email, ...userData };
    localStorage.setItem('mockUser', JSON.stringify(user));
    setCurrentUser(user);
    setIsMock(true);
    return user;
  };

  const mockLogin = async (email, password) => {
    const user = JSON.parse(localStorage.getItem('mockUser'));
    if (user && user.email === email) {
      setCurrentUser(user);
      setIsMock(true);
      return user;
    }
    throw new Error("Mock Auth Error: Invalid credentials");
  };

  const mockLogout = () => {
    setCurrentUser(null);
  };

  async function signup(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save extra user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        ...userData,
        email,
        createdAt: new Date().toISOString()
      });
      return userCredential;
    } catch (error) {
      if (error.code?.includes('api-key')) return mockSignup(email, password, userData);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code?.includes('api-key')) return mockLogin(email, password);
      throw error;
    }
  }

  function logout() {
    if (isMock) return mockLogout();
    return signOut(auth);
  }

  useEffect(() => {
    let unsubscribe = () => {};
    
    import('../services/firebase').then(({ isDummyConfig }) => {
      if (isDummyConfig) {
        // Fallback for mock init immediately
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          setCurrentUser(JSON.parse(mockUser));
        }
        setIsMock(true);
        setLoading(false);
        return;
      }

      try {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            // Fetch extra data from Firestore with a timeout to prevent hanging
            try {
              const docRef = doc(db, "users", user.uid);
              const docSnap = await Promise.race([
                getDoc(docRef),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
              ]);
              setCurrentUser({ ...user, ...docSnap.data() });
            } catch (err) {
              setCurrentUser(user);
            }
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
          setCurrentUser(JSON.parse(mockUser));
          setIsMock(true);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateCurrentUser = (data) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isMock,
    updateCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
