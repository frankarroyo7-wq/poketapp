import { auth, provider, db } from './firebase-config.js';
import { signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnGoogle = document.getElementById('loginBtn');

// 1. Manejar el regreso del redireccionamiento
getRedirectResult(auth)
    .then((result) => {
        if (result) {
            const user = result.user;
            registrarUsuario(user);
        }
    }).catch((error) => console.error("Error al regresar:", error));

// 2. Evento del botón actualizado a Redirect
btnGoogle.addEventListener('click', () => {
    signInWithRedirect(auth, provider);
});

// 3. Función para guardar datos y lanzar confeti
async function registrarUsuario(user) {
    try {
        await setDoc(doc(db, "participantes", user.uid), {
            nombre: user.displayName,
            email: user.email,
            foto: user.photoURL,
            fecha: serverTimestamp()
        }, { merge: true });

        // Efecto visual de éxito
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        document.querySelector('.info-box').innerHTML = `
            <h2 class="notranslate">¡Listo, ${user.displayName}!</h2>
            <p>Ya estás participando en el sorteo.</p>
        `;
    } catch (e) {
        console.error("Error guardando:", e);
    }
}
