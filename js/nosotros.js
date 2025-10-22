// ================================
// VARIABLES GLOBALES
// ================================
let publicacionesActuales = [];
let categoriaSeleccionada = 'todas';
let usuarioLogueado = null;

// ================================
// DATOS DE EJEMPLO
// ================================
const publicacionesEjemplo = [
    {
        id: 1,
        titulo: "Bicicleta de montaña Trek",
        descripcion: "Excelente estado, poco uso. Busco intercambiar por bicicleta de ruta o patineta eléctrica.",
        categoria: "bicicletas",
        usuario: "María González",
        fecha: "Hace 2 horas",
        icono: "🚲"
    },
    {
        id: 2,
        titulo: "Cámara Canon EOS",
        descripcion: "Cámara profesional, incluye lente 18-55mm. Interesados en equipo de música.",
        categoria: "electronica",
        usuario: "Carlos Ruiz",
        fecha: "Hace 5 horas",
        icono: "📷"
    },
    {
        id: 3,
        titulo: "Libro Harry Potter Colección",
        descripcion: "Edición de colección, buen estado. Cambio por otros libros de fantasía.",
        categoria: "libros",
        usuario: "Ana Torres",
        fecha: "Hace 1 día",
        icono: "📚"
    },
    {
        id: 4,
        titulo: "Patines profesionales",
        descripcion: "Talla 42, marca Rollerblade. Busco skateboard o longboard.",
        categoria: "deportes",
        usuario: "Pedro Martínez",
        fecha: "Hace 3 horas",
        icono: "⛸️"
    },
    {
        id: 5,
        titulo: "Guitarra acústica Yamaha",
        descripcion: "Muy buen estado, con funda. Intercambio por teclado o bajo eléctrico.",
        categoria: "musica",
        usuario: "Laura Sánchez",
        fecha: "Hace 6 horas",
        icono: "🎸"
    }
];

// ================================
// FUNCIONES DE SESIÓN
// ================================
function inicializarPagina() {
    verificarUsuario();
    mostrarPublicaciones();
    configurarAnimaciones();
    configurarEventListeners();
}

function verificarUsuario() {
    SessionManager.actualizarBadgeUsuario();
}

// ================================
// RENDERIZAR PUBLICACIONES
// ================================
function mostrarPublicaciones() {
    const contenedor = document.getElementById('listaPublicaciones');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const publicacionesFiltradas = categoriaSeleccionada === 'todas'
        ? publicacionesActuales
        : publicacionesActuales.filter(p => p.categoria === categoriaSeleccionada);

    if (publicacionesFiltradas.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <h3>No hay publicaciones en esta categoría</h3>
                <p>Sé el primero en publicar un objeto para intercambiar</p>
            </div>
        `;
        return;
    }

    publicacionesFiltradas.forEach(pub => {
        const publicacionDiv = document.createElement('div');
        publicacionDiv.className = 'publicacion-item fade-in';
        publicacionDiv.innerHTML = `
            <div class="imagen-publicacion">${pub.icono || '📦'}</div>
            <div class="contenido-publicacion">
                <h3 class="titulo-publicacion">${pub.titulo}</h3>
                <p class="descripcion-publicacion">${pub.descripcion}</p>
                <div class="info-publicacion">
                    <span class="usuario-publicacion">👤 ${pub.usuario}</span>
                    <span>⏰ ${pub.fecha}</span>
                </div>
            </div>
        `;
        contenedor.appendChild(publicacionDiv);
    });
}

// ================================
// FILTRAR Y BUSCAR
// ================================
function filtrarPorCategoria(categoria) {
    categoriaSeleccionada = categoria;
    mostrarPublicaciones();
    document.getElementById('listaPublicaciones').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buscarPublicaciones() {
    const input = document.getElementById('inputBusqueda');
    const termino = input.value.toLowerCase().trim();

    if (!termino) {
        categoriaSeleccionada = 'todas';
        mostrarPublicaciones();
        return;
    }

    const resultados = publicacionesActuales.filter(pub =>
        pub.titulo.toLowerCase().includes(termino) ||
        pub.descripcion.toLowerCase().includes(termino)
    );

    const contenedor = document.getElementById('listaPublicaciones');
    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <h3>No se encontraron resultados</h3>
                <p>Intenta con otros términos de búsqueda</p>
            </div>
        `;
        return;
    }

    resultados.forEach(pub => {
        const publicacionDiv = document.createElement('div');
        publicacionDiv.className = 'publicacion-item fade-in';
        publicacionDiv.innerHTML = `
            <div class="imagen-publicacion">${pub.icono || '📦'}</div>
            <div class="contenido-publicacion">
                <h3 class="titulo-publicacion">${pub.titulo}</h3>
                <p class="descripcion-publicacion">${pub.descripcion}</p>
                <div class="info-publicacion">
                    <span class="usuario-publicacion">👤 ${pub.usuario}</span>
                    <span>⏰ ${pub.fecha}</span>
                </div>
            </div>
        `;
        contenedor.appendChild(publicacionDiv);
    });
}

// ================================
// NAVEGACIÓN / PUBLICAR
// ================================
function irAPublicar() {
    if (!SessionManager.puedePublicar()) {
        alert('⚠️ Debes iniciar sesión para publicar intercambios');
        window.location.href = 'index.html';
        return;
    }
    window.location.href = 'publicar.html';
}

// ================================
// ANIMACIONES Y EVENTOS
// ================================
function configurarAnimaciones() {
    const opcionesObservador = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.animationPlayState = 'running';
            }
        });
    }, opcionesObservador);

    document.querySelectorAll('.fade-in').forEach(elemento => {
        elemento.style.animationPlayState = 'paused';
        observador.observe(elemento);
    });
}

function configurarEventListeners() {
    const nombreUsuarioElement = document.getElementById('nombreUsuario');
    nombreUsuarioElement.addEventListener('click', function() {
        if (usuarioLogueado && usuarioLogueado.nombre !== 'Invitado') {
            if (confirm('¿Deseas cerrar sesión?')) cerrarSesion();
        } else {
            if (confirm('¿Deseas crear una cuenta para unirte a SwapMind?')) {
                window.location.href = 'index.html';
            }
        }
    });

    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('.icono-seccion').forEach(el => {
            const speed = 0.3;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    const inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarPublicaciones();
        });
    }
}

function cerrarSesion() {
    SessionManager.cerrarSesionYRedirigir();
}

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina();
    publicacionesActuales = [...publicacionesEjemplo];
    mostrarPublicaciones();
});
