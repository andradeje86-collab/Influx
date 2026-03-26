import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";

// Login
export const login = (email, senha) =>
  signInWithEmailAndPassword(auth, email, senha);

// Cadastro
export const cadastrar = (email, senha) =>
  createUserWithEmailAndPassword(auth, email, senha);

// Recuperar senha
export const recuperarSenha = (email) =>
  sendPasswordResetEmail(auth, email);

// Logout
export const logout = () => signOut(auth);

// Escuta mudanças de login
export const escutarAuth = (callback) =>
  onAuthStateChanged(auth, callback);
