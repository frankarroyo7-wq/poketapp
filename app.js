import { auth, provider, db } from './firebase-config.js';
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnGoogle = document.getElementById('loginBtn');
const btnEntrarCodigo = document.getElementById('btnEntrarCodigo');
const inputCodigo = document.getElementById('inputCodigo');

// --- GENERADOR DE CÓDIGO ---
function generarCodigo(email) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let aleatorio = '';
    for (let i = 0; i < 6; i++) {
        aleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
    return `${base}-${aleatorio}`.toUpperCase();
}

// --- BOTÓN GOOGLE (REGISTRO Y LOGIN) ---
btnGoogle.addEventListener('click', async () => {
    try {
        const resultado = await signInWithPopup(auth, provider);
        const user = resultado.user;

        // VERIFICAR SI YA EXISTE
        const q = query(collection(db, "participantes"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Si ya existe, mostramos el código que ya tiene
            const datosExistentes = querySnapshot.docs[0].data();
            lanzarExito(datosExistentes.nombre, datosExistentes.codigo);
        } else {
            // Si es nuevo, creamos el registro
            const nuevoCodigo = generarCodigo(user.email);
            await setDoc(doc(db, "participantes", user.uid), {
                nombre: user.displayName,
                email: user.email,
                codigo: nuevoCodigo,
                fecha: serverTimestamp()
            });
            lanzarExito(user.displayName, nuevoCodigo);
        }
    } catch (error) {
        console.error(error);
        alert("Error al conectar con Google");
    }
});

// --- ACCESO POR CÓDIGO ---
btnEntrarCodigo.addEventListener('click', async () => {
    const elCodigo = inputCodigo.value.trim().toUpperCase();
    if (!elCodigo) return alert("Ingresa tu código");

    const q = query(collection(db, "participantes"), where("codigo", "==", elCodigo));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const datos = querySnapshot.docs[0].data();
        lanzarExito(datos.nombre, elCodigo);
    } else {
        alert("Código no válido");
    }
});

// --- RECUPERAR CÓDIGO ---
document.getElementById('recuperarBtn').addEventListener('click', async () => {
    const emailUser = prompt("Ingresa el correo de tu cuenta Google:");
    if (!emailUser) return;

    const q = query(collection(db, "participantes"), where("email", "==", emailUser.trim().toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const datos = querySnapshot.docs[0].data();
        alert(`Hola ${datos.nombre}, tu código es: ${datos.codigo}`);
    } else {
        alert("No hay ningún código registrado con ese correo.");
    }
});

// --- MOSTRAR RESULTADO ---
function lanzarExito(nombre, codigo) {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    document.querySelector('.info-box').innerHTML = `
        <h2>¡Hola, ${nombre}!</h2>
        <p>Tu código único de sorteo:</p>
        <div class="codigo-display">
            <h3 id="copyCode">${codigo}</h3>
            <button id="copyBtn">Copiar Código</button>
        </div>
        <p style="font-size: 0.8em; margin-top: 10px; color: #00ff00;">✅ Estás participando</p>
    `;
    document.getElementById('copyBtn').onclick = () => {
        navigator.clipboard.writeText(codigo);
        alert("¡Copiado!");
    };
}

