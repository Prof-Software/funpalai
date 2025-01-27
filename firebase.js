import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup,signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGftNdJfZOmi3zzKQ9pPYHueYGO6cgyWc",
  authDomain: "funpalai.firebaseapp.com",
  projectId: "funpalai",
  storageBucket: "funpalai.firebasestorage.app",
  messagingSenderId: "165020822299",
  appId: "1:165020822299:web:b08ce3a58361ba5fe9c1be",
  measurementId: "G-37DED3SW03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup,signOut };