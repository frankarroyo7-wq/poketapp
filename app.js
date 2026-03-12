import { auth, provider, db } from './firebase-config.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnGoogle = document.getElementById('loginBtn');

btnGoogle.addEventListener('click', async () => {
    try {
        // Usaremos Popup que en Chrome móvil suele ir bien si el sitio es seguro
        const resultado = await signInWithPopup(auth, provider);
        const user = resultado.user;
        
        alert("¡Google te reconoció! Guardando datos...");

        await setDoc(doc(db, "participantes", user.uid), {
            nombre: user.displayName,
            email: user.email,
            fecha: serverTimestamp()
        }, { merge: true });

        alert("¡Datos guardados con éxito!");

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        document.querySelector('.info-box').innerHTML = `<h2>¡Suerte, ${user.displayName}!</h2><p>Ya estás participando.</p>`;

    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
});

