// Sistema de Roles y Permisos
const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

// Base de datos de productos (simulada)
let productos = JSON.parse(localStorage.getItem('productos')) || [
    {
        id: 1,
        nombre: "Charizard 1st Edition",
        descripcion: "Carta clásica de Charizard, edición primera",
        precio: 299.99,
        categoria: "pokemon",
        stock: 3,
        emoji: "🔥",
        nuevo: true
    },
    {
        id: 2,
        nombre: "Black Lotus",
        descripcion: "Carta legendaria de Magic, edición Alpha",
        precio: 999.99,
        categoria: "magic",
        stock: 1,
        emoji: "♠️",
        oferta: true
    },
    {
        id: 3,
        nombre: "Blue-Eyes White Dragon",
        descripcion: "Dragón Blanco de Ojos Azules, primera edición",
        precio: 199.99,
        categoria: "yugioh",
        stock: 5,
        emoji: "🐉"
    },
    {
        id: 4,
        nombre: "Pikachu Illustrator",
        descripcion: "Carta ultra rara de Pikachu",
        precio: 499.99,
        categoria: "pokemon",
        stock: 2,
        emoji: "⚡",
        nuevo: true
    },
    {
        id: 5,
        nombre: "Mox Ruby",
        descripcion: "Piedra Mox Ruby, edición Unlimited",
        precio: 399.99,
        categoria: "magic",
        stock: 4,
        emoji: "💎"
    },
    {
        id: 6,
        nombre: "Dark Magician",
        descripcion: "Mago Oscuro, edición legendaria",
        precio: 149.99,
        categoria: "yugioh",
        stock: 8,
        emoji: "🎩",
        oferta: true
    }
];

// Sistema de Subastas
let subastas = JSON.parse(localStorage.getItem('subastas')) || [
    {
        id: 1,
        nombre: "Charizard Shadowless 1st Edition",
        descripcion: "Carta extremadamente rara, condición gem mint",
        precioActual: 850.00,
        precioInicial: 500.00,
        categoria: "pokemon",
        estado: "activa",
        tiempoRestante: 3600,
        pujas: [
            { usuario: "Coleccionista1", monto: 500.00, fecha: new Date(Date.now() - 3600000) },
            { usuario: "PokeMaster", monto: 650.00, fecha: new Date(Date.now() - 1800000) },
            { usuario: "TCGExpert", monto: 850.00, fecha: new Date(Date.now() - 600000) }
        ],
        emoji: "🔥"
    },
    {
        id: 2,
        nombre: "Black Lotus Unlimited",
        descripcion: "La carta más icónica de Magic, edición Unlimited",
        precioActual: 15000.00,
        precioInicial: 10000.00,
        categoria: "magic",
        estado: "activa",
        tiempoRestante: 7200,
        pujas: [
            { usuario: "MagicLover", monto: 10000.00, fecha: new Date(Date.now() - 7200000) },
            { usuario: "VintageCollector", monto: 12500.00, fecha: new Date(Date.now() - 3600000) },
            { usuario: "CardKing", monto: 15000.00, fecha: new Date(Date.now() - 1200000) }
        ],
        emoji: "♠️"
    },
    {
        id: 3,
        nombre: "Blue-Eyes Ultimate Dragon",
        descripcion: "Dragón definitivo de tres cabezas, primera edición",
        precioActual: 1200.00,
        precioInicial: 800.00,
        categoria: "yugioh",
        estado: "activa",
        tiempoRestante: 1800,
        pujas: [
            { usuario: "DuelMaster", monto: 800.00, fecha: new Date(Date.now() - 5400000) },
            { usuario: "YugiFan", monto: 1000.00, fecha: new Date(Date.now() - 2700000) },
            { usuario: "KaibaCorp", monto: 1200.00, fecha: new Date(Date.now() - 900000) }
        ],
        emoji: "🐉"
    },
    {
        id: 4,
        nombre: "Pikachu Gold Star",
        descripcion: "Carta Gold Star extremadamente rara",
        precioActual: 0,
        precioInicial: 300.00,
        categoria: "pokemon",
        estado: "proxima",
        tiempoRestante: 86400,
        pujas: [],
        emoji: "⭐"
    },
    {
        id: 5,
        nombre: "Ancestral Recall",
        descripcion: "Poderosa carta azul de Magic",
        precioActual: 2500.00,
        precioInicial: 2000.00,
        categoria: "magic",
        estado: "finalizada",
        tiempoRestante: 0,
        pujas: [
            { usuario: "BluePlayer", monto: 2000.00, fecha: new Date(Date.now() - 86400000) },
            { usuario: "VintageDealer", monto: 2500.00, fecha: new Date(Date.now() - 43200000) }
        ],
        emoji: "🌀"
    }
];

// Sistema de Usuarios
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

// Usuario administrador por defecto (para pruebas)
if (!usuarios.find(u => u.email === 'admin@tcg.com')) {
    usuarios.push({
        id: 999,
        nombre: 'Administrador',
        email: 'admin@tcg.com',
        password: 'admin123',
        rol: ROLES.ADMIN,
        fechaRegistro: new Date(),
        pujasRealizadas: 0,
        comprasRealizadas: 0,
        subastasGanadas: 0
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productosFiltrados = [...productos];
let subastaActual = null;
let intervaloSubastas;

// ========== SISTEMA DE USUARIOS ==========

function initAuth() {
    actualizarUIUsuario();
    
    const authLink = document.getElementById('auth-link');
    const authModal = document.getElementById('auth-modal');
    const profileModal = document.getElementById('profile-modal');
    const closeAuth = document.querySelector('.close-auth');
    const closeProfile = document.querySelector('.close-profile');
    const authTabs = document.querySelectorAll('.auth-tab');
    
    console.log('Inicializando auth system...');
    console.log('Auth link:', authLink);
    console.log('Auth modal:', authModal);
    console.log('Profile modal:', profileModal);
    
    if (authLink) {
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Click en Mi Cuenta, usuario:', usuarioActual);
            
            if (usuarioActual) {
                mostrarPerfil();
            } else {
                if (authModal) {
                    authModal.style.display = 'block';
                }
            }
        });
    }

    // Tabs de autenticación
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            cambiarTabAuth(tabName);
        });
    });

    // Forms de auth
    const loginForm = document.querySelector('.login-form-auth');
    const registerForm = document.querySelector('.register-form-auth');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Cerrar modales
    if (closeAuth) {
        closeAuth.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'none';
        });
    }

    if (closeProfile) {
        closeProfile.addEventListener('click', () => {
            if (profileModal) profileModal.style.display = 'none';
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (authModal && e.target === authModal) {
            authModal.style.display = 'none';
        }
        if (profileModal && e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
}

function cambiarTabAuth(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    authTabs.forEach(tab => tab.classList.remove('active'));
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-form`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        usuarioActual = usuario;
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
        actualizarUIUsuario();
        
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'none';
        
        mostrarToast('¡Bienvenido de nuevo!', 'success');
    } else {
        mostrarToast('Email o contraseña incorrectos', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input');
    const nombre = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (password !== confirmPassword) {
        mostrarToast('Las contraseñas no coinciden', 'error');
        return;
    }

    if (usuarios.find(u => u.email === email)) {
        mostrarToast('Este email ya está registrado', 'error');
        return;
    }

    const nuevoUsuario = {
        id: Date.now(),
        nombre,
        email,
        password,
        rol: ROLES.USER,
        fechaRegistro: new Date(),
        pujasRealizadas: 0,
        comprasRealizadas: 0,
        subastasGanadas: 0
    };

    usuarios.push(nuevoUsuario);
    usuarioActual = nuevoUsuario;
    
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
    actualizarUIUsuario();
    
    const authModal = document.getElementById('auth-modal');
    if (authModal) authModal.style.display = 'none';
    
    mostrarToast('¡Cuenta creada exitosamente!', 'success');
}

function actualizarUIUsuario() {
    const authLink = document.getElementById('auth-link');
    const nav = document.querySelector('.nav');
    
    if (authLink && nav) {
        if (usuarioActual) {
            // Usuario logueado - mostrar nombre y enlaces a paneles
            authLink.innerHTML = `👋 ${usuarioActual.nombre.split(' ')[0]}`;
            authLink.style.color = '#27ae60';
            authLink.style.fontWeight = 'bold';
            
            // Eliminar enlaces antiguos de panel si existen
            const oldAdminLink = document.getElementById('admin-link');
            const oldUserLink = document.getElementById('user-link');
            if (oldAdminLink) oldAdminLink.remove();
            if (oldUserLink) oldUserLink.remove();
            
            // Crear enlaces según el rol
            if (usuarioActual.rol === ROLES.ADMIN) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.className = 'nav-link';
                adminLink.id = 'admin-link';
                adminLink.innerHTML = '⚙️ Panel Admin';
                adminLink.style.background = '#e74c3c';
                nav.insertBefore(adminLink, authLink);
            }
            
            // Enlace al panel de usuario para todos los usuarios logueados
            const userLink = document.createElement('a');
            userLink.href = 'usuario.html';
            userLink.className = 'nav-link';
            userLink.id = 'user-link';
            userLink.innerHTML = '👤 Mi Panel';
            userLink.style.background = '#3498db';
            nav.insertBefore(userLink, authLink);
            
        } else {
            // Usuario no logueado - mostrar solo "Mi Cuenta"
            authLink.innerHTML = 'Mi Cuenta';
            authLink.style.color = '';
            authLink.style.fontWeight = '';
            
            // Eliminar enlaces de panel si existen
            const adminLink = document.getElementById('admin-link');
            const userLink = document.getElementById('user-link');
            if (adminLink) adminLink.remove();
            if (userLink) userLink.remove();
        }
    }
}

function mostrarPerfil() {
    if (!usuarioActual) {
        console.log('No hay usuario logueado');
        return;
    }
    
    console.log('=== MOSTRAR PERFIL - DIAGNÓSTICO COMPLETO ===');
    
    const profileModal = document.getElementById('profile-modal');
    console.log('Modal antes de mostrar:', profileModal);
    console.log('Style antes:', profileModal?.style.display);
    
    // FORZAR la visualización del modal
    if (profileModal) {
        // Método 1: Usar style directo
        profileModal.style.display = 'block';
        
        // Método 2: Agregar clase de diagnóstico
        profileModal.classList.add('diagnostico');
        
        // Método 3: Usar setAttribute
        profileModal.setAttribute('style', 'display: block !important');
        
        console.log('Style después:', profileModal.style.display);
        console.log('Clases del modal:', profileModal.className);
    }
    
    // Actualizar información del perfil
    const elements = {
        'profile-name': usuarioActual.nombre,
        'profile-email': usuarioActual.email,
        'pujas-realizadas': usuarioActual.pujasRealizadas || 0,
        'compras-realizadas': usuarioActual.comprasRealizadas || 0,
        'subastas-ganadas': usuarioActual.subastasGanadas || 0
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            console.log(`✅ ${id} actualizado:`, value);
        } else {
            console.log(`❌ ${id} NO encontrado`);
        }
    });
    
    // Verificar el botón específicamente
    const profileActions = document.querySelector('.profile-actions');
    console.log('profile-actions:', profileActions);
    if (profileActions) {
        console.log('HTML de profile-actions:', profileActions.innerHTML);
        console.log('Estilos computados:', window.getComputedStyle(profileActions));
    }
    
    console.log('=== FIN DIAGNÓSTICO ===');
    
    // Verificar después de un momento
    setTimeout(() => {
        console.log('Verificación posterior - Modal display:', profileModal?.style.display);
        console.log('¿Modal visible?', profileModal?.offsetParent !== null);
    }, 100);
}

// Función para cerrar sesión - DEBE estar disponible globalmente
function cerrarSesion() {
    console.log('Cerrando sesión...');
    
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    
    // Cerrar todos los modales
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => {
        modal.style.display = 'none';
    });
    
    // Actualizar UI
    actualizarUIUsuario();
    
    // Mostrar notificación
    mostrarToast('Sesión cerrada exitosamente', 'warning');
    
    // Redirigir después de un momento
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ========== SISTEMA DE TIENDA ==========

function initTienda() {
    if (document.getElementById('productos-grid')) {
        renderProductos();
        setupFiltros();
        updateCartCount();
    }
}

function renderProductos() {
    const productosGrid = document.getElementById('productos-grid');
    const productosLoading = document.getElementById('productos-loading');
    const productosEmpty = document.getElementById('productos-empty');
    
    if (!productosGrid) return;

    // Mostrar loading
    productosGrid.innerHTML = '';
    productosLoading.style.display = 'block';
    productosEmpty.style.display = 'none';

    setTimeout(() => {
        productosLoading.style.display = 'none';

        if (productosFiltrados.length === 0) {
            productosEmpty.style.display = 'block';
            return;
        }

        productosGrid.innerHTML = productosFiltrados.map(producto => {
            const esNuevo = producto.nuevo ? '<div class="badge-nuevo">NUEVO</div>' : '';
            const esOferta = producto.oferta ? '<div class="badge-oferta">OFERTA</div>' : '';
            const badges = esNuevo || esOferta;
            
            return `
                <div class="producto-card">
                    ${badges}
                    <div class="producto-img">
                        ${producto.emoji || '🃏'}
                    </div>
                    <h3 class="producto-titulo">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <div class="producto-precio">$${producto.precio}</div>
                    <div class="producto-stock">Stock: ${producto.stock}</div>
                    <div class="producto-acciones">
                        <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})" 
                            ${producto.stock === 0 ? 'disabled' : ''}>
                            ${producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                        <button class="btn-ver-mas" onclick="verProducto(${producto.id})">
                            Ver Más
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }, 500); // Simular carga
}

// Función para ver detalles del producto
function verProducto(productoId) {
    window.location.href = `producto/index.html?id=${productoId}`;
}

// Función para limpiar filtros
function limpiarFiltros() {
    if (categoriaFilter) categoriaFilter.value = 'all';
    if (precioFilter) precioFilter.value = 'all';
    if (searchInput) searchInput.value = '';
    filtrarProductos();
}

function setupFiltros() {
    const categoriaFilter = document.getElementById('categoria-filter');
    const precioFilter = document.getElementById('precio-filter');
    const searchInput = document.getElementById('search');
    
    if (categoriaFilter) {
        categoriaFilter.addEventListener('change', filtrarProductos);
        precioFilter.addEventListener('change', filtrarProductos);
        searchInput.addEventListener('input', filtrarProductos);
    }
}

function filtrarProductos() {
    const categoriaFilter = document.getElementById('categoria-filter');
    const precioFilter = document.getElementById('precio-filter');
    const searchInput = document.getElementById('search');
    
    const categoria = categoriaFilter.value;
    const precio = precioFilter.value;
    const search = searchInput.value.toLowerCase();

    productosFiltrados = productos.filter(producto => {
        const coincideCategoria = categoria === 'all' || producto.categoria === categoria;
        const coincideSearch = producto.nombre.toLowerCase().includes(search) || 
                              producto.descripcion.toLowerCase().includes(search);
        
        let coincidePrecio = true;
        if (precio !== 'all') {
            switch (precio) {
                case '0-50':
                    coincidePrecio = producto.precio <= 50;
                    break;
                case '50-100':
                    coincidePrecio = producto.precio > 50 && producto.precio <= 100;
                    break;
                case '100+':
                    coincidePrecio = producto.precio > 100;
                    break;
            }
        }
        
        return coincideCategoria && coincideSearch && coincidePrecio;
    });
    
    renderProductos();
}

// ========== SISTEMA DE CARRITO ==========

function agregarAlCarrito(id) {
    if (!usuarioActual) {
        mostrarToast('Inicia sesión para agregar productos al carrito', 'warning');
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'block';
        return;
    }
    
    const producto = productos.find(p => p.id === id);
    const itemEnCarrito = carrito.find(item => item.id === id);
    
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < producto.stock) {
            itemEnCarrito.cantidad++;
        } else {
            mostrarToast('No hay más stock disponible', 'error');
            return;
        }
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    updateCartCount();
    mostrarToast('Producto agregado al carrito', 'success');
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
}

function setupCarritoEvents() {
    const cartLink = document.getElementById('cart-link');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCarrito();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (cartModal) cartModal.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (carrito.length === 0) {
                mostrarToast('El carrito está vacío', 'error');
                return;
            }
            
            if (!usuarioActual) {
                mostrarToast('Inicia sesión para proceder al pago', 'warning');
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.style.display = 'block';
                return;
            }
            
            // Simular proceso de pago
            checkoutBtn.innerHTML = '<div class="loading"></div> Procesando...';
            checkoutBtn.disabled = true;
            
            setTimeout(() => {
                usuarioActual.comprasRealizadas = (usuarioActual.comprasRealizadas || 0) + 1;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
                
                // Guardar historial de compra
                const compras = JSON.parse(localStorage.getItem('comprasUsuario')) || [];
                compras.push({
                    id: Date.now(),
                    productos: [...carrito],
                    total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
                    fecha: new Date(),
                    estado: 'completado'
                });
                localStorage.setItem('comprasUsuario', JSON.stringify(compras));
                
                carrito = [];
                guardarCarrito();
                updateCartCount();
                mostrarCarrito();
                
                if (cartModal) cartModal.style.display = 'none';
                
                checkoutBtn.innerHTML = 'Proceder al Pago';
                checkoutBtn.disabled = false;
                
                mostrarToast('¡Compra realizada exitosamente!', 'success');
            }, 2000);
        });
    }
}

function mostrarCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartModal = document.getElementById('cart-modal');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
        if (cartTotal) cartTotal.textContent = '0';
    } else {
        let total = 0;
        let subtotal = 0;
        
        carrito.forEach(item => {
            const itemTotal = item.precio * item.cantidad;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <div class="cart-item-precio">$${item.precio} c/u</div>
                </div>
                <div class="cart-item-cantidad">
                    <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, 1)">+</button>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
        
        total = subtotal;
        
        // Agregar resumen
        const summaryElement = document.createElement('div');
        summaryElement.className = 'cart-summary';
        summaryElement.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Envío:</span>
                <span>Gratis</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(summaryElement);
        
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
    }
    
    if (cartModal) {
        cartModal.style.display = 'block';
    }
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    const producto = productos.find(p => p.id === id);
    
    if (item) {
        item.cantidad += cambio;
        
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
        } else if (item.cantidad > producto.stock) {
            item.cantidad = producto.stock;
            mostrarToast('No hay más stock disponible', 'error');
        }
        
        guardarCarrito();
        updateCartCount();
        mostrarCarrito();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    updateCartCount();
    mostrarCarrito();
    mostrarToast('Producto eliminado del carrito', 'warning');
}

// ========== SISTEMA DE SUBASTAS ==========

function initSubastas() {
    if (document.getElementById('subastas-grid')) {
        renderSubastas();
        setupFiltrosSubastas();
        actualizarEstadisticas();
        iniciarContadores();
    }
}

function renderSubastas() {
    const subastasGrid = document.getElementById('subastas-grid');
    const subastasLoading = document.getElementById('subastas-loading');
    const subastasEmpty = document.getElementById('subastas-empty');
    
    if (!subastasGrid) return;

    const estadoSubastaFilter = document.getElementById('estado-subasta');
    const categoriaSubastaFilter = document.getElementById('categoria-subasta');
    const searchSubastaInput = document.getElementById('search-subasta');
    
    const estadoFiltro = estadoSubastaFilter ? estadoSubastaFilter.value : 'todas';
    const categoriaFiltro = categoriaSubastaFilter ? categoriaSubastaFilter.value : 'todas';
    const searchFiltro = searchSubastaInput ? searchSubastaInput.value.toLowerCase() : '';
    
    const subastasFiltradas = subastas.filter(subasta => {
        const coincideEstado = estadoFiltro === 'todas' || subasta.estado === estadoFiltro;
        const coincideCategoria = categoriaFiltro === 'todas' || subasta.categoria === categoriaFiltro;
        const coincideSearch = subasta.nombre.toLowerCase().includes(searchFiltro) || 
                              subasta.descripcion.toLowerCase().includes(searchFiltro);
        
        return coincideEstado && coincideCategoria && coincideSearch;
    });

    // Mostrar loading
    subastasGrid.innerHTML = '';
    subastasLoading.style.display = 'block';
    subastasEmpty.style.display = 'none';

    setTimeout(() => {
        subastasLoading.style.display = 'none';

        if (subastasFiltradas.length === 0) {
            subastasEmpty.style.display = 'block';
            return;
        }

        subastasGrid.innerHTML = subastasFiltradas.map(subasta => {
            const tiempoFormateado = formatearTiempo(subasta.tiempoRestante);
            const badgeTexto = subasta.estado === 'activa' ? 'Activa' : 
                              subasta.estado === 'proxima' ? 'Próxima' : 'Finalizada';
            const badgeClase = `subasta-badge badge-${subasta.estado}`;
            const totalPujas = subasta.pujas ? subasta.pujas.length : 0;
            
            return `
                <div class="subasta-card ${subasta.estado}">
                    <div class="${badgeClase}">${badgeTexto}</div>
                    <div class="subasta-img">
                        ${subasta.emoji || '⚡'}
                    </div>
                    <div class="subasta-info">
                        <h3>${subasta.nombre}</h3>
                        <p class="subasta-descripcion">${subasta.descripcion}</p>
                        <div class="subasta-detalles">
                            <div class="subasta-precio">
                                <div class="precio-actual">$${subasta.precioActual.toFixed(2)}</div>
                                <div class="precio-inicial">Inicio: $${subasta.precioInicial.toFixed(2)}</div>
                            </div>
                            <div class="subasta-tiempo">
                                <div class="tiempo-restante ${subasta.tiempoRestante < 300 ? 'contador-emergencia' : ''}">
                                    ${tiempoFormateado}
                                </div>
                                <div class="tiempo-label">Tiempo Restante</div>
                            </div>
                        </div>
                        <div class="subasta-meta">
                            <span class="pujas-count">${totalPujas} pujas</span>
                            <span class="subasta-categoria">${subasta.categoria}</span>
                        </div>
                        <div class="subasta-acciones">
                            <button class="btn-pujar" onclick="abrirModalPuja(${subasta.id})" 
                                ${subasta.estado !== 'activa' ? 'disabled' : ''}>
                                ${subasta.estado === 'activa' ? 'Pujar Ahora' : 
                                  subasta.estado === 'proxima' ? 'Próximamente' : 'Finalizada'}
                            </button>
                            <button class="btn-ver-subasta" onclick="verSubasta(${subasta.id})">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }, 500); // Simular carga
}

// Función para ver detalles de la subasta
function verSubasta(subastaId) {
    window.location.href = `subasta/index.html?id=${subastaId}`;
}

// Función para limpiar filtros de subastas
function limpiarFiltrosSubastas() {
    const estadoSubastaFilter = document.getElementById('estado-subasta');
    const categoriaSubastaFilter = document.getElementById('categoria-subasta');
    const searchSubastaInput = document.getElementById('search-subasta');
    
    if (estadoSubastaFilter) estadoSubastaFilter.value = 'todas';
    if (categoriaSubastaFilter) categoriaSubastaFilter.value = 'todas';
    if (searchSubastaInput) searchSubastaInput.value = '';
    
    renderSubastas();
}

function formatearTiempo(segundos) {
    if (segundos <= 0) return 'Finalizada';
    
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
        return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
        return `${minutos}m ${segs}s`;
    } else {
        return `${segs}s`;
    }
}

function setupFiltrosSubastas() {
    const estadoSubastaFilter = document.getElementById('estado-subasta');
    const categoriaSubastaFilter = document.getElementById('categoria-subasta');
    const searchSubastaInput = document.getElementById('search-subasta');
    
    if (estadoSubastaFilter) {
        estadoSubastaFilter.addEventListener('change', renderSubastas);
        categoriaSubastaFilter.addEventListener('change', renderSubastas);
        searchSubastaInput.addEventListener('input', renderSubastas);
    }
}

function actualizarEstadisticas() {
    const subastasActivasSpan = document.getElementById('subastas-activas');
    const pujasTotalesSpan = document.getElementById('pujas-totales');
    const usuariosActivosSpan = document.getElementById('usuarios-activos');
    
    if (subastasActivasSpan) {
        const activas = subastas.filter(s => s.estado === 'activa').length;
        const totalPujas = subastas.reduce((total, subasta) => total + subasta.pujas.length, 0);
        const usuariosUnicos = new Set(subastas.flatMap(s => s.pujas.map(p => p.usuario))).size;
        
        subastasActivasSpan.textContent = activas;
        pujasTotalesSpan.textContent = totalPujas;
        usuariosActivosSpan.textContent = usuariosUnicos + 15;
    }
}

function iniciarContadores() {
    const subastasGrid = document.getElementById('subastas-grid');
    if (subastasGrid) {
        clearInterval(intervaloSubastas);
        intervaloSubastas = setInterval(() => {
            subastas.forEach(subasta => {
                if (subasta.estado === 'activa' && subasta.tiempoRestante > 0) {
                    subasta.tiempoRestante--;
                    
                    if (subasta.tiempoRestante <= 0) {
                        subasta.estado = 'finalizada';
                        mostrarToast(`¡Subasta finalizada! ${subasta.nombre} vendida por $${subasta.precioActual}`);
                    }
                }
            });
            localStorage.setItem('subastas', JSON.stringify(subastas));
            renderSubastas();
            actualizarEstadisticas();
        }, 1000);
    }
}

function setupSubastasEvents() {
    const closePujaModal = document.querySelector('.close-puja');
    const cancelarPujaBtn = document.getElementById('cancelar-puja');
    const enviarPujaBtn = document.getElementById('enviar-puja');
    const pujaModal = document.getElementById('puja-modal');
    
    if (closePujaModal) {
        closePujaModal.addEventListener('click', () => {
            if (pujaModal) pujaModal.style.display = 'none';
            subastaActual = null;
        });
    }

    if (cancelarPujaBtn) {
        cancelarPujaBtn.addEventListener('click', () => {
            if (pujaModal) pujaModal.style.display = 'none';
            subastaActual = null;
        });
    }

    if (enviarPujaBtn) {
        enviarPujaBtn.addEventListener('click', enviarPuja);
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        const pujaModal = document.getElementById('puja-modal');
        if (pujaModal && e.target === pujaModal) {
            pujaModal.style.display = 'none';
            subastaActual = null;
        }
    });
}

function abrirModalPuja(subastaId) {
    if (!usuarioActual) {
        mostrarToast('Inicia sesión para pujar en subastas', 'warning');
        const authModal = document.getElementById('auth-modal');
        if (authModal) authModal.style.display = 'block';
        return;
    }
    
    subastaActual = subastas.find(s => s.id === subastaId);
    
    if (!subastaActual || subastaActual.estado !== 'activa') return;
    
    const pujaInfoDiv = document.getElementById('puja-info');
    const montoPujaInput = document.getElementById('monto-puja');
    const pujaModal = document.getElementById('puja-modal');
    
    if (pujaInfoDiv) {
        pujaInfoDiv.innerHTML = `
            <h3>${subastaActual.nombre}</h3>
            <p>${subastaActual.descripcion}</p>
            <div class="subasta-detalles">
                <div class="subasta-precio">
                    <div class="precio-actual">Puja Actual: $${subastaActual.precioActual.toFixed(2)}</div>
                    <div class="precio-inicial">Puja Mínima: $${(subastaActual.precioActual + 10).toFixed(2)}</div>
                </div>
                <div class="subasta-tiempo">
                    <div class="tiempo-restante">${formatearTiempo(subastaActual.tiempoRestante)}</div>
                    <div class="tiempo-label">Tiempo Restante</div>
                </div>
            </div>
        `;
    }
    
    if (montoPujaInput) {
        montoPujaInput.value = (subastaActual.precioActual + 10).toFixed(2);
        montoPujaInput.min = (subastaActual.precioActual + 10).toFixed(2);
    }
    
    actualizarHistorialPujas();
    
    if (pujaModal) {
        pujaModal.style.display = 'block';
    }
}

function actualizarHistorialPujas() {
    const pujasListaDiv = document.getElementById('pujas-lista');
    if (!pujasListaDiv || !subastaActual) return;
    
    pujasListaDiv.innerHTML = '';
    
    if (subastaActual.pujas.length === 0) {
        pujasListaDiv.innerHTML = '<p>No hay pujas aún. ¡Sé el primero en pujar!</p>';
        return;
    }
    
    const pujasOrdenadas = [...subastaActual.pujas].sort((a, b) => b.monto - a.monto);
    
    pujasOrdenadas.forEach((puja, index) => {
        const pujaElement = document.createElement('div');
        pujaElement.className = `puja-item ${puja.usuario === "Tú" ? 'propia' : ''}`;
        pujaElement.innerHTML = `
            <div>
                <div class="puja-usuario">${puja.usuario}</div>
                <div class="puja-fecha">${puja.fecha.toLocaleTimeString()}</div>
            </div>
            <div class="puja-monto">$${puja.monto.toFixed(2)}</div>
        `;
        pujasListaDiv.appendChild(pujaElement);
    });
}

function enviarPuja() {
    if (!subastaActual || !usuarioActual) return;
    
    const montoPujaInput = document.getElementById('monto-puja');
    const monto = parseFloat(montoPujaInput.value);
    const minimaPuja = subastaActual.precioActual + 10;
    
    if (monto < minimaPuja) {
        mostrarToast(`La puja mínima es $${minimaPuja.toFixed(2)}`, 'error');
        return;
    }
    
    // Agregar nueva puja
    subastaActual.pujas.push({
        usuario: "Tú",
        monto: monto,
        fecha: new Date()
    });
    
    // Actualizar precio actual
    subastaActual.precioActual = monto;
    
    // Actualizar estadísticas del usuario
    usuarioActual.pujasRealizadas = (usuarioActual.pujasRealizadas || 0) + 1;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
    // Guardar cambios
    localStorage.setItem('subastas', JSON.stringify(subastas));
    
    mostrarToast(`¡Puja enviada! $${monto.toFixed(2)} por ${subastaActual.nombre}`, 'success');
    
    const pujaModal = document.getElementById('puja-modal');
    if (pujaModal) pujaModal.style.display = 'none';
    
    renderSubastas();
    actualizarEstadisticas();
    subastaActual = null;
}

function verPujas(subastaId) {
    const subasta = subastas.find(s => s.id === subastaId);
    if (!subasta) return;
    
    subastaActual = subasta;
    actualizarHistorialPujas();
    
    const pujaModal = document.getElementById('puja-modal');
    if (pujaModal) pujaModal.style.display = 'block';
}

// ========== SISTEMA DE NOTIFICACIONES ==========

function mostrarToast(mensaje, tipo = 'success') {
    // Crear contenedor si no existe
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    toast.textContent = mensaje;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// ========== INICIALIZACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando aplicación...');
    
    // Inicializar todos los sistemas
    initAuth();
    initTienda();
    initSubastas();
    setupCarritoEvents();
    setupSubastasEvents();
    
    // Guardar datos iniciales
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('subastas', JSON.stringify(subastas));
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log('Aplicación inicializada correctamente');
});

// Hacer funciones disponibles globalmente
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.abrirModalPuja = abrirModalPuja;
window.verPujas = verPujas;
window.cerrarSesion = cerrarSesion;
window.mostrarPerfil = mostrarPerfil;

// CÓDIGO TEMPORAL PARA DIAGNÓSTICO
setTimeout(() => {
    console.log('=== DIAGNÓSTICO INICIAL ===');
    console.log('Usuario en localStorage:', localStorage.getItem('usuarioActual'));
    console.log('Usuario actual en variable:', usuarioActual);
    
    // Verificar que los modales existan
    console.log('Modal auth:', document.getElementById('auth-modal'));
    console.log('Modal profile:', document.getElementById('profile-modal'));
    console.log('Modal carrito:', document.getElementById('cart-modal'));
    
    // Verificar que el botón cerrarSesion esté definido
    console.log('Función cerrarSesion:', typeof cerrarSesion);
    
    // Forzar la actualización de la UI
    actualizarUIUsuario();
    
    console.log('=== FIN DIAGNÓSTICO INICIAL ===');
}, 1000);

// Función para formatear tiempo (compatible con todas las páginas)
function formatearTiempo(segundos) {
    if (segundos <= 0) return 'Finalizada';
    
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    
    if (horas > 0) {
        return `${horas}h ${minutos}m ${segs}s`;
    } else if (minutos > 0) {
        return `${minutos}m ${segs}s`;
    } else {
        return `${segs}s`;
    }
}

// Función para actualizar contador del carrito (compatible con todas las páginas)
function actualizarContadorCarrito() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        cartCount.textContent = totalItems;
    }
}

// Función para mostrar notificaciones (compatible con todas las páginas)
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear contenedor de notificaciones si no existe
    let container = document.querySelector('.notificacion-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notificacion-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notificacion ${tipo}`;
    notification.style.cssText = `
        background: ${tipo === 'success' ? '#27ae60' : tipo === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        margin-bottom: 0.5rem;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = mensaje;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación para notificaciones
    if (!document.querySelector('#notificacion-styles')) {
        const style = document.createElement('style');
     style.id = 'notificacion-styles';
     style.textContent = `
            @keyframes slideIn {
                from {
                 transform: translateX(100%);
                    opacity: 0;
             }
             to {
                 transform: translateX(0);
                    opacity: 1;
             }
         }
         @keyframes slideOut {
             from {
                 transform: translateX(0);
                 opacity: 1;
             }
             to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
     `;
     document.head.appendChild(style);
    }