// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKxmqrm0pTO1DJBGAsa2tRUmjXdQhdkO8",
  authDomain: "rescueteam1.firebaseapp.com",
  projectId: "rescueteam1",
  storageBucket: "rescueteam1.firebasestorage.app",
  messagingSenderId: "166943163123",
  appId: "1:166943163123:web:6600089905fbd1f9c3ad86",
  measurementId: "G-1MEFK27G5P"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);