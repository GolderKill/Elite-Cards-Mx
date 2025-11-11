// Panel de Administración
let productoEditando = null;
let subastaEditando = null;

function initAdminPanel() {
    verificarAdmin();
    cargarDashboard();
    cargarProductosAdmin();
    cargarSubastasAdmin();
    cargarUsuariosAdmin();
    setupAdminEvents();
}

function verificarAdmin() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario || usuario.rol !== ROLES.ADMIN) {
        window.location.href = 'login.html';
        return;
    }
}

function cargarDashboard() {
    const totalProductos = productos.length;
    const totalSubastas = subastas.filter(s => s.estado === 'activa').length;
    const totalUsuarios = usuarios.length;
    const totalVentas = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    document.getElementById('total-productos').textContent = totalProductos;
    document.getElementById('total-subastas').textContent = totalSubastas;
    document.getElementById('total-usuarios').textContent = totalUsuarios;
    document.getElementById('total-ventas').textContent = `$${totalVentas.toFixed(2)}`;
}

function cargarProductosAdmin() {
    const tbody = document.getElementById('tabla-productos');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="producto-img-small">
                    ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : producto.emoji}
                </div>
            </td>
            <td>${producto.nombre}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td class="acciones">
                <button class="btn btn-small btn-warning" onclick="editarProducto(${producto.id})">✏️</button>
                <button class="btn btn-small btn-danger" onclick="eliminarProducto(${producto.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function cargarSubastasAdmin() {
    const tbody = document.getElementById('tabla-subastas');
    tbody.innerHTML = '';

    subastas.forEach(subasta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${subasta.nombre}</td>
            <td>$${subasta.precioActual.toFixed(2)}</td>
            <td>${subasta.pujas.length}</td>
            <td>${formatearTiempo(subasta.tiempoRestante)}</td>
            <td><span class="badge badge-${subasta.estado}">${subasta.estado}</span></td>
            <td class="acciones">
                <button class="btn btn-small btn-danger" onclick="eliminarSubasta(${subasta.id})">🗑️</button>
                ${subasta.estado === 'activa' ? 
                    `<button class="btn btn-small btn-warning" onclick="finalizarSubasta(${subasta.id})">⏹️</button>` : 
                    ''
                }
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function cargarUsuariosAdmin() {
    const tbody = document.getElementById('tabla-usuarios');
    tbody.innerHTML = '';

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
            <td><span class="badge ${usuario.rol === ROLES.ADMIN ? 'badge-admin' : 'badge-user'}">${usuario.rol}</span></td>
            <td class="acciones">
                ${usuario.rol !== ROLES.ADMIN ? 
                    `<button class="btn btn-small btn-warning" onclick="cambiarRol(${usuario.id})">👑</button>` : 
                    ''
                }
                <button class="btn btn-small btn-danger" onclick="eliminarUsuario(${usuario.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funciones de Productos
function abrirModalProducto(producto = null) {
    productoEditando = producto;
    const modal = document.getElementById('modal-producto');
    const titulo = document.getElementById('titulo-modal-producto');
    const form = document.getElementById('form-producto');
    
    if (producto) {
        titulo.textContent = 'Editar Producto';
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-descripcion').value = producto.descripcion;
        document.getElementById('producto-precio').value = producto.precio;
        document.getElementById('producto-stock').value = producto.stock;
        document.getElementById('producto-categoria').value = producto.categoria;
        document.getElementById('producto-imagen').value = producto.imagen || '';
    } else {
        titulo.textContent = 'Agregar Producto';
        form.reset();
    }
    
    modal.style.display = 'block';
}

function cerrarModalProducto() {
    document.getElementById('modal-producto').style.display = 'none';
    productoEditando = null;
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModalProducto(producto);
    }
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductosAdmin();
        cargarDashboard();
        mostrarToast('Producto eliminado', 'success');
    }
}

// Funciones de Subastas
function abrirModalSubasta() {
    document.getElementById('modal-subasta').style.display = 'block';
}

function cerrarModalSubasta() {
    document.getElementById('modal-subasta').style.display = 'none';
    subastaEditando = null;
}

function eliminarSubasta(id) {
    if (confirm('¿Estás seguro de eliminar esta subasta?')) {
        subastas = subastas.filter(s => s.id !== id);
        localStorage.setItem('subastas', JSON.stringify(subastas));
        cargarSubastasAdmin();
        cargarDashboard();
        mostrarToast('Subasta eliminada', 'success');
    }
}

function finalizarSubasta(id) {
    const subasta = subastas.find(s => s.id === id);
    if (subasta) {
        subasta.estado = 'finalizada';
        subasta.tiempoRestante = 0;
        localStorage.setItem('subastas', JSON.stringify(subastas));
        cargarSubastasAdmin();
        mostrarToast('Subasta finalizada', 'success');
    }
}

// Funciones de Usuarios
function cambiarRol(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.rol = ROLES.ADMIN;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuariosAdmin();
        mostrarToast('Usuario promovido a administrador', 'success');
    }
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        usuarios = usuarios.filter(u => u.id !== id);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuariosAdmin();
        cargarDashboard();
        mostrarToast('Usuario eliminado', 'success');
    }
}

// Event Listeners
function setupAdminEvents() {
    document.getElementById('form-producto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productoData = {
            nombre: document.getElementById('producto-nombre').value,
            descripcion: document.getElementById('producto-descripcion').value,
            precio: parseFloat(document.getElementById('producto-precio').value),
            stock: parseInt(document.getElementById('producto-stock').value),
            categoria: document.getElementById('producto-categoria').value,
            imagen: document.getElementById('producto-imagen').value
        };
        
        if (productoEditando) {
            // Editar producto existente
            Object.assign(productoEditando, productoData);
            mostrarToast('Producto actualizado', 'success');
        } else {
            // Crear nuevo producto
            const nuevoProducto = {
                id: Date.now(),
                emoji: '🃏',
                ...productoData
            };
            productos.push(nuevoProducto);
            mostrarToast('Producto creado', 'success');
        }
        
        localStorage.setItem('productos', JSON.stringify(productos));
        cerrarModalProducto();
        cargarProductosAdmin();
        cargarDashboard();
    });
    
    document.getElementById('form-subasta').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subastaData = {
            nombre: document.getElementById('subasta-nombre').value,
            descripcion: document.getElementById('subasta-descripcion').value,
            precioActual: parseFloat(document.getElementById('subasta-precio-inicial').value),
            precioInicial: parseFloat(document.getElementById('subasta-precio-inicial').value),
            categoria: document.getElementById('subasta-categoria').value,
            duracion: parseInt(document.getElementById('subasta-duracion').value),
            imagen: document.getElementById('subasta-imagen').value
        };
        
        const nuevaSubasta = {
            id: Date.now(),
            estado: 'activa',
            tiempoRestante: subastaData.duracion * 3600, // convertir horas a segundos
            pujas: [],
            emoji: '⚡',
            ...subastaData
        };
        
        subastas.push(nuevaSubasta);
        localStorage.setItem('subastas', JSON.stringify(subastas));
        
        cerrarModalSubasta();
        cargarSubastasAdmin();
        cargarDashboard();
        mostrarToast('Subasta creada', 'success');
    });
}

// Inicializar panel de admin cuando se carga la página
document.addEventListener('DOMContentLoaded', initAdminPanel);