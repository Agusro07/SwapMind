// js/house.js

// ================================
// VARIABLES GLOBALES
// ================================
let publicacionesActuales = [];
let categoriaSeleccionada = 'todas';

// ================================
// DATOS DE EJEMPLO (fallback)
// ================================
const publicacionesEjemplo = [
    { id: 1, titulo: "Bicicleta de montaña Trek", descripcion: "Excelente estado, poco uso. Busco intercambiar por bicicleta de ruta o patineta eléctrica.", categoria: "bicicletas", usuario: "María González", fecha: "Hace 2 horas", icono: "🚲", avatar: "" },
    { id: 2, titulo: "Cámara Canon EOS", descripcion: "Cámara profesional, incluye lente 18-55mm. Interesados en equipo de música.", categoria: "electronica", usuario: "Carlos Ruiz", fecha: "Hace 5 horas", icono: "📷", avatar: "" },
    { id: 3, titulo: "Libro Harry Potter Colección", descripcion: "Edición de colección, buen estado. Cambio por otros libros de fantasía.", categoria: "libros", usuario: "Ana Torres", fecha: "Hace 1 día", icono: "📚", avatar: "" },
    { id: 4, titulo: "Patines profesionales", descripcion: "Talla 42, marca Rollerblade. Busco skateboard o longboard.", categoria: "deportes", usuario: "Pedro Martínez", fecha: "Hace 3 horas", icono: "⚽", avatar: "" },
    { id: 5, titulo: "Guitarra acústica Yamaha", descripcion: "Muy buen estado, con funda. Intercambio por teclado o bajo eléctrico.", categoria: "musica", usuario: "Laura Sánchez", fecha: "Hace 6 horas", icono: "🎸", avatar: "" }
];

// ================================
// HELPERS
// ================================
function escapeHtml(text) {
    if (!text && text !== 0) return '';
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function iconoPorCategoria(cat) {
    if (!cat) return '📦';
    const c = cat.toLowerCase();
    if (c.includes('bicicleta')) return '🚲';
    if (c.includes('electr')) return '📱';
    if (c.includes('libro')) return '📚';
    if (c.includes('musica') || c.includes('guitarra')) return '🎸';
    if (c.includes('deporte') || c.includes('patin') || c.includes('skate')) return '⚽';
    if (c.includes('hogar') || c.includes('cocina')) return '🏠';
    if (c.includes('ropa') || c.includes('vestimenta')) return '👕';
    return '📦';
}

function avatarDiceBear(seed) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`;
}

// ================================
// CATEGORÍAS CON NOMBRES Y DESCRIPCIONES COHERENTES
// ================================
const categoriasData = {
    bicicletas: {
        nombres: ["Bicicleta de montaña Trek", "Bicicleta de ruta Giant", "Bicicleta BMX Pro", "Patineta eléctrica Razor"],
        descripciones: [
            "Excelente estado, poco uso. Busco intercambiar por bicicleta de ruta o patineta eléctrica.",
            "Usada solo 2 meses, incluye casco y luces. Cambio por BMX.",
            "Perfecta para senderos y montaña. Intercambio por bicicleta urbana.",
            "Motor eléctrico funcionando, batería cargada. Busco scooter o skateboard."
        ]
    },
    electronica: {
        nombres: ["Cámara Canon EOS", "Smartphone Samsung Galaxy", "Audífonos Sony", "Tablet iPad"],
        descripciones: [
            "Cámara profesional, incluye lente 18-55mm. Interesados en equipo de música.",
            "Teléfono usado, sin rayones. Cambio por otro smartphone o accesorios.",
            "Auriculares bluetooth, como nuevos. Busco teclado o consola portátil.",
            "Tablet con funda y protector. Intercambio por laptop o monitor."
        ]
    },
    libros: {
        nombres: ["Harry Potter Colección", "El Principito", "Cien Años de Soledad", "Diario de Ana Frank"],
        descripciones: [
            "Edición de colección, buen estado. Cambio por otros libros de fantasía.",
            "Libro clásico en excelente estado. Intercambio por novelas juveniles.",
            "Tomo histórico, páginas intactas. Busco libros de historia o biografías.",
            "Libro educativo, apenas usado. Cambio por libros de autoayuda."
        ]
    },
    deportes: {
        nombres: ["Patines profesionales", "Skateboard", "Pelota de fútbol Adidas", "Raqueta de tenis"],
        descripciones: [
            "Talla 42, marca Rollerblade. Busco skateboard o longboard.",
            "Tabla usada en buen estado. Cambio por patines o scooter.",
            "Pelota oficial, sin uso. Intercambio por otros implementos deportivos.",
            "Raqueta profesional, cuerda nueva. Busco equipo de tenis o pádel."
        ]
    },
    musica: {
        nombres: ["Guitarra acústica Yamaha", "Teclado Casio", "Bajo eléctrico Fender", "Batería portátil Roland"],
        descripciones: [
            "Muy buen estado, con funda. Intercambio por teclado o bajo eléctrico.",
            "Teclado de 61 teclas, perfecto para principiantes. Cambio por guitarra.",
            "Bajo usado poco, incluye correa. Busco amplificador o pedal.",
            "Batería compacta, sonido excelente. Intercambio por instrumentos electrónicos."
        ]
    },
    hogar: {
        nombres: ["Sofá 3 plazas", "Ollas de cocina", "Lámpara de escritorio", "Juego de sábanas"],
        descripciones: [
            "Sofá cómodo, como nuevo. Busco muebles de decoración.",
            "Set de ollas antiadherentes. Intercambio por utensilios de cocina.",
            "Lámpara LED con regulador de intensidad. Busco lámpara de pie o accesorios.",
            "Sábanas 100% algodón, limpias y sin uso. Cambio por ropa de cama."
        ]
    },
    ropa: {
        nombres: ["Chaqueta de cuero", "Camiseta deportiva Nike", "Pantalones vaqueros Levis", "Vestido elegante"],
        descripciones: [
            "Chaqueta usada poco, talla M. Busco chaquetas o abrigos.",
            "Camiseta original, como nueva. Intercambio por otras prendas deportivas.",
            "Jeans en excelente estado, talla 32. Cambio por ropa casual.",
            "Vestido de fiesta, talla S. Busco accesorios o calzado."
        ]
    }
};

// ================================
// Generar nombre y descripción coherente
// ================================
function generarNombreDescripcion(cat) {
    const data = categoriasData[cat] || { nombres: ["Producto"], descripciones: ["Buen estado, disponible para intercambio."] };
    const nombre = data.nombres[Math.floor(Math.random() * data.nombres.length)];
    const descripcion = data.descripciones[Math.floor(Math.random() * data.descripciones.length)];
    return { nombre, descripcion };
}

// ================================
// RENDERIZAR PUBLICACIONES
// ================================
function mostrarPublicaciones(lista = publicacionesActuales) {
    const contenedor = document.getElementById('listaPublicaciones');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    const publicacionesFiltradas = categoriaSeleccionada === 'todas'
        ? lista
        : lista.filter(p => p.categoria === categoriaSeleccionada);

    if (publicacionesFiltradas.length === 0) {
        contenedor.innerHTML = `<div class="estado-vacio"><h3>No hay publicaciones en esta categoría</h3><p>Sé el primero en publicar un objeto para intercambiar</p></div>`;
        return;
    }

    publicacionesFiltradas.forEach(pub => {
        const publicacionDiv = document.createElement('div');
        publicacionDiv.className = 'publicacion-item fade-in';
        publicacionDiv.innerHTML = `
            <div class="imagen-publicacion">${pub.icono || '📦'}</div>
            <div class="contenido-publicacion">
                <div class="cabecera-usuario">
                    <img src="${escapeHtml(pub.avatar || '')}" alt="${escapeHtml(pub.usuario)}" class="avatar-mini">
                    <h3 class="titulo-publicacion">${escapeHtml(pub.titulo)}</h3>
                </div>
                <p class="descripcion-publicacion">${escapeHtml(pub.descripcion)}</p>
                <div class="info-publicacion">
                    <span class="usuario-publicacion">👤 ${escapeHtml(pub.usuario)}</span>
                    <span>⏰ ${escapeHtml(pub.fecha)}</span>
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
    categoriaSeleccionada = categoria || 'todas';
    mostrarPublicaciones();
    const el = document.getElementById('listaPublicaciones');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buscarPublicaciones() {
    const input = document.getElementById('inputBusqueda');
    const termino = (input?.value || '').toLowerCase().trim();
    if (!termino) {
        categoriaSeleccionada = 'todas';
        mostrarPublicaciones();
        return;
    }
    const resultados = publicacionesActuales.filter(pub =>
        pub.titulo.toLowerCase().includes(termino) ||
        pub.descripcion.toLowerCase().includes(termino)
    );
    mostrarPublicaciones(resultados);
}

// ================================
// GENERAR PUBLICACIONES CON USUARIOS REALES
// ================================
async function cargarPublicaciones() {
    try {
        const publicaciones = [];
        const productosCount = 12;
        const categorias = Object.keys(categoriasData);

        // Traer usuarios random
        const res = await fetch(`https://randomuser.me/api/?results=${productosCount}&nat=us,es`);
        const data = await res.json();
        const usuarios = data.results;

        for (let i = 0; i < productosCount; i++) {
            const cat = categorias[Math.floor(Math.random() * categorias.length)];
            const { nombre, descripcion } = generarNombreDescripcion(cat);
            const user = usuarios[i];
            const usuarioNombre = `${user.name.first} ${user.name.last}`;
            publicaciones.push({
                id: i + 1,
                titulo: nombre,
                descripcion: descripcion,
                categoria: cat,
                usuario: usuarioNombre,
                fecha: `Hace ${Math.floor(Math.random() * 24 + 1)} horas`,
                icono: iconoPorCategoria(cat),
                avatar: user.picture.thumbnail
            });
        }

        publicacionesActuales = publicaciones;
        mostrarPublicaciones();
    } catch (error) {
        console.error("Error al cargar usuarios reales, usando datos de ejemplo:", error);
        publicacionesActuales = [...publicacionesEjemplo];
        mostrarPublicaciones();
    }
}

// ================================
// NAVEGACIÓN
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
// INICIALIZACIÓN
// ================================
document.addEventListener('DOMContentLoaded', () => {
    cargarPublicaciones();

    const inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarPublicaciones();
        });
    }
});
