import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface UserProfile {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isSubscribed: boolean;
  subscriptionExpiry: number | null;
  createdAt: number;
  role?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety timeout to prevent infinite loading screen under poor network
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      clearTimeout(safetyTimer);
      setUser(u);
      if (!u) {
        setProfile(null);
        setLoading(false);
      }
    }, (err) => {
      console.warn("Auth state error:", err);
      clearTimeout(safetyTimer);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      const profileSafetyTimer = setTimeout(() => {
        setLoading(false);
      }, 2000);

      const unsubscribeProfile = onSnapshot(
        doc(db, 'users', user.uid),
        (doc) => {
          clearTimeout(profileSafetyTimer);
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          }
          setLoading(false);
        },
        (err) => {
          clearTimeout(profileSafetyTimer);
          console.warn("Firestore user profile snapshot error:", err);
          setLoading(false);
        }
      );
      return () => {
        clearTimeout(profileSafetyTimer);
        unsubscribeProfile();
      };
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
