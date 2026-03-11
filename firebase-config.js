// Importamos las funciones necesarias desde la nube (SDKs)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Tu configuración (la que me acabas de pasar)
const firebaseConfig = {
  apiKey: "AIzaSyCjNMGmRLxbRG355b1YjcNE2OF3UjLAU8k",
  authDomain: "apptcgpkt.firebaseapp.com",
  projectId: "apptcgpkt",
  storageBucket: "apptcgpkt.firebasestorage.app",
  messagingSenderId: "338816496453",
  appId: "1:338816496453:web:63977d47d907d5eaa0842c"
};

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en tu archivo de lógica (app.js)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

