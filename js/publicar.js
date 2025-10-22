let usuarioLogueado = null;

document.addEventListener('DOMContentLoaded', function() {
    usuarioLogueado = verificarUsuario();
    if (document.querySelector('#tablaTruques')) {
        cargarTruques();
    }
    configurarEventListeners();
});
function configurarEventListeners() {
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    if (nombreUsuarioElement) {
        nombreUsuarioElement.addEventListener('click', function() {
            if (usuarioLogueado && usuarioLogueado.nombre !== 'Invitado') {
                if (confirm('¿Deseas cerrar sesión?')) cerrarSesion();
            } else {
                if (confirm('¿Deseas crear una cuenta para unirte a SwapMind?')) {
                    window.location.href = 'index.html';
                }
            }
        });
    }
}

function verificarUsuario() {
    const usuario = SessionManager.getUsuario();
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    if (nombreUsuarioElement) {
        SessionManager.actualizarBadgeUsuario();
    }
    return usuario;
}

function cerrarSesion() {
    SessionManager.cerrarSesionYRedirigir();
}

function cargarTruques() {
    fetch('php/trueques.php')
        .then(r => r.json())
        .then(data => {
            const tabla = document.querySelector('#tablaTruques tbody');
            if (!tabla) return;
            tabla.innerHTML = '';
            data.forEach(t => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${t.nombre_persona}</td>
                    <td>${t.objeto_tiene}</td>
                    <td>${t.objeto_quiere}</td>
                    <td><button class="boton boton-eliminar" onclick="eliminarTruque(${t.id})">Eliminar</button></td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(err => console.error('Error cargando truques:', err));
}

function agregarTruque() {
    const nombre = document.getElementById('nombrePersona')?.value.trim();
    const tiene = document.getElementById('objetoTiene')?.value.trim();
    const quiere = document.getElementById('objetoQuiere')?.value.trim();

    if (!nombre || !tiene || !quiere) {
        alert('⚠️ Completa todos los campos antes de agregar un truque.');
        return;
    }

    fetch('php/trueques.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `nombrePersona=${encodeURIComponent(nombre)}&objetoTiene=${encodeURIComponent(tiene)}&objetoQuiere=${encodeURIComponent(quiere)}`
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            alert('✅ Truque agregado con éxito');
            cargarTruques();
            const np = document.getElementById('nombrePersona');
            const ot = document.getElementById('objetoTiene');
            const oq = document.getElementById('objetoQuiere');
            if (np) np.value = '';
            if (ot) ot.value = '';
            if (oq) oq.value = '';
        } else {
            alert('❌ Error al agregar truque: ' + (data.message || ''));
        }
    })
    .catch(err => console.error('Error al agregar truque:', err));
}

function eliminarTruque(id) {
    if (!confirm('¿Seguro que deseas eliminar este truque?')) return;

    fetch(`php/trueques.php?id=${id}`, { method: 'DELETE' })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                alert('🗑️ Truque eliminado');
                cargarTruques();
            } else {
                alert('❌ Error al eliminar truque: ' + (data.message || ''));
            }
        })
        .catch(err => console.error('Error al eliminar truque:', err));
}

// expose functions to the global scope so inline handlers and external code can use them
window.verificarUsuario = verificarUsuario;
window.agregarTruque = agregarTruque;
window.eliminarTruque = eliminarTruque;
 
