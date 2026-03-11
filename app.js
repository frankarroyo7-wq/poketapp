// 1. Importamos las herramientas desde el archivo de configuración que creaste
import { auth, provider, db } from './firebase-config.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Seleccionamos el botón de Google (asegúrate que en tu HTML el id sea 'loginBtn')
const btnGoogle = document.getElementById('loginBtn');

btnGoogle.addEventListener('click', async () => {
    try {
        // Abrir la ventana de Google
        const resultado = await signInWithPopup(auth, provider);
        const user = resultado.user;

        console.log("Usuario autenticado:", user.displayName);

        // 3. Guardar los datos en Firestore en la colección 'participantes'
        // Usamos el UID del usuario como ID del documento para evitar duplicados
        await setDoc(doc(db, "participantes", user.uid), {
            nombre: user.displayName,
            email: user.email,
            foto: user.photoURL,
            fechaRegistro: serverTimestamp(),
            sorteo: "Erika Full Art",
            estado: "Activo"
        }, { merge: true });

        // 4. Lanzar el efecto de Confeti (asegúrate de tener el script de confetti en el HTML)
        if (typeof confetti === "function") {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00d4ff', '#ffffff', '#1a1a2e'] // Colores de PoketApp
            });
        }

        // 5. Cambiar la interfaz para confirmar el éxito
        mostrarMensajeExito(user.displayName);

    } catch (error) {
        console.error("Error completo:", error);
        alert("No se pudo completar el registro. Verifica que tengas internet.");
    }
});

// Función para actualizar la UI sin recargar la página
function mostrarMensajeExito(nombre) {
    const infoBox = document.querySelector('.info-box');
    infoBox.innerHTML = `
        <div style="animation: fadeIn 0.8s ease; background: rgba(0, 212, 255, 0.1); padding: 25px; border-radius: 20px; border: 1px solid #00d4ff; text-align: center;">
            <h2 style="color: #00d4ff; font-size: 1.5rem; margin-bottom: 10px;">¡Ya estás participando!</h2>
            <p style="color: #fff; font-size: 0.9rem;">Mucha suerte, <strong>${nombre}</strong>. <br> Te avisaremos si resultas ganador.</p>
        </div>
    `;
}