// src/hooks/use-auth.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, updatePassword } from 'firebase/auth';
import { auth, storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email:string, password:string) => Promise<any>;
  signInWithEmail: (email:string, password:string) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  updateUserProfilePicture: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email:string, password:string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        router.push('/');
        return userCredential;
    } catch(error) {
        console.error("Error signing up with email", error);
        throw error;
    }
  }

  const signInWithEmail = async (email:string, password:string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
        return userCredential;
    } catch(error) {
        console.error("Error signing in with email", error);
        throw error;
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/welcome');
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const updateUserName = async (name: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updateProfile(auth.currentUser, { displayName: name });
    setUser(auth.currentUser ? { ...auth.currentUser } : null);
  };
  
  const updateUserPassword = async (password: string) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    await updatePassword(auth.currentUser, password);
  };
  
  const updateUserProfilePicture = async (file: File) => {
    if (!auth.currentUser) throw new Error("Not authenticated");
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    await updateProfile(auth.currentUser, { photoURL });
    setUser(auth.currentUser ? { ...auth.currentUser } : null);
  };


  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut, updateUserName, updateUserPassword, updateUserProfilePicture }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useRequireAuth = () => {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth.loading && !auth.user) {
            router.push('/welcome');
        }
    }, [auth, router]);

    return auth;
}
