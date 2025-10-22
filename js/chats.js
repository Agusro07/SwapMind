// ================================
// DATOS DE CONVERSACIONES
// ================================

let conversacionActual = null;

const conversaciones = [
    {
        id: 1,
        nombre: "María González",
        avatar: "M",
        ultimoMensaje: "Perfecto, ¿cuándo podemos hacer el intercambio?",
        hora: "10:30",
        mensajesNuevos: 2,
        mensajes: [
            { texto: "Hola, me interesa tu bicicleta", enviado: false, hora: "10:15" },
            { texto: "¡Hola! Claro, está en excelente estado", enviado: true, hora: "10:20" },
            { texto: "¿Qué buscas a cambio?", enviado: false, hora: "10:25" },
            { texto: "Busco una bicicleta de ruta o patineta eléctrica", enviado: true, hora: "10:28" },
            { texto: "Perfecto, ¿cuándo podemos hacer el intercambio?", enviado: false, hora: "10:30" }
        ]
    },
    {
        id: 2,
        nombre: "Carlos Ruiz",
        avatar: "C",
        ultimoMensaje: "Gracias por la información",
        hora: "Ayer",
        mensajesNuevos: 0,
        mensajes: [
            { texto: "¿La cámara incluye accesorios?", enviado: false, hora: "15:00" },
            { texto: "Sí, incluye lente 18-55mm y bolso", enviado: true, hora: "15:05" },
            { texto: "Gracias por la información", enviado: false, hora: "15:10" }
        ]
    },
    {
        id: 3,
        nombre: "Ana Torres",
        avatar: "A",
        ultimoMensaje: "¿Los libros están en buen estado?",
        hora: "Ayer",
        mensajesNuevos: 1,
        mensajes: [
            { texto: "Hola, vi tu colección de Harry Potter", enviado: false, hora: "14:00" },
            { texto: "¡Hola! Sí, están disponibles", enviado: true, hora: "14:05" },
            { texto: "¿Los libros están en buen estado?", enviado: false, hora: "14:10" }
        ]
    },
    {
        id: 4,
        nombre: "Pedro Martínez",
        avatar: "P",
        ultimoMensaje: "Me interesan los patines",
        hora: "Hace 2 días",
        mensajesNuevos: 0,
        mensajes: [
            { texto: "Me interesan los patines", enviado: false, hora: "12:00" },
            { texto: "Genial, están casi nuevos", enviado: true, hora: "12:15" }
        ]
    }
];

// ================================
// RENDERIZAR CONVERSACIONES
// ================================

function mostrarConversaciones() {
    const contenedor = document.getElementById('listaConversaciones');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    conversaciones.forEach(conv => {
        const convDiv = document.createElement('div');
        convDiv.className = 'conversacion-item';
        convDiv.onclick = () => abrirConversacion(conv.id);
        
        convDiv.innerHTML = `
            <div class="avatar-conversacion">${conv.avatar}</div>
            <div class="info-conversacion">
                <div class="nombre-contacto">${conv.nombre}</div>
                <div class="ultimo-mensaje">${conv.ultimoMensaje}</div>
            </div>
            <div class="meta-conversacion">
                <span class="hora-conversacion">${conv.hora}</span>
                ${conv.mensajesNuevos > 0 ? `<span class="contador-mensajes">${conv.mensajesNuevos}</span>` : ''}
            </div>
        `;
        
        contenedor.appendChild(convDiv);
    });
}

// ================================
// ABRIR CONVERSACIÓN
// ================================

function abrirConversacion(id) {
    // Verificar si puede enviar mensajes
    if (!SessionManager.puedeEnviarMensajes()) {
        alert('⚠️ Debes iniciar sesión para chatear');
        return;
    }
    
    const conversacion = conversaciones.find(c => c.id === id);
    if (!conversacion) return;
    
    conversacionActual = conversacion;
    
    // Ocultar chat vacío y mostrar chat activo
    document.getElementById('chatVacio').style.display = 'none';
    document.getElementById('chatActivo').style.display = 'flex';
    
    // Actualizar header del chat
    document.getElementById('nombreContactoActivo').textContent = conversacion.nombre;
    document.getElementById('avatarContactoActivo').textContent = conversacion.avatar;
    
    // Marcar conversación como activa
    document.querySelectorAll('.conversacion-item').forEach(item => {
        item.classList.remove('activa');
    });
    event.target.closest('.conversacion-item').classList.add('activa');
    
    // Mostrar mensajes
    mostrarMensajes();
    
    // Marcar mensajes como leídos
    conversacion.mensajesNuevos = 0;
    mostrarConversaciones();
}

// ================================
// MOSTRAR MENSAJES
// ================================

function mostrarMensajes() {
    if (!conversacionActual) return;
    
    const contenedor = document.getElementById('contenedorMensajes');
    contenedor.innerHTML = '';
    
    conversacionActual.mensajes.forEach(msg => {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `mensaje ${msg.enviado ? 'enviado' : 'recibido'}`;
        
        mensajeDiv.innerHTML = `
            <div class="burbuja-mensaje">
                <div class="contenido-mensaje">${msg.texto}</div>
                <div class="meta-mensaje">
                    <span>${msg.hora}</span>
                    ${msg.enviado ? '<span class="estado-mensaje">✓✓</span>' : ''}
                </div>
            </div>
        `;
        
        contenedor.appendChild(mensajeDiv);
    });
    
    // Scroll al último mensaje
    contenedor.scrollTop = contenedor.scrollHeight;
}

// ================================
// ENVIAR MENSAJE
// ================================

function enviarMensaje() {
    if (!conversacionActual) return;
    if (!SessionManager.puedeEnviarMensajes()) {
        alert('⚠️ Debes iniciar sesión para enviar mensajes');
        return;
    }
    
    const input = document.getElementById('inputMensaje');
    const texto = input.value.trim();
    
    if (!texto) return;
    
    // Obtener hora actual
    const ahora = new Date();
    const hora = `${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    // Agregar mensaje a la conversación
    conversacionActual.mensajes.push({
        texto: texto,
        enviado: true,
        hora: hora
    });
    
    // Actualizar último mensaje en la lista
    conversacionActual.ultimoMensaje = texto;
    conversacionActual.hora = hora;
    
    // Limpiar input
    input.value = '';
    
    // Actualizar UI
    mostrarMensajes();
    mostrarConversaciones();
    
    // Simular respuesta automática después de 2 segundos
    setTimeout(() => {
        simularRespuesta();
    }, 2000);
}

// ================================
// SIMULAR RESPUESTA
// ================================

function simularRespuesta() {
    if (!conversacionActual) return;
    
    const respuestas = [
        "¡Perfecto!",
        "Suena bien, ¿cuándo podemos coordinar?",
        "Gracias por la información",
        "Me parece excelente",
        "¿Podemos vernos mañana?"
    ];
    
    const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
    const ahora = new Date();
    const hora = `${ahora.getHours()}:${ahora.getMinutes().toString().padStart(2, '0')}`;
    
    conversacionActual.mensajes.push({
        texto: respuesta,
        enviado: false,
        hora: hora
    });
    
    conversacionActual.ultimoMensaje = respuesta;
    conversacionActual.hora = hora;
    conversacionActual.mensajesNuevos = 1;
    
    mostrarMensajes();
    mostrarConversaciones();
}

// ================================
// BÚSQUEDA DE CONVERSACIONES
// ================================

function buscarConversaciones() {
    const input = document.getElementById('inputBuscarChat');
    const termino = input.value.toLowerCase().trim();
    
    const contenedor = document.getElementById('listaConversaciones');
    contenedor.innerHTML = '';
    
    const resultados = conversaciones.filter(conv =>
        conv.nombre.toLowerCase().includes(termino) ||
        conv.ultimoMensaje.toLowerCase().includes(termino)
    );
    
    if (resultados.length === 0) {
        contenedor.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">No se encontraron conversaciones</p>';
        return;
    }
    
    resultados.forEach(conv => {
        const convDiv = document.createElement('div');
        convDiv.className = 'conversacion-item';
        convDiv.onclick = () => abrirConversacion(conv.id);
        
        convDiv.innerHTML = `
            <div class="avatar-conversacion">${conv.avatar}</div>
            <div class="info-conversacion">
                <div class="nombre-contacto">${conv.nombre}</div>
                <div class="ultimo-mensaje">${conv.ultimoMensaje}</div>
            </div>
            <div class="meta-conversacion">
                <span class="hora-conversacion">${conv.hora}</span>
                ${conv.mensajesNuevos > 0 ? `<span class="contador-mensajes">${conv.mensajesNuevos}</span>` : ''}
            </div>
        `;
        
        contenedor.appendChild(convDiv);
    });
}

// ================================
// INICIALIZACIÓN
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Mostrar conversaciones
    mostrarConversaciones();
    
    // Enter para enviar mensaje
    const inputMensaje = document.getElementById('inputMensaje');
    if (inputMensaje) {
        inputMensaje.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
    }
    
    // Búsqueda en tiempo real
    const inputBuscarChat = document.getElementById('inputBuscarChat');
    if (inputBuscarChat) {
        inputBuscarChat.addEventListener('input', buscarConversaciones);
    }
});