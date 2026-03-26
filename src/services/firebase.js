import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "COLE_SEU_AUTH_DOMAIN",
  projectId: "COLE_SEU_PROJECT_ID",
  storageBucket: "COLE_SEU_STORAGE_BUCKET",
  messagingSenderId: "COLE_SEU_MESSAGING_ID",
  appId: "COLE_SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
