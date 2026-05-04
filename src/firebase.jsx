// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbz-bBdYtFstixRrR-Ic0CII-ir-rG2JM",
  authDomain: "landingpage-db3b0.firebaseapp.com",
  projectId: "landingpage-db3b0",
  storageBucket: "landingpage-db3b0.firebasestorage.app",
  messagingSenderId: "971173734525",
  appId: "1:971173734525:web:21da93bbe57633c38a2914",
  measurementId: "G-1FQ92R136H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
