// Panel de Usuario
function initUsuarioPanel() {
    verificarUsuario();
    cargarPerfilUsuario();
    cargarMisPujas();
    cargarMisCompras();
    cargarSubastasGanadas();
}

function verificarUsuario() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    return usuario;
}

function cargarPerfilUsuario() {
    const usuario = verificarUsuario();
    if (!usuario) return;

    document.getElementById('usuario-nombre').textContent = usuario.nombre;
    document.getElementById('usuario-email').textContent = usuario.email;
    document.getElementById('usuario-fecha').textContent = new Date(usuario.fechaRegistro).toLocaleDateString();
    
    // Estadísticas del usuario
    document.getElementById('user-pujas').textContent = usuario.pujasRealizadas || 0;
    document.getElementById('user-compras').textContent = usuario.comprasRealizadas || 0;
    document.getElementById('user-ganadas').textContent = usuario.subastasGanadas || 0;
    
    // Calcular total gastado (simulado)
    const totalGastado = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0) + 
                         subastas.reduce((total, subasta) => {
                             if (subasta.estado === 'finalizada' && subasta.pujas[0]?.usuario === "Tú") {
                                 return total + subasta.precioActual;
                             }
                             return total;
                         }, 0);
    
    document.getElementById('user-gastado').textContent = `$${totalGastado.toFixed(2)}`;
}

function cargarMisPujas() {
    const usuario = verificarUsuario();
    const container = document.getElementById('mis-pujas');
    if (!container) return;

    const pujasActivas = subastas.filter(subasta => 
        subasta.estado === 'activa' && 
        subasta.pujas.some(puja => puja.usuario === "Tú")
    );

    if (pujasActivas.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes pujas activas</p>';
        return;
    }

    container.innerHTML = pujasActivas.map(subasta => {
        const miPuja = subasta.pujas.find(puja => puja.usuario === "Tú");
        const esGanador = subasta.pujas[0]?.usuario === "Tú";
        
        return `
            <div class="puja-card ${esGanador ? 'puja-ganadora' : ''}">
                <div class="puja-imagen">
                    ${subasta.imagen ? `<img src="${subasta.imagen}" alt="${subasta.nombre}">` : subasta.emoji}
                </div>
                <div class="puja-info">
                    <h4>${subasta.nombre}</h4>
                    <p class="puja-desc">${subasta.descripcion}</p>
                    <div class="puja-detalles">
                        <div class="puja-monto">
                            <strong>Tu puja: $${miPuja.monto.toFixed(2)}</strong>
                        </div>
                        <div class="puja-estado ${esGanador ? 'estado-ganando' : 'estado-perdiendo'}">
                            ${esGanador ? '🏆 Actualmente ganando' : '💫 En competencia'}
                        </div>
                        <div class="puja-tiempo">
                            ⏰ ${formatearTiempo(subasta.tiempoRestante)}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function cargarMisCompras() {
    const container = document.getElementById('mis-compras');
    if (!container) return;

    // Simular historial de compras (en una app real esto vendría de una base de datos)
    const compras = JSON.parse(localStorage.getItem('comprasUsuario')) || [];

    if (compras.length === 0) {
        container.innerHTML = '<p class="no-data">No tienes compras realizadas</p>';
        return;
    }

    container.innerHTML = compras.map(compra => `
        <div class="compra-item">
            <div class="compra-info">
                <h4>${compra.producto}</h4>
                <p>Fecha: ${new Date(compra.fecha).toLocaleDateString()}</p>
                <p>Cantidad: ${compra.cantidad}</p>
            </div>
            <div class="compra-precio">
                <strong>$${compra.total.toFixed(2)}</strong>
                <span class="compra-estado ${compra.estado}">${compra.estado}</span>
            </div>
        </div>
    `).join('');
}

function cargarSubastasGanadas() {
    const container = document.getElementById('mis-ganadas');
    if (!container) return;

    const subastasGanadas = subastas.filter(subasta => 
        subasta.estado === 'finalizada' && 
        subasta.pujas.length > 0 && 
        subasta.pujas[0].usuario === "Tú"
    );

    if (subastasGanadas.length === 0) {
        container.innerHTML = '<p class="no-data">No has ganado ninguna subasta aún</p>';
        return;
    }

    container.innerHTML = subastasGanadas.map(subasta => `
        <div class="ganada-card">
            <div class="ganada-imagen">
                ${subasta.imagen ? `<img src="${subasta.imagen}" alt="${subasta.nombre}">` : subasta.emoji}
            </div>
            <div class="ganada-info">
                <h4>${subasta.nombre}</h4>
                <p class="ganada-desc">${subasta.descripcion}</p>
                <div class="ganada-detalles">
                    <div class="ganada-precio">
                        <strong>Precio final: $${subasta.precioActual.toFixed(2)}</strong>
                    </div>
                    <div class="ganada-fecha">
                        Ganada el: ${new Date().toLocaleDateString()}
                    </div>
                    <button class="btn btn-small btn-primary">Pagar ahora</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Inicializar panel de usuario
document.addEventListener('DOMContentLoaded', initUsuarioPanel);