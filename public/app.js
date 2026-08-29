// APP.JS - Estado global, router y orquestador principal
// ===== VERIFICACIÓN DE SESIÓN =====

document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    App.init();
});

async function verificarSesion() {
    try {
        const response = await fetch('/api/usuario');
        
        if (!response.ok) {
            mostrarNoAutenticado();
            return;
        }
        
        const usuario = await response.json();
        window.usuarioActual = usuario;
        
        if (usuario) {
            App.state.currentUser = {
                id: usuario.id,
                fullName: usuario.nombre || 'Usuario',
                username: usuario.email?.split('@')[0] || 'usuario',
                email: usuario.email,
                role: usuario.rol || 'cliente'
            };
            localStorage.setItem('ps_session', JSON.stringify(App.state.currentUser));
            
            // CARGAR USUARIOS DESDE LA API
            await cargarUsuariosDesdeAPI();
        }
        mostrarAutenticado(usuario);
        configurarUIporRol(usuario);
        
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        mostrarNoAutenticado();
    }
}

// ===== NUEVA FUNCIÓN: CARGAR USUARIOS DESDE LA API =====
async function cargarUsuariosDesdeAPI() {
    try {
        const response = await fetch('/api/admin/usuarios');
        if (response.ok) {
            const usuarios = await response.json();
            App.state.users = usuarios;
            // Si estamos en admin, re-renderizar
            if (App.state.page === 'admin') {
                App.render();
            }
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function mostrarNoAutenticado() {
    const statusDiv = document.getElementById('sessionStatus');
    if (statusDiv) {
        statusDiv.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="fas fa-exclamation-triangle"></i> 
                <a href="/login.html" class="alert-link">Iniciar Sesión</a> | 
                <a href="/register.html" class="alert-link">Registrarse</a>
            </div>
        `;
    }
}

function mostrarAutenticado(usuario) {
    const statusDiv = document.getElementById('sessionStatus');
    if (statusDiv) {
        const roleBadge = {
            'administrador': 'danger',
            'admin': 'danger',
            'vendedor': 'warning',
            'vendor': 'warning',
            'cliente': 'info',
            'client': 'info'
        };
        
        const nombreCompleto = usuario.nombre || usuario.email || 'Usuario';
        const rol = usuario.rol || 'cliente';
        
        statusDiv.innerHTML = `
            <div class="alert alert-success" role="alert">
                <i class="fas fa-user-circle"></i> 
                <strong>${nombreCompleto}</strong> 
                <span class="badge bg-${roleBadge[rol] || 'secondary'}">${rol}</span>
                <button onclick="cerrarSesionBackend()" class="btn btn-sm btn-danger float-end">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        `;
    }
}

function configurarUIporRol(usuario) {
    const adminOnly = document.querySelectorAll('.admin-only');
    const vendorOnly = document.querySelectorAll('.vendor-only');
    const clienteOnly = document.querySelectorAll('.client-only');
    
    adminOnly.forEach(el => el.style.display = 'none');
    vendorOnly.forEach(el => el.style.display = 'none');
    clienteOnly.forEach(el => el.style.display = 'none');
    
    const rol = usuario.rol || 'cliente';
    if (rol === 'administrador' || rol === 'admin') {
        adminOnly.forEach(el => el.style.display = 'block');
        vendorOnly.forEach(el => el.style.display = 'block');
        clienteOnly.forEach(el => el.style.display = 'block');
    } else if (rol === 'vendedor' || rol === 'vendor') {
        vendorOnly.forEach(el => el.style.display = 'block');
        clienteOnly.forEach(el => el.style.display = 'block');
    } else {
        clienteOnly.forEach(el => el.style.display = 'block');
    }
}

async function cerrarSesionBackend() {
    if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;
    
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        if (response.ok) {
            localStorage.removeItem('ps_session');
            window.location.reload();
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
    }
}

// ===== FIN DE VERIFICACIÓN DE SESIÓN =====

// ============================================================
// APP PRINCIPAL
// ============================================================

const App = {
    state: {
        page: 'store',
        currentUser: null,
        modal: null,
        cart: [],
        cartOpen: false,
        paymentMethod: localStorage.getItem('ps_payment_method') || 'cash',
        favorites: JSON.parse(localStorage.getItem('ps_favorites') || '{}'),
        orders: JSON.parse(localStorage.getItem('ps_orders') || '[]'),
        notifications: JSON.parse(localStorage.getItem('ps_notifications') || '[]'),
        stockByProduct: JSON.parse(localStorage.getItem('ps_stock_by_product') || 'null') || Object.fromEntries([
            ...GAMES.map((item, index) => [`game-${item.id}`, 25 + (index % 4) * 10]),
            ...CONSOLAS.map((item, index) => [`consola-${item.id}`, 8 + index * 3])
        ]),
        users: JSON.parse(localStorage.getItem('ps_users') || '[]'),
        searchQuery: '',
        activeGenre: 'todos',
        catalogFilters: { sort: 'featured', price: 'all', dealsOnly: false },
        activeBrand: 'todos',
        vendorProducts: JSON.parse(localStorage.getItem('ps_vendor_products') || 'null') || [...VENDOR_PRODUCTS],
        vendorSales: [...VENDOR_SALES],
        selectedProduct: null,
        reviews: JSON.parse(localStorage.getItem('ps_reviews') || 'null') || JSON.parse(JSON.stringify(REVIEWS_SEED)),
        sellerRequests: JSON.parse(localStorage.getItem('ps_seller_requests') || '[]'),
    },

    init() {
        localStorage.removeItem('ps_active_coupon');
        if (localStorage.getItem('ps_theme') === 'light') {
            document.body.classList.add('light');
        }
        const path = window.location.pathname.toLowerCase();
        
        if (path.includes('admin.html') || path === '/admin') {
            this.state.page = 'admin';
            console.log('🔍 FORZANDO PÁGINA ADMIN');
        } else if (path.includes('consolas')) {
            this.state.page = 'consolas';
        } else if (path.includes('vendor')) {
            this.state.page = 'vendor';
        } else if (path.includes('perfil')) {
            this.state.page = 'profile';
        } else {
            this.state.page = 'store';
        }

        const saved = localStorage.getItem('ps_session');
        if (saved) {
            try {
                const user = JSON.parse(saved);
                this.state.currentUser = user;
            } catch(e) {}
        }
        const savedCart = localStorage.getItem('ps_cart');
        if (savedCart) {
            try { this.state.cart = JSON.parse(savedCart); } catch(e) {}
        }
        this.render();
        this.bindGlobal();
    },

    setState(patch) {
        Object.assign(this.state, patch);
        if ('cart' in patch) {
            localStorage.setItem('ps_cart', JSON.stringify(this.state.cart));
        }
        if ('paymentMethod' in patch) {
            localStorage.setItem('ps_payment_method', this.state.paymentMethod);
        }
        if ('stockByProduct' in patch) localStorage.setItem('ps_stock_by_product', JSON.stringify(this.state.stockByProduct));
        ['favorites', 'orders', 'notifications'].forEach(key => {
            if (key in patch) localStorage.setItem(`ps_${key}`, JSON.stringify(this.state[key]));
        });
        this.render();
    },

    navigate(page) {
        const { currentUser } = this.state;
        const esAdmin = currentUser?.role === 'administrador' || currentUser?.role === 'admin';
        const esVendor = currentUser?.role === 'vendedor' || currentUser?.role === 'vendor';
        
        if (page === 'admin' && !esAdmin) {
            alert('Acceso denegado. No eres administrador.');
            return;
        }
        if (page === 'vendor' && !esVendor) {
            alert('Acceso denegado. No eres vendedor.');
            return;
        }
        const urls = {
            store:    'index.html',
            consolas: 'consolas.html',
            admin:    'admin.html',
            vendor:   'vendor.html',
            profile:  'perfil.html'
        };
        window.location.href = urls[page] || 'index.html';
    },

    login(identifier, password) {
        const users = this.state.users;
        const user = users.find(u =>
            u.email?.toLowerCase() === identifier.toLowerCase() ||
            u.username?.toLowerCase() === identifier.toLowerCase()
        );
        if (!user) return 'Usuario o correo no encontrado.';
        if (user.password !== password) return 'Contraseña incorrecta.';
        if (user.banned) return 'Esta cuenta ha sido suspendida.';
        localStorage.setItem('ps_session', JSON.stringify(user));
        showToast('🎮 ¡Bienvenido/a, ' + (user.fullName ? user.fullName.split(' ')[0] : user.username) + '!');
        
        let url = 'index.html';
        const rol = user.role || '';
        if (rol === 'administrador' || rol === 'admin') url = 'admin.html';
        else if (rol === 'vendedor' || rol === 'vendor') url = 'vendor.html';
        
        setTimeout(() => { window.location.href = url; }, 700);
        return null;
    },

    logout() {
        if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) return;
        
        fetch('/api/logout', { method: 'POST' })
            .then(() => {
                localStorage.removeItem('ps_session');
                localStorage.removeItem('ps_cart');
                localStorage.removeItem('pixelstore_user');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('usuario');
                localStorage.removeItem('ps_current_user');
                window.location.reload();
            })
            .catch(err => {
                console.error('Error al cerrar sesión:', err);
                localStorage.removeItem('ps_session');
                localStorage.removeItem('ps_cart');
                localStorage.removeItem('pixelstore_user');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('usuario');
                window.location.reload();
            });
    },

    addToCart(item) {
        const existing = this.state.cart.find(c => c.id === item.id && c.type === item.type);
        const stock = this.getStock(item.id, item.type);
        if (existing && existing.qty >= stock) {
            showToast('No hay más unidades disponibles de este producto.');
            return;
        }
        let cart;
        if (existing) {
            cart = this.state.cart.map(c =>
                c.id === item.id && c.type === item.type ? { ...c, qty: c.qty + 1 } : c
            );
        } else {
            cart = [...this.state.cart, { ...item, stock, qty: 1 }];
        }
        this.setState({ cart });
        showToast('🛒 Agregado: ' + (item.title || item.name));
    },

    removeFromCart(id, type) {
        this.setState({ cart: this.state.cart.filter(c => !(c.id === id && c.type === type)) });
    },

    changeCartQuantity(id, type, change) {
        const item = this.state.cart.find(c => c.id === id && c.type === type);
        if (!item) return;
        const qty = Math.max(0, Math.min(item.stock ?? 99, item.qty + change));
        if (qty === 0) return this.removeFromCart(id, type);
        this.setState({ cart: this.state.cart.map(c => c.id === id && c.type === type ? { ...c, qty } : c) });
    },

    getStock(id, type) {
        return this.state.stockByProduct[`${type}-${id}`] ?? 0;
    },

    isFavorite(id, type) {
        const userId = this.state.currentUser?.id;
        return !!userId && (this.state.favorites[userId] || []).includes(`${type}-${id}`);
    },

    toggleFavorite(id, type) {
        if (!this.state.currentUser) { this.setState({ modal: 'login' }); return; }
        const userId = this.state.currentUser.id;
        const key = `${type}-${id}`;
        const current = this.state.favorites[userId] || [];
        const list = current.includes(key) ? current.filter(item => item !== key) : [...current, key];
        this.setState({ favorites: { ...this.state.favorites, [userId]: list } });
        showToast(current.includes(key) ? 'Favorito eliminado' : '❤ Guardado en favoritos');
    },

    createOrder() {
        if (!this.state.currentUser) { this.setState({ modal: 'login', cartOpen: false }); return; }
        if (!this.state.cart.length) return;
        const subtotal = this.cartSubtotal();
        const total = subtotal;
        if (this.state.cart.some(item => item.qty > this.getStock(item.id, item.type))) {
            showToast('El stock cambió. Revisa las cantidades de tu carrito.');
            return;
        }
        const now = new Date().toISOString();
        const order = {
            id: `PS-${Date.now().toString().slice(-7)}`,
            buyerId: this.state.currentUser.id,
            items: this.state.cart.map(item => ({ productId: `${item.type}-${item.id}`, title: item.title || item.name, image: item.image, qty: item.qty, unitPrice: item.price, vendorId: item.vendorId || 2 })),
            pricing: { subtotal, discount: 0, total },
            payment: { method: this.state.paymentMethod, status: 'pending' },
            status: 'pending_payment',
            createdAt: now,
            updatedAt: now
        };
        const notification = { id: Date.now(), userId: this.state.currentUser.id, text: `Pedido ${order.id} creado. Estado: pendiente de pago.`, read: false, createdAt: now };
        const stockByProduct = { ...this.state.stockByProduct };
        this.state.cart.forEach(item => { const key = `${item.type}-${item.id}`; stockByProduct[key] = Math.max(0, (stockByProduct[key] ?? 0) - item.qty); });
        this.setState({ orders: [order, ...this.state.orders], notifications: [notification, ...this.state.notifications], stockByProduct, cart: [], cartOpen: false });
        showToast(`✅ Pedido ${order.id} creado.`);
    },

    updateOrderStatus(id, status) {
        const order = this.state.orders.find(item => item.id === id);
        if (!order) return;
        const labels = { pending_payment: 'pendiente de pago', paid: 'pagado', processing: 'en preparación', ready: 'listo', delivered: 'entregado', cancelled: 'cancelado' };
        const updatedAt = new Date().toISOString();
        const orders = this.state.orders.map(item => item.id === id ? { ...item, status, updatedAt } : item);
        const notification = { id: Date.now(), userId: order.buyerId, text: `Tu pedido ${id} ahora está ${labels[status] || status}.`, read: false, createdAt: updatedAt };
        this.setState({ orders, notifications: [notification, ...this.state.notifications] });
        showToast('Estado del pedido actualizado.');
    },

    cartSubtotal() {
        return this.state.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    },

    cartTotal() { return this.cartSubtotal(); },

    openProduct(id, type) {
        this.setState({ modal: 'product', selectedProduct: { id, type } });
    },

    getProductById(id, type) {
        return type === 'game' ? GAMES.find(g => g.id === id) : CONSOLAS.find(c => c.id === id);
    },

    getReviews(id, type) {
        return this.state.reviews[`${type}-${id}`] || [];
    },

    addReview(id, type, rating, comment) {
        const key = `${type}-${id}`;
        const list = this.state.reviews[key] || [];
        const newReview = {
            user: this.state.currentUser?.fullName || this.state.currentUser?.username || 'Anónimo',
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            status: this.state.currentUser?.role === 'admin' ? 'approved' : 'pending'
        };
        const updated = { ...this.state.reviews, [key]: [...list, newReview] };
        localStorage.setItem('ps_reviews', JSON.stringify(updated));
        this.setState({ reviews: updated });
        showToast('✅ ¡Gracias por tu reseña!');
    },

    getSellerRequestForUser(userId) {
        return this.state.sellerRequests.find(r => r.userId === userId && r.status === 'pendiente');
    },

    submitSellerRequest(data) {
        const user = this.state.currentUser;
        if (!user || user.role !== 'client') return 'Solo los clientes pueden solicitar ser vendedores.';
        if (this.getSellerRequestForUser(user.id)) return 'Ya tienes una solicitud pendiente.';
        const request = {
            id: Date.now(),
            userId: user.id,
            applicantName: user.fullName || user.username,
            email: user.email,
            phone: data.phone,
            saleType: data.saleType,
            product: {
                title: data.productTitle,
                description: data.productDescription,
                price: Number(data.productPrice),
                stock: Number(data.productStock),
                image: data.productImage
            },
            acceptedTerms: true,
            status: 'pendiente',
            createdAt: new Date().toISOString()
        };
        const sellerRequests = [...this.state.sellerRequests, request];
        localStorage.setItem('ps_seller_requests', JSON.stringify(sellerRequests));
        this.setState({ sellerRequests, modal: null });
        showToast('📨 Solicitud enviada al administrador.');
    },

    approveSellerRequest(id) {
        if (this.state.currentUser?.role !== 'admin' && this.state.currentUser?.role !== 'administrador') return;
        const request = this.state.sellerRequests.find(r => r.id === id && r.status === 'pendiente');
        if (!request) return;
        const users = this.state.users.map(u =>
            u.id === request.userId ? { ...u, role: 'vendor' } : u
        );
        const approvedUser = users.find(u => u.id === request.userId);
        const sellerRequests = this.state.sellerRequests.map(r =>
            r.id === id ? { ...r, status: 'aprobada', reviewedAt: new Date().toISOString() } : r
        );
        const nextId = this.state.vendorProducts.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
        const vendorProducts = [
            ...this.state.vendorProducts,
            {
                id: nextId,
                title: request.product.title,
                price: request.product.price,
                stock: request.product.stock,
                image: request.product.image,
                description: request.product.description,
                category: request.saleType,
                vendorId: request.userId
            }
        ];
        const notifications = [
            {
                id: Date.now(),
                userId: request.userId,
                text: '✅ Tu solicitud para ser vendedor fue aprobada. Ya puedes acceder a Mi Panel.',
                read: false,
                createdAt: new Date().toISOString()
            },
            ...this.state.notifications
        ];
        localStorage.setItem('ps_seller_requests', JSON.stringify(sellerRequests));
        localStorage.setItem('ps_users', JSON.stringify(users));
        localStorage.setItem('ps_vendor_products', JSON.stringify(vendorProducts));
        const patch = { sellerRequests, users, vendorProducts, notifications };
        if (approvedUser) {
            localStorage.setItem('ps_session', JSON.stringify(approvedUser));
        }
        this.setState(patch);
        showToast('✅ Solicitud aprobada. El cliente ahora es vendedor.');
    },

    rejectSellerRequest(id) {
        if (this.state.currentUser?.role !== 'admin' && this.state.currentUser?.role !== 'administrador') return;
        const reason = prompt('Motivo del rechazo (opcional):', '');
        if (reason === null) return;
        const request = this.state.sellerRequests.find(r => r.id === id && r.status === 'pendiente');
        if (!request) return;
        const sellerRequests = this.state.sellerRequests.map(r =>
            r.id === id
                ? { ...r, status: 'rechazada', rejectionReason: reason.trim(), reviewedAt: new Date().toISOString() }
                : r
        );
        const notifications = [
            {
                id: Date.now(),
                userId: request.userId,
                text: reason.trim()
                    ? `❌ Tu solicitud para ser vendedor fue rechazada: ${reason.trim()}`
                    : '❌ Tu solicitud para ser vendedor fue rechazada.',
                read: false,
                createdAt: new Date().toISOString()
            },
            ...this.state.notifications
        ];
        localStorage.setItem('ps_seller_requests', JSON.stringify(sellerRequests));
        this.setState({ sellerRequests, notifications });
        showToast('Solicitud rechazada.');
    },

    deleteProduct(id) {
        const product = this.state.vendorProducts.find(p => p.id === id);
        if (!product) return;
        if (!confirm(`¿Eliminar "${product.title}" del catálogo?`)) return;
        const updated = this.state.vendorProducts.filter(p => p.id !== id);
        localStorage.setItem('ps_vendor_products', JSON.stringify(updated));
        this.setState({ vendorProducts: updated });
        showToast('🗑️ Producto eliminado');
    },

    editProductPrice(id) {
        const product = this.state.vendorProducts.find(p => p.id === id);
        if (!product) return;
        const priceStr = prompt(`Nuevo precio para "${product.title}" ($):`, product.price);
        if (priceStr === null) return;
        const price = parseFloat(priceStr);
        if (isNaN(price) || price <= 0) { alert('Precio inválido.'); return; }
        const stockStr = prompt(`Stock disponible para "${product.title}":`, product.stock);
        if (stockStr === null) return;
        const stock = parseInt(stockStr, 10);
        if (!Number.isInteger(stock) || stock < 0) { alert('Stock inválido.'); return; }
        const updated = this.state.vendorProducts.map(p => p.id === id ? { ...p, price, stock } : p);
        localStorage.setItem('ps_vendor_products', JSON.stringify(updated));
        this.setState({ vendorProducts: updated });
        showToast('✅ Precio y stock actualizados');
    },

    toggleUserBan(id) {
        if (id === this.state.currentUser?.id) return;
        const target = this.state.users.find(u => u.id === id);
        if (!target) return;
        const updated = this.state.users.map(u => u.id === id ? { ...u, banned: !u.banned } : u);
        localStorage.setItem('ps_users', JSON.stringify(updated));
        this.setState({ users: updated });
        showToast(target.banned ? '✅ Usuario reactivado' : '🚫 Usuario baneado');
    },

    // ===== RENDER CORREGIDO =====
    render() {
        const { page, currentUser, modal, cart, cartOpen, paymentMethod, selectedProduct, favorites, orders, notifications } = this.state;

        const esAdmin = currentUser?.role === 'administrador' || currentUser?.role === 'admin';
        const esVendor = currentUser?.role === 'vendedor' || currentUser?.role === 'vendor';

        const path = window.location.pathname.toLowerCase();
        const mostrarAdmin = (page === 'admin' || path.includes('admin.html')) && esAdmin;

        document.getElementById('app').innerHTML = `
            ${renderHeader(this.state)}
            <main style="flex:1">
                ${page === 'store' && !path.includes('admin.html') ? renderStore(this.state) : ''}
                ${page === 'consolas' ? renderConsolas(this.state) : ''}
                ${mostrarAdmin ? renderAdmin(this.state) : ''}
                ${page === 'vendor' && esVendor ? renderVendor(this.state) : ''}
                ${page === 'profile' && currentUser ? renderProfile({ currentUser, favorites, orders, notifications, sellerRequests: this.state.sellerRequests }) : ''}
                ${path.includes('admin.html') && !esAdmin ? `<div style="padding:80px 24px;text-align:center;color:var(--muted)"><p>⚠️ Acceso restringido. No eres administrador.</p></div>` : ''}
            </main>
            ${renderFooter()}
            ${modal === 'login' ? renderLoginModal() : ''}
            ${modal === 'register' ? renderRegisterModal() : ''}
            ${modal === 'seller-request' ? renderSellerRequestModal() : ''}
            ${modal === 'product' && selectedProduct ? renderProductModal(
                this.getProductById(selectedProduct.id, selectedProduct.type),
                selectedProduct.type,
                this.getReviews(selectedProduct.id, selectedProduct.type),
                currentUser,
                favorites
            ) : ''}
            ${renderCart(cart, cartOpen, paymentMethod)}
        `;

        this.bindEvents();
    },

    bindEvents() {
        document.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => this.navigate(btn.dataset.nav));
        });
        document.getElementById('btn-login')?.addEventListener('click', () => this.setState({ modal: 'login' }));
        document.getElementById('btn-register')?.addEventListener('click', () => this.setState({ modal: 'register' }));
        document.getElementById('btn-logout')?.addEventListener('click', () => this.logout());
        document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
            document.body.classList.toggle('light');
            localStorage.setItem('ps_theme', document.body.classList.contains('light') ? 'light' : 'dark');
            this.render();
        });
        document.getElementById('btn-cart')?.addEventListener('click', () => this.setState({ cartOpen: true }));
        document.getElementById('cart-close')?.addEventListener('click', () => this.setState({ cartOpen: false }));
        document.getElementById('cart-overlay')?.addEventListener('click', () => this.setState({ cartOpen: false }));
        document.querySelectorAll('[data-remove-cart]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.removeFromCart(+btn.dataset.removeCart, btn.dataset.type);
            });
        });
        document.querySelectorAll('[data-cart-quantity]').forEach(btn => {
            btn.addEventListener('click', () => this.changeCartQuantity(+btn.dataset.cartQuantity, btn.dataset.type, +btn.dataset.change));
        });
        document.querySelectorAll('[data-payment-method]').forEach(btn => {
            btn.addEventListener('click', () => this.setState({ paymentMethod: btn.dataset.paymentMethod }));
        });
        document.getElementById('search-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const q = document.getElementById('search-input')?.value?.trim();
            if (q) this.setState({ page: 'store', activeGenre: 'todos', searchQuery: q });
        });
        document.getElementById('search-input')?.addEventListener('input', e => {
            this.state.searchQuery = e.target.value;
            if (!e.target.value) this.setState({ searchQuery: '' });
        });
        document.querySelectorAll('[data-genre]').forEach(btn => {
            btn.addEventListener('click', () => this.setState({ activeGenre: btn.dataset.genre, searchQuery: '' }));
        });
        document.querySelectorAll('[data-brand]').forEach(btn => {
            btn.addEventListener('click', () => this.setState({ activeBrand: btn.dataset.brand }));
        });
        document.querySelectorAll('[data-add-cart]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = +btn.dataset.addCart;
                const type = btn.dataset.type || 'game';
                const item = type === 'game' ? GAMES.find(g => g.id === id) : CONSOLAS.find(c => c.id === id);
                if (item) this.addToCart({ ...item, title: item.title || item.name, type, stock: this.getStock(id, type) });
            });
        });
        document.getElementById('catalog-sort')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, sort: event.target.value } }));
        document.getElementById('catalog-price')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, price: event.target.value } }));
        document.getElementById('catalog-deals')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, dealsOnly: event.target.checked } }));
        document.querySelectorAll('[data-favorite]').forEach(btn => {
            btn.addEventListener('click', e => { e.stopPropagation(); this.toggleFavorite(+btn.dataset.favorite, btn.dataset.type); });
        });
        document.querySelectorAll('[data-view-product]').forEach(card => {
            card.addEventListener('click', e => {
                if (e.target.closest('[data-add-cart]')) return;
                const [type, idStr] = card.dataset.viewProduct.split('-');
                this.openProduct(+idStr, type);
            });
        });
        document.querySelectorAll('[data-star-select]').forEach(star => {
            star.addEventListener('click', () => {
                const val = +star.dataset.starSelect;
                const input = document.getElementById('review-rating-input');
                if (input) input.value = val;
                document.querySelectorAll('[data-star-select]').forEach(s => {
                    const filled = +s.dataset.starSelect <= val;
                    s.textContent = filled ? '★' : '☆';
                    s.style.color = filled ? '#f5a623' : 'var(--muted)';
                });
            });
        });
        document.getElementById('review-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const rating = +document.getElementById('review-rating-input').value;
            const comment = document.getElementById('review-comment').value.trim();
            const errEl = document.getElementById('review-error');
            if (!rating) { errEl.textContent = 'Selecciona una calificación.'; errEl.style.display = 'block'; return; }
            if (!comment) { errEl.textContent = 'Escribe un comentario.'; errEl.style.display = 'block'; return; }
            const { id, type } = this.state.selectedProduct;
            this.addReview(id, type, rating, comment);
        });
        document.getElementById('btn-login-from-review')?.addEventListener('click', () => this.setState({ modal: 'login' }));
        document.querySelectorAll('#modal-backdrop, #login-modal').forEach(backdrop => {
            backdrop.addEventListener('click', e => {
                if (e.target === backdrop) this.setState({ modal: null });
            });
        });
        document.querySelectorAll('#btn-close-modal, #btn-close-login, .modal-close, .btn-close, [data-close]').forEach(btn => {
            btn.addEventListener('click', () => this.setState({ modal: null }));
        });
        document.querySelectorAll('#btn-switch-register, #link-open-register').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                this.setState({ modal: 'register' });
            });
        });
        document.querySelectorAll('#btn-switch-login, #link-open-login').forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault();
                this.setState({ modal: 'login' });
            });
        });
        const loginForm = document.getElementById('login-form') || document.getElementById('form-login');
        if (loginForm) {
            loginForm.addEventListener('submit', e => {
                e.preventDefault();
                const userInput = (document.getElementById('login-user') || document.getElementById('login-username'))?.value.trim();
                const passInput = (document.getElementById('login-pass') || document.getElementById('login-password'))?.value;
                const errEl = document.getElementById('login-error');
                if (errEl) errEl.style.display = 'none';
                if (!userInput || !passInput) {
                    if (errEl) { errEl.textContent = 'Por favor ingresa usuario/correo y contraseña.'; errEl.style.display = 'block'; }
                    return;
                }
                const err = this.login(userInput, passInput);
                if (err && errEl) {
                    errEl.textContent = err;
                    errEl.style.display = 'block';
                }
            });
        }
        const registerForm = document.getElementById('register-form');
        if (registerForm && typeof bindRegisterForm === 'function') {
            bindRegisterForm(registerForm, this);
        }
        document.querySelectorAll('[data-request-vendor]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.state.currentUser?.role !== 'client') return;
                if (this.getSellerRequestForUser(this.state.currentUser.id)) {
                    if (typeof showToast === 'function') showToast('⏳ Ya tienes una solicitud pendiente.');
                    return;
                }
                this.setState({ modal: 'seller-request' });
            });
        });
        document.getElementById('seller-request-form')?.addEventListener('submit', e => {
            e.preventDefault();
            const terms = document.getElementById('seller-terms');
            const imageInput = document.getElementById('seller-product-image');
            const imageFile = imageInput?.files?.[0];
            if (!terms?.checked) {
                if (typeof showToast === 'function') showToast('⚠️ Debes aceptar los derechos y condiciones.');
                return;
            }
            if (!imageFile) {
                if (typeof showToast === 'function') showToast('⚠️ Debes subir una foto del producto.');
                return;
            }
            if (!imageFile.type.startsWith('image/')) {
                if (typeof showToast === 'function') showToast('⚠️ El archivo debe ser una imagen.');
                return;
            }
            if (imageFile.size > 5 * 1024 * 1024) {
                if (typeof showToast === 'function') showToast('⚠️ La imagen no puede superar los 5 MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                this.submitSellerRequest({
                    phone: document.getElementById('seller-phone').value.trim(),
                    saleType: document.getElementById('seller-sale-type').value,
                    productTitle: document.getElementById('seller-product-title').value.trim(),
                    productDescription: document.getElementById('seller-product-description').value.trim(),
                    productPrice: document.getElementById('seller-product-price').value,
                    productStock: document.getElementById('seller-product-stock').value,
                    productImage: reader.result
                });
            };
            reader.readAsDataURL(imageFile);
        });
        document.querySelectorAll('[data-approve-seller]').forEach(btn => {
            btn.addEventListener('click', () => this.approveSellerRequest(+btn.dataset.approveSeller));
        });
        document.querySelectorAll('[data-reject-seller]').forEach(btn => {
            btn.addEventListener('click', () => this.rejectSellerRequest(+btn.dataset.rejectSeller));
        });
        document.getElementById('btn-add-product')?.addEventListener('click', () => {
            if (typeof showAddProductModal === 'function') showAddProductModal(this);
        });
        document.querySelectorAll('[data-vendor-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-vendor-tab]').forEach(b => b.classList.remove('active-tab'));
                btn.classList.add('active-tab');
                document.querySelectorAll('[data-vendor-panel]').forEach(p => p.style.display = 'none');
                document.querySelector(`[data-vendor-panel="${btn.dataset.vendorTab}"]`).style.display = 'block';
            });
        });
        document.querySelectorAll('[data-edit-product]').forEach(btn => {
            btn.addEventListener('click', () => this.editProductPrice(+btn.dataset.editProduct));
        });
        document.querySelectorAll('[data-delete-product]').forEach(btn => {
            btn.addEventListener('click', () => this.deleteProduct(+btn.dataset.deleteProduct));
        });
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active-tab'));
                btn.classList.add('active-tab');
                document.querySelectorAll('[data-admin-panel]').forEach(p => p.style.display = 'none');
                document.querySelector(`[data-admin-panel="${btn.dataset.adminTab}"]`).style.display = 'block';
            });
        });
        document.querySelectorAll('[data-toggle-ban]').forEach(btn => {
            btn.addEventListener('click', () => this.toggleUserBan(+btn.dataset.toggleBan));
        });
        document.querySelectorAll('[data-change-role]').forEach(sel => {
            sel.addEventListener('change', () => {
                const uid = +sel.dataset.changeRole;
                const updated = this.state.users.map(u => u.id === uid ? { ...u, role: sel.value } : u);
                localStorage.setItem('ps_users', JSON.stringify(updated));
                this.setState({ users: updated });
                if (typeof showToast === 'function') showToast('✅ Rol actualizado');
            });
        });
        document.getElementById('btn-explorar')?.addEventListener('click', () => {
            document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        document.getElementById('btn-consolas')?.addEventListener('click', () => this.navigate('consolas'));
        const EYE_OPEN = `<svg class="eye-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" width="22" height="14" style="display:block;"><path d="M18 60 C38 29 66 14 100 14 C134 14 162 29 182 60 C162 91 134 106 100 106 C66 106 38 91 18 60 Z" fill="#9aa1a6"/><path d="M30 60 C48 37 71 26 100 26 C129 26 152 37 170 60 C152 83 129 94 100 94 C71 94 48 83 30 60 Z" fill="#1a1b1f"/><circle cx="100" cy="60" r="30" fill="#9aa1a6"/><circle cx="100" cy="60" r="16" fill="#1a1b1f"/></svg>`;
        const EYE_CLOSED = `<svg class="eye-icon" viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" width="22" height="16" style="display:block;"><path d="M 35 70 C 52 48, 72 35, 100 35 C 128 35, 148 48, 165 70 C 148 92, 128 105, 100 105 C 72 105, 52 92, 35 70 Z" fill="#1a1b1f" stroke="#9aa1a6" stroke-width="6" stroke-linejoin="round"/><circle cx="100" cy="70" r="19" fill="#1e73d8" stroke="#9aa1a6" stroke-width="5"/><circle cx="100" cy="70" r="9" fill="#9aa1a6"/><line x1="35" y1="35" x2="165" y2="105" stroke="#9aa1a6" stroke-width="7" stroke-linecap="round"/></svg>`;
        document.querySelectorAll('[data-toggle-pass]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = document.getElementById(btn.dataset.togglePass);
                if (!target) return;
                target.type = target.type === 'password' ? 'text' : 'password';
                btn.innerHTML = target.type === 'password' ? EYE_OPEN : EYE_CLOSED;
            });
        });
        document.getElementById('reg-password')?.addEventListener('input', e => {
            if (typeof updatePasswordStrength === 'function') {
                updatePasswordStrength(e.target.value);
            }
        });
        document.getElementById('reg-confirm')?.addEventListener('input', e => {
            const pass = document.getElementById('reg-password')?.value;
            const hint = document.getElementById('confirm-hint');
            const input = e.target;
            if (!hint) return;
            if (!input.value) { hint.textContent = ''; input.style.borderColor = ''; return; }
            if (input.value === pass) {
                hint.style.color = '#a4d96f'; hint.textContent = 'Las contraseñas coinciden ✓';
                input.style.borderColor = '#a4d96f';
            } else {
                hint.style.color = '#ff8080'; hint.textContent = 'Las contraseñas no coinciden';
                input.style.borderColor = '#ff8080';
            }
        });
        document.getElementById('btn-checkout')?.addEventListener('click', () => {
            this.createOrder();
        });
        document.querySelectorAll('[data-order-status]').forEach(sel => {
            sel.addEventListener('change', () => this.updateOrderStatus(sel.dataset.orderStatus, sel.value));
        });
    },

    bindGlobal() {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') this.setState({ modal: null, cartOpen: false });
        });
    }
};

// ============================================================
// HELPERS
// ============================================================
function showToast(msg) {
    const old = document.getElementById('toast-el');
    if (old) old.remove();
    const t = document.createElement('div');
    t.id = 'toast-el';
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => {
        t.classList.add('hide');
        setTimeout(() => t.remove(), 350);
    }, 2800);
}

function updatePasswordStrength(val) {
    const segs = document.querySelectorAll('.strength-segment');
    const lbl = document.getElementById('strength-label');
    if (!segs.length) return;
    let score = val.length >= 10 && /[A-Z]/.test(val) && /[0-9]/.test(val) ? 4
        : val.length >= 8 ? 3
        : val.length >= 6 ? 2
        : val.length > 0 ? 1 : 0;
    const colors = { 4: 'var(--accent2)', 3: '#a4d96f', 2: '#f5a623', 1: 'var(--accent)', 0: 'rgba(255,255,255,0.08)' };
    const labels = { 4: 'Fuerte', 3: 'Buena', 2: 'Débil', 1: 'Muy débil', 0: '' };
    segs.forEach((s, i) => {
        s.style.background = i < score ? colors[score] : 'rgba(255,255,255,0.08)';
    });
    if (lbl) lbl.textContent = labels[score];
}

function bindLoginForm(form, app) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const id = (document.getElementById('login-user') || document.getElementById('login-username')).value.trim();
        const pw = (document.getElementById('login-pass') || document.getElementById('login-password')).value;
        const errEl = document.getElementById('login-error');
        if (!id || !pw) { errEl.textContent = 'Completa usuario y contraseña.'; errEl.style.display = 'block'; return; }
        const err = app.login(id, pw);
        if (err) { errEl.textContent = err; errEl.style.display = 'block'; }
    });
}

function bindRegisterForm(form, app) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const errEl = document.getElementById('reg-error');
        const name = document.getElementById('reg-fullname').value.trim();
        const phone = document.getElementById('reg-phone').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        errEl.style.display = 'none';
        if (!name) { errEl.textContent = 'El nombre completo es obligatorio.'; errEl.style.display = 'block'; return; }
        if (!phone) { errEl.textContent = 'El teléfono es obligatorio.'; errEl.style.display = 'block'; return; }
        if (!email || !email.includes('@')) { errEl.textContent = 'Ingresa un correo válido.'; errEl.style.display = 'block'; return; }
        if (pass.length < 6) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; errEl.style.display = 'block'; return; }
        if (pass !== confirm) { errEl.textContent = 'Las contraseñas no coinciden.'; errEl.style.display = 'block'; return; }
        const err = app.register({ fullName: name, phone, email, password: pass });
        if (err) { errEl.textContent = err; errEl.style.display = 'block'; }
    });
}

function showAddProductModal(app) {
    const title = prompt('Nombre del producto:');
    if (!title || !title.trim()) return;
    const priceStr = prompt('Precio ($):');
    const price = parseFloat(priceStr);
    if (isNaN(price) || price <= 0) { alert('Precio inválido.'); return; }
    const newProd = { id: Date.now(), title: title.trim(), price, stock: 0, image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg' };
    const updated = [...app.state.vendorProducts, newProd];
    localStorage.setItem('ps_vendor_products', JSON.stringify(updated));
    app.setState({ vendorProducts: updated });
    showToast('✅ Producto agregado');
}

// ============================================================
// INICIO
// ============================================================

document.addEventListener('DOMContentLoaded', () => App.init());

window.App = App;
window.showToast = showToast;
window.cerrarSesionBackend = cerrarSesionBackend;