// ================================
// CHAT ASISTENTE IA
// ================================

const chatMensajes = document.getElementById('chatMensajes');
const inputMensaje = document.getElementById('mensajeUsuario');

const mensajesAyuda = [
    "¡Hola! 👋 Soy el asistente virtual de SwapMind.",
    "Puedo ayudarte con:",
    "• Escribe 'hola' para saludarm",
    "• Escribe 'trueque' para info sobre intercambios",
    "• Escribe 'equipo' para conocer al equipo",
    "• Escribe 'categorias' para ver categorías disponibles",
    "• Escribe 'ayuda' para ver todos los comandos"
];

// ================================
// AGREGAR MENSAJES
// ================================

function agregarMensaje(texto, tipo) {
    const div = document.createElement('div');
    div.classList.add('mensaje', tipo);
    div.innerText = texto;
    if (chatMensajes) chatMensajes.appendChild(div);
    if (chatMensajes) chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

// ================================
// ENVIAR MENSAJE
// ================================

function enviarMensaje() {
    const mensaje = inputMensaje.value.trim();
    if (!mensaje) return;

    // Verificar si puede enviar mensajes
    if (!SessionManager.puedeEnviarMensajes()) {
        alert('⚠️ Debes iniciar sesión para chatear con el asistente.');
        inputMensaje.value = '';
        return;
    }

    agregarMensaje(mensaje, 'usuario');
    inputMensaje.value = '';

    setTimeout(() => {
        const respuesta = generarRespuesta(mensaje);
        agregarMensaje(respuesta, 'asistente');
    }, 500);
}

// ================================
// GENERAR RESPUESTAS
// ================================

function generarRespuesta(texto) {
    texto = texto.toLowerCase().trim();
    
    // Saludos
    if (texto === 'hola' || texto === 'hi' || texto === 'hey') {
        return '¡Hola! 👋 Soy el asistente de SwapMind. ¿En qué puedo ayudarte hoy?';
    }
    
    // Información sobre trueques
    if (texto.includes('trueque') || texto.includes('intercambio')) {
        return '📦 En SwapMind puedes:\n• Publicar objetos para intercambiar\n• Buscar por categorías\n• Chatear con otros usuarios\n• Hacer trueques seguros\n\n¡Ve a la sección "Publicar" para empezar!';
    }
    
    // Equipo
    if (texto.includes('equipo') || texto.includes('nosotros')) {
        return '👥 Nuestro equipo está compuesto por profesionales apasionados:\n• Erik Silva - Ciberseguridad\n• Matias Pereyra - Backend\n• Allan Alanis - Project Manager\n• Demian Cardona - Marketing\n• Agustin Anselmi - Ciberseguridad\n\n¡Visita la sección "Nosotros" para más info!';
    }
    
    // Categorías
    if (texto.includes('categoria') || texto.includes('categoría')) {
        return '📂 Categorías disponibles:\n🚲 Bicicletas\n👕 Ropa\n📱 Electrónicos\n🏠 Hogar\n📚 Libros\n⚽ Deportes\n🎵 Música\n\n¡Explora cualquiera en la página de Inicio!';
    }
    
    // Ayuda
    if (texto.includes('ayuda') || texto.includes('help') || texto.includes('comandos')) {
        return '🤖 Comandos disponibles:\n• "hola" - Saludar\n• "trueque" - Info sobre intercambios\n• "equipo" - Conocer al equipo\n• "categorias" - Ver categorías\n• "publicar" - Cómo publicar\n• "seguridad" - Consejos de seguridad\n• "contacto" - Información de contacto';
    }
    
    // Publicar
    if (texto.includes('publicar') || texto.includes('subir')) {
        return '📝 Para publicar un objeto:\n1. Ve a la sección "Publicar"\n2. Completa el formulario\n3. Describe bien tu objeto\n4. ¡Listo! Tu publicación estará visible\n\nRecuerda: debes iniciar sesión para publicar.';
    }
    
    // Seguridad
    if (texto.includes('seguridad') || texto.includes('seguro')) {
        return '🛡️ Consejos de seguridad:\n• Describe honestamente el estado del objeto\n• Incluye fotos claras\n• Coordina entregas en lugares públicos\n• Verifica el estado antes de intercambiar\n• Usa el chat para comunicarte';
    }
    
    // Contacto
    if (texto.includes('contacto') || texto.includes('email')) {
        return '📧 Contáctanos:\n• Email: hola@swapmind.com\n• WhatsApp: +598 99 123 456\n• Horarios: Lun-Vie 9:00-18:00\n• Ubicación: Montevideo, Uruguay';
    }
    
    // Respuesta por defecto
    return '❌ No reconozco ese comando. Escribe "ayuda" para ver todos los comandos disponibles.';
}

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Mostrar mensajes de ayuda
    mensajesAyuda.forEach((msg, index) => {
        setTimeout(() => {
            agregarMensaje(msg, 'asistente');
        }, index * 300);
    });
    
    // Enter para enviar
    if (inputMensaje) {
        inputMensaje.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') enviarMensaje();
        });
    }
});