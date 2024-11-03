// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
//firebase configration
const firebaseConfig = {
  apiKey: "AIzaSyBXkXV-Rf5M5jC7CT-Bmq4-2DKPBbAR_7k",
  authDomain: "goeleventhmileapp.firebaseapp.com",
  projectId: "goeleventhmileapp",
  storageBucket: "goeleventhmileapp.appspot.com",
  messagingSenderId: "1016707959718",
  appId: "1:1016707959718:web:13bb214a6d3398cb189d67",
  measurementId: "G-4SXDXWBYRZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
const firestoreDb = getFirestore()
// const CollectionDb = collection()
// const analytics = getAnalytics(app);
export default app;
export { auth, provider, firestoreDb, collection, getDocs };