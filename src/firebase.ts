import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Import the functions you need from the SDKs you need
const firebaseConfig = {
  apiKey: "AIzaSyDeo1UDw4LEn3fh2WfZANcrmafVNH773Ds",
  authDomain: "feedback-hub-9f5e6.firebaseapp.com",
  projectId: "feedback-hub-9f5e6",
  storageBucket: "feedback-hub-9f5e6.firebasestorage.app",
  messagingSenderId: "173841714244",
  appId: "1:173841714244:web:4f9302f3e89ca4ff770011",
  measurementId: "G-V1R7VQEEDP"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
