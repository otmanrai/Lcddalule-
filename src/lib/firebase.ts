import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, onSnapshot, writeBatch, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Sync user to firestore
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isSubscribed: false,
        subscriptionExpiry: null,
        createdAt: Date.now()
      });
    }
    
    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logout = () => auth.signOut();

export const signInWithEmail = async (email: string, pass: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Email:", error);
    throw error;
  }
};

export const signUpWithEmail = async (email: string, pass: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    const user = result.user;
    
    // Update display name
    await updateProfile(user, { displayName: name });

    // Sync user to firestore
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      id: user.uid,
      email: user.email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || user.uid)}`,
      isSubscribed: false,
      subscriptionExpiry: null,
      createdAt: Date.now()
    });

    return user;
  } catch (error) {
    console.error("Error signing up with Email:", error);
    throw error;
  }
};

export const subscribeUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  await setDoc(userRef, {
    isSubscribed: true,
    subscriptionExpiry: expiry
  }, { merge: true });
};

export const addImageToModel = async (modelId: string, imageUrl: string) => {
  const modelRef = doc(db, 'model_metadata', modelId);
  await setDoc(modelRef, {
    imageUrl,
    updatedAt: serverTimestamp()
  }, { merge: true });
};
