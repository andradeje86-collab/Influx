import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

export const criarProjeto = async (userId, data) => {
  return addDoc(collection(db, "projects"), {
    ...data,
    ownerId: userId,
    status: "active",
    criadoEm: serverTimestamp(),
  });
};

export const meusProjetos = async (userId) => {
  const q = query(
    collection(db, "projects"),
    where("ownerId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
