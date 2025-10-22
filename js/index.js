// ================================
// FUNCIONES DE MODALES
// ================================

function mostrarLogin() {
    document.getElementById('modalLogin').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function mostrarRegistro() {
    document.getElementById('modalRegistro').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
    document.body.style.overflow = 'auto';
    limpiarFormularios();
}

function cambiarARegistro(event) {
    event.preventDefault();
    cerrarModal('modalLogin');
    mostrarRegistro();
}

function cambiarALogin(event) {
    event.preventDefault();
    cerrarModal('modalRegistro');
    mostrarLogin();
}

function limpiarFormularios() {
    const formLogin = document.getElementById('formLogin');
    const formRegistro = document.getElementById('formRegistro');
    if (formLogin) formLogin.reset();
    if (formRegistro) formRegistro.reset();
}

// ================================
// MENSAJES DE NOTIFICACIÓN
// ================================

function mostrarMensaje(mensaje, esError = false) {
    const contenedor = document.createElement('div');
    contenedor.className = `mensaje-notificacion ${esError ? 'error' : 'exito'}`;
    contenedor.textContent = mensaje;
    document.body.appendChild(contenedor);
    
    setTimeout(() => contenedor.classList.add('mostrar'), 100);
    
    setTimeout(() => {
        contenedor.classList.remove('mostrar');
        setTimeout(() => document.body.removeChild(contenedor), 300);
    }, 3000);
}

// ================================
// LOGIN
// ================================

function iniciarSesion(datosLogin) {
    const formData = new FormData();
    formData.append('email', datosLogin.email);
    formData.append('contrasena', datosLogin.contrasena);

    fetch('php/login.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
            if (data === 'login_exitoso') {
                // IMPORTANTE: Usar SessionManager para guardar la sesión
                SessionManager.setUsuario(datosLogin.email);
                
                mostrarMensaje('¡Sesión iniciada correctamente!');
                cerrarModal('modalLogin');
                
                setTimeout(() => {
                    window.location.href = 'house.html';
                }, 1000);
            } else if (data === 'contrasena_incorrecta') {
                mostrarMensaje('Contraseña incorrecta', true);
            } else if (data === 'usuario_no_encontrado') {
                mostrarMensaje('Usuario no encontrado', true);
            } else {
                mostrarMensaje('Error inesperado', true);
                console.error(data);
            }
        })
        .catch(error => {
            mostrarMensaje('Error de conexión', true);
            console.error('Error:', error);
        });
}

// ================================
// REGISTRO
// ================================

function registrarUsuario(datosUsuario) {
    if (datosUsuario.contrasena !== datosUsuario.confirmarContrasena) {
        mostrarMensaje('Las contraseñas no coinciden', true);
        return;
    }

    const formData = new FormData();
    formData.append('nombre', datosUsuario.nombre);
    formData.append('email', datosUsuario.email);
    formData.append('contrasena', datosUsuario.contrasena);

    fetch('php/registro.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
            if (data === 'correo_existente') {
                mostrarMensaje('Correo ya registrado', true);
            } else if (data === 'registro_exitoso') {
                mostrarMensaje('¡Cuenta creada exitosamente!');
                cerrarModal('modalRegistro');
                setTimeout(() => mostrarLogin(), 1000);
            } else {
                mostrarMensaje('Error inesperado', true);
                console.error(data);
            }
        })
        .catch(error => {
            mostrarMensaje('Error de conexión', true);
            console.error('Error:', error);
        });
}

// ================================
// EVENTOS
// ================================

document.addEventListener('DOMContentLoaded', () => {
    // Formulario de login
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();
            const datos = new FormData(e.target);
            iniciarSesion({
                email: datos.get('email'),
                contrasena: datos.get('contrasena'),
            });
        });
    }

    // Formulario de registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function (e) {
            e.preventDefault();
            const datos = new FormData(e.target);
            registrarUsuario({
                nombre: datos.get('nombre'),
                email: datos.get('email'),
                contrasena: datos.get('contrasena'),
                confirmarContrasena: datos.get('confirmarContrasena'),
            });
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function (evento) {
        const modalLogin = document.getElementById('modalLogin');
        const modalRegistro = document.getElementById('modalRegistro');
        if (evento.target === modalLogin) cerrarModal('modalLogin');
        if (evento.target === modalRegistro) cerrarModal('modalRegistro');
    });

    // Configurar animaciones
    configurarAnimaciones();
});

// ================================
// ANIMACIONES
// ================================

function configurarAnimaciones() {
    const observador = new IntersectionObserver(
        (entradas) => {
            entradas.forEach((e) => {
                if (e.isIntersecting) e.target.style.animationPlayState = 'running';
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    document.querySelectorAll('.fade-in').forEach((el) => {
        el.style.animationPlayState = 'paused';
        observador.observe(el);
    });
}

// ================================
// SESSION MANAGER
// ================================


