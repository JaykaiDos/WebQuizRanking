// Importar las bibliotecas necesarias, incluyendo Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

// Configuración de la aplicación web de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA-lRU8YfbeKnJGrrQWyab8Z9Jg2W7dfwk",
    authDomain: "quizapp-2c3e0.firebaseapp.com",
    projectId: "quizapp-2c3e0",
    storageBucket: "quizapp-2c3e0.appspot.com",
    messagingSenderId: "1053091130557",
    appId: "1:1053091130557:web:cb83d530625a48bfcf1bd4",
    measurementId: "G-RVW5X1V6M4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Función para formatear la fecha
function formatTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    
    // Si es un Timestamp de Firestore
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-ES', options);
}

// Función para obtener el emoji de medalla
function getMedalEmoji(position) {
    switch(position) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return '';
    }
}

// Función principal para cargar el ranking
async function loadRanking() {
    const contentDiv = document.getElementById('rankingContent');
    try {
        // Consulta a la colección 'ranking' en Firestore
        const rankingRef = collection(db, 'ranking');
        const q = query(
            rankingRef,
            orderBy('puntaje', 'desc'),
            orderBy('timestamp', 'asc'),
            limit(10)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            contentDiv.innerHTML = '<p class="error">⚠️ No hay datos de ranking disponibles.</p>';
            return;
        }
        // Procesar los datos y validar campos
        const rows = [];
        querySnapshot.forEach((doc, idx) => {
            const data = doc.data();
            // Validar y loguear datos para depuración
            if (!('puntaje' in data) || typeof data.puntaje !== 'number') {
                console.warn(`Documento ${doc.id} sin campo 'puntaje' válido:`, data);
            }
            if (!('timestamp' in data)) {
                console.warn(`Documento ${doc.id} sin campo 'timestamp':`, data);
            }
            rows.push({
                nombreUsuario: data.nombreUsuario || 'Anónimo',
                puntaje: typeof data.puntaje === 'number' ? data.puntaje : 0,
                timestamp: data.timestamp,
            });
        });
        // Construir la tabla HTML
        let tableHTML = `
            <table class="ranking-table">
                <thead>
                    <tr>
                        <th>Posición</th>
                        <th>Usuario</th>
                        <th>Puntaje</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
        `;
        rows.forEach((row, idx) => {
            const position = idx + 1;
            const positionClass = position <= 3 ? `position-${position}` : '';
            const medal = getMedalEmoji(position);
            tableHTML += `
                <tr>
                    <td class="position-cell ${positionClass}">
                        <span class="medal">${medal}</span>${position}
                    </td>
                    <td class="username-cell">${row.nombreUsuario}</td>
                    <td class="score-cell">${row.puntaje} pts</td>
                    <td class="timestamp-cell">${formatTimestamp(row.timestamp)}</td>
                </tr>
            `;
        });
        tableHTML += `
                </tbody>
            </table>
        `;
        contentDiv.innerHTML = tableHTML;
    } catch (error) {
        console.error('Error al cargar el ranking:', error);
        contentDiv.innerHTML = `
            <div class="error">
                <p>❌ Error al cargar el ranking</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">${error.message}</p>
            </div>
        `;
    }
}

// Cargar el ranking cuando la página esté lista
loadRanking();