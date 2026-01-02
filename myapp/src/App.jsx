// import { createContext } from "react";
// import Student1 from "./Hooks/Context/Student1"

// export let myContext = createContext();

// function App() {
//   let myName = 'Kl Rahul';

  

//   return (
//     <>
//     <h1>App Component</h1>
    
//     <myContext.Provider value={myName}>
//       <Student1 />

//     </myContext.Provider>
    
     
//     </>
//   )
// }

// export default App

// // ContextAPI

// // 1.createContext()
// // 2.Provider
// // 3.useContext()

// src/App.jsx - Main Application Logic (The "Brain")

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
// Imports necessary functions from firebase/auth and firebase/firestore
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithCustomToken } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';

// Assuming you've moved these components to a dedicated folder:
import LoginApp from './Components/RescueApp/LoginApp';
import RescueDashboard from './Components/RescueApp/RescueDashboard'; 
// If you want to put them directly in src, the paths would be './LoginForm.jsx', './RescueDashboard.jsx'

// --- Global Firebase State Management (as defined in the previous code) ---
let app;
let db;
let auth;

const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// NOTE: You must include the full initializeFirebaseAndAuth and seedDatabase functions here.
// For brevity, they are omitted in this example but must be present in your actual file.
// Copy the full initializeFirebaseAndAuth and seedDatabase functions from the previous response here.
async function initializeFirebaseAndAuth(setUserId, setIsAuthReady) { /* ... full logic here ... */ }
async function seedDatabase(db) { /* ... full logic here ... */ }

// src/App.jsx (TEMPORARY FOR STYLE TESTING)

// ... (component code above) ...

const App = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // ... useEffect logic ...

  // We are skipping the loading check to immediately render the component below.

  // If user is authenticated, show the dashboard
  if (userId) {
    return <RescueDashboard userId={userId} />;
  }

  // If user is NOT authenticated, show the login form
  return <LoginForm />;
};