import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Importar Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDzZ256ksRRh9aFKOTScBq2NrSOhZuzKAY",
  authDomain: "oleum-precios.firebaseapp.com",
  projectId: "oleum-precios",
  storageBucket: "oleum-precios.firebasestorage.app",
  messagingSenderId: "8829768272",
  appId: "1:8829768272:web:62dee80843a28903cdf755",
};

// Inicializa la app
const app = initializeApp(firebaseConfig);

// Exporta auth y db
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 Exportá Firestore
