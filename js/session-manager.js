// =============================================
// GESTOR DE SESIÓN- SwapMind
// =============================================

const SessionManager = {
    KEYS: {
        USUARIO: 'usuarioActual',
        INVITADO: 'esInvitado'
    },

    // Obtener usuario actual
    getUsuario() {
        const esInvitado = this.esInvitado();
        if (esInvitado) {
            return { nombre: 'Invitado', email: null, esInvitado: true };
        }

        const datos = localStorage.getItem(this.KEYS.USUARIO);
        if (datos) {
            try {
                return { ...JSON.parse(datos), esInvitado: false };
            } catch (e) {
                console.error('Error al parsear usuario:', e);
                return null;
            }
        }
        return null;
    },

    // Verificar si es invitado
    esInvitado() {
        return localStorage.getItem(this.KEYS.INVITADO) === 'true';
    },

    // Verificar si hay sesión activa
    hayUsuarioLogueado() {
        return this.getUsuario() !== null;
    },

    // Guardar usuario después del login
    setUsuario(email, nombre = null) {
        const usuario = {
            email: email,
            nombre: nombre || email
        };
        localStorage.setItem(this.KEYS.USUARIO, JSON.stringify(usuario));
        localStorage.setItem(this.KEYS.INVITADO, 'false');
    },

    // Establecer como invitado
    setInvitado() {
        localStorage.setItem(this.KEYS.INVITADO, 'true');
        localStorage.removeItem(this.KEYS.USUARIO);
    },

    // Cerrar sesión
    cerrarSesion() {
        localStorage.removeItem(this.KEYS.USUARIO);
        localStorage.removeItem(this.KEYS.INVITADO);
    },

    // Actualizar UI del header (para páginas con .nav-buttons)
    actualizarHeader() {
        const navButtons = document.querySelector('.nav-buttons');
        if (!navButtons) return;

        const usuario = this.getUsuario();

        if (!usuario) {
            navButtons.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="mostrarLogin()">Iniciar Sesión</a>
                <a href="#" class="btn btn-primary" onclick="mostrarRegistro()">Registrarse</a>
                <a href="#" class="btn btn-guest" onclick="SessionManager.continuarComoInvitado()">Continuar como Invitado</a>
            `;
        } else if (usuario.esInvitado) {
            navButtons.innerHTML = `
                <span style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; border-radius: 20px; font-weight: 600;">Invitado</span>
                <a href="#" class="btn btn-outline" onclick="mostrarLogin()">Iniciar Sesión</a>
            `;
        } else {
            navButtons.innerHTML = `
                <span style="padding: 0.5rem 1rem; background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border-radius: 20px; font-weight: 600;">${usuario.nombre}</span>
                <a href="#" class="btn btn-outline" onclick="SessionManager.cerrarSesionYRedirigir()">Cerrar Sesión</a>
            `;
        }
    },

    // Actualizar badge de usuario (para páginas con #nombreUsuario)
    actualizarBadgeUsuario() {
        const nombreUsuarioElem = document.getElementById('nombreUsuario');
        if (!nombreUsuarioElem) return;

        const usuario = this.getUsuario();

        if (!usuario) {
            nombreUsuarioElem.textContent = 'Sin sesión';
            nombreUsuarioElem.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
            nombreUsuarioElem.title = 'No hay sesión iniciada';
        } else if (usuario.esInvitado) {
            nombreUsuarioElem.textContent = 'Invitado';
            nombreUsuarioElem.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
            nombreUsuarioElem.title = 'Navegando como invitado';
        } else {
            nombreUsuarioElem.textContent = usuario.nombre;
            nombreUsuarioElem.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            nombreUsuarioElem.title = `Logueado como ${usuario.nombre}`;
        }
    },

    // Continuar como invitado
    continuarComoInvitado() {
        this.setInvitado();
        window.location.href = 'house.html';
    },

    // Cerrar sesión y redirigir
    cerrarSesionYRedirigir() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            this.cerrarSesion();
            window.location.href = 'index.html';
        }
    },

    // Verificar permisos
    puedeEnviarMensajes() {
        const usuario = this.getUsuario();
        return usuario && !usuario.esInvitado;
    },

    puedePublicar() {
        const usuario = this.getUsuario();
        return usuario && !usuario.esInvitado;
    },

    // Inicializar en cada página
    inicializar() {
        // Actualizar header y badge de usuario
        this.actualizarHeader();
        this.actualizarBadgeUsuario();

        // Agregar event listener al badge de usuario
        const nombreUsuarioElem = document.getElementById('nombreUsuario');
        if (nombreUsuarioElem) {
            nombreUsuarioElem.addEventListener('click', () => {
                const usuario = this.getUsuario();
                if (usuario && !usuario.esInvitado) {
                    // Usuario registrado
                    if (confirm('¿Deseas cerrar sesión?')) {
                        this.cerrarSesionYRedirigir();
                    }
                } else {
                    // Invitado o sin sesión
                    if (confirm('¿Deseas crear una cuenta para unirte a SwapMind?')) {
                        window.location.href = 'index.html';
                    }
                }
            });
        }

        // Sincronizar entre pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === this.KEYS.USUARIO || e.key === this.KEYS.INVITADO) {
                this.actualizarHeader();
                this.actualizarBadgeUsuario();
            }
        });

        console.log('✅ SessionManager inicializado. Usuario:', this.getUsuario());
    }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SessionManager.inicializar());
} else {
    SessionManager.inicializar();
}

// Hacer SessionManager disponible globalmente
window.SessionManager = SessionManager;
