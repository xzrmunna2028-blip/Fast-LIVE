import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuyxkn3MzltCNH2vgdqX9lGczORcpYXcc",
  authDomain: "voxelive-1da19.firebaseapp.com",
  projectId: "voxelive-1da19",
  storageBucket: "voxelive-1da19.firebasestorage.app",
  messagingSenderId: "160835307798",
  appId: "1:160835307798:web:8f455324d9ee40b051a837",
  measurementId: "G-PFCMR7HSMQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export { 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber
};
