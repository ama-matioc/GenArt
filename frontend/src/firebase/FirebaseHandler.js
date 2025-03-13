import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBJOrY-9ZjmD4mHU_k_VnGehJMtRkZPRQg",
    authDomain: "licenta-1b7b4.firebaseapp.com",
    projectId: "licenta-1b7b4",
    storageBucket: "licenta-1b7b4.firebasestorage.app",
    messagingSenderId: "1055652108160",
    appId: "1:1055652108160:web:b6aa8c5094be96207a9365",
    measurementId: "G-QRNKMQ4LVW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth};
