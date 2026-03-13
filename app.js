import { auth, provider, db } from './firebase-config.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnGoogle = document.getElementById('loginBtn');
const btnEntrarCodigo = document.getElementById('btnEntrarCodigo');
const inputCodigo = document.getElementById('inputCodigo');

// --- 1. FUNCIÓN PARA GENERAR CÓDIGO ÚNICO ---
function generarCodigo(email) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let aleatorio = '';
    for (let i = 0; i < 6; i++) {
        aleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    // Toma el nombre antes del @, quita símbolos y suma el azar
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    return `${base}-${aleatorio}`.toUpperCase();
}

// --- 2. REGISTRO CON GOOGLE ---
btnGoogle.addEventListener('click', async () => {
    try {
        const resultado = await signInWithPopup(auth, provider);
        const user = resultado.user;
        
        // Generamos el código único para este nuevo registro
        const codigoUnico = generarCodigo(user.email);

        // Guardamos en Firestore (Sin alerts molestos)
        await setDoc(doc(db, "participantes", user.uid), {
            nombre: user.displayName,
            email: user.email,
            foto: user.photoURL,
            codigo: codigoUnico,
            fecha: serverTimestamp()
        }, { merge: true });

        // Efecto de éxito y mostrar código
        lanzarExito(user.displayName, codigoUnico);

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema: " + error.message);
    }
});

// --- 3. ACCESO POR CÓDIGO (Sin Google) ---
btnEntrarCodigo.addEventListener('click', async () => {
    const elCodigo = inputCodigo.value.trim().toUpperCase();
    
    if (!elCodigo) return alert("Por favor, ingresa un código.");

    try {
        const q = query(collection(db, "participantes"), where("codigo", "==", elCodigo));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const datos = querySnapshot.docs[0].data();
            lanzarExito(datos.nombre, elCodigo);
        } else {
            alert("Código no encontrado. Revisa que esté bien escrito.");
        }
    } catch (error) {
        alert("Error al buscar: " + error.message);
    }
});

// --- 4. FUNCIÓN PARA MOSTRAR RESULTADO ---
function lanzarExito(nombre, codigo) {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    document.querySelector('.info-box').innerHTML = `
        <h2 class="notranslate">¡Hola, ${nombre}!</h2>
        <p>Tu código de participación es:</p>
        <div class="codigo-display">
            <h3 id="copyCode" style="background: #222; padding: 10px; border-radius: 8px; border: 1px dashed #00ff00; color: #00ff00;">${codigo}</h3>
            <button id="copyBtn" style="margin-top: 10px; cursor: pointer;">Copiar Código</button>
        </div>
        <p style="margin-top: 15px; font-size: 0.9em; color: #aaa;">Estado: Registrado con éxito ✅</p>
    `;

    // Lógica para el botón de copiar que aparece dinámicamente
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(codigo);
        alert("¡Código copiado al portapapeles!");
    };
}

