import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0RprYSHqAZwtdV7AoWV8r3tFQke8AK2o",
  authDomain: "in-flux.firebaseapp.com",
  projectId: "in-flux",
  storageBucket: "in-flux.firebasestorage.app",
  messagingSenderId: "1084464047425",
  appId: "1:1084464047425:web:36ea7a064f0e994ad8adc0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
