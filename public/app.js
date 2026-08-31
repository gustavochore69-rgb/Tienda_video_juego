// APP.JS - Estado global, router y orquestador principal

const App = {
  // Estado global
  state: {
    page: 'store',
    currentUser: null,
    modal: null, // 'login' | 'register' | 'product' | null
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
    users: JSON.parse(localStorage.getItem('ps_users') || 'null') || [...USERS],
    searchQuery: '',
    activeGenre: 'todos',
    catalogFilters: { sort: 'featured', price: 'all', dealsOnly: false },
    activeBrand: 'todos',
    vendorProducts: JSON.parse(localStorage.getItem('ps_vendor_products') || 'null') || [...VENDOR_PRODUCTS],
    vendorSales: [...VENDOR_SALES],
    selectedProduct: null, // { id, type }
    reviews: JSON.parse(localStorage.getItem('ps_reviews') || 'null') || JSON.parse(JSON.stringify(REVIEWS_SEED)),
    sellerRequests: JSON.parse(localStorage.getItem('ps_seller_requests') || '[]'),
  },

  async init() {
    // Limpieza de datos de una versión anterior que incluía cupones.
    localStorage.removeItem('ps_active_coupon');
    // Restaurar tema
    if (localStorage.getItem('ps_theme') === 'light') {
      document.body.classList.add('light');
    }
    // Detectar página actual desde la URL
    const path = window.location.pathname.toLowerCase();
    if (path.includes('consolas')) this.state.page = 'consolas';
    else if (path.includes('admin')) this.state.page = 'admin';
    else if (path.includes('vendor')) this.state.page = 'vendor';
    else if (path.includes('perfil')) this.state.page = 'profile';
    else this.state.page = 'store';

    // Restaurar sesión
    const saved = localStorage.getItem('ps_session');
    if (saved) {
      try { this.state.currentUser = JSON.parse(saved); } catch(e) {}
    }
    // Restaurar carrito
    const savedCart = localStorage.getItem('ps_cart');
    if (savedCart) {
      try { this.state.cart = JSON.parse(savedCart); } catch(e) {}
    }
    await this.loadProducts();
    this.render();
    this.bindGlobal();
  },

  setState(patch) {
    Object.assign(this.state, patch);
    // Persistir carrito en localStorage
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

  // Navegación multi-página
  navigate(page) {
    const { currentUser } = this.state;
    if (page === 'admin' && currentUser?.role !== 'admin') return;
    if (page === 'vendor' && currentUser?.role !== 'vendor') return;
    const urls = {
      store:    'index.html',
      consolas: 'consolas.html',
      admin:    'admin.html',
      vendor:   'vendor.html',
      profile:  'perfil.html'
    };
    window.location.href = urls[page] || 'index.html';
  },

  // Auth
  login(identifier, password) {
    const users = this.state.users;
    const user = users.find(u =>
      u.email.toLowerCase() === identifier.toLowerCase() ||
      u.username.toLowerCase() === identifier.toLowerCase()
    );
    if (!user) return 'Usuario o correo no encontrado.';
    if (user.password !== password) return 'Contraseña incorrecta.';
    if (user.banned) return 'Esta cuenta ha sido suspendida. Contacta a un administrador.';
    localStorage.setItem('ps_session', JSON.stringify(user));
    showToast('🎮 ' + '¡Bienvenido/a, ' + user.fullName.split(' ')[0] + '!');
    const urls = { admin: 'admin.html', vendor: 'vendor.html', client: 'index.html' };
    setTimeout(() => { window.location.href = urls[user.role] || 'index.html'; }, 700);
    return null;
  },

  register(data) {
    const users = this.state.users;
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return 'Este correo ya está registrado.';
    }
    const newUser = {
      id: users.length + 1,
      fullName: data.fullName,
      username: data.email.split('@')[0],
      email: data.email,
      phone: data.phone,
      role: 'client',
      password: data.password,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...users, newUser];
    localStorage.setItem('ps_users', JSON.stringify(updated));
    localStorage.setItem('ps_session', JSON.stringify(newUser));
    this.setState({ users: updated, currentUser: newUser, modal: null });
    showToast('✅ ¡Cuenta creada exitosamente!');
    return null;
  },

  logout() {
    localStorage.removeItem('ps_session');
    localStorage.removeItem('ps_cart');
    window.location.href = 'index.html';
  },

  // Carrito
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
    showToast('🛒 Agregado: ' + item.title);
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

  // Detalle de producto y reseñas
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
      user: this.state.currentUser.fullName,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      status: this.state.currentUser.role === 'admin' ? 'approved' : 'pending'
    };
    const updated = { ...this.state.reviews, [key]: [...list, newReview] };
    localStorage.setItem('ps_reviews', JSON.stringify(updated));
    this.setState({ reviews: updated });
    showToast('✅ ¡Gracias por tu reseña!');
  },

  // Solicitudes de cliente para convertirse en vendedor
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
      applicantName: user.fullName,
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
    if (this.state.currentUser?.role !== 'admin') return;
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
    if (this.state.currentUser?.role !== 'admin') return;
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

  // Gestión de productos (vendedor y administrador)
  deleteProduct(id) {
    const product = this.state.vendorProducts.find(p => p.id === id);
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.title}" del catálogo? Esta acción no se puede deshacer.`)) return;
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

  async loadProducts() {
    try {
      const response = await fetch('/api/productos');
      if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
      const products = await response.json();
      if (Array.isArray(products)) this.state.vendorProducts = products;
    } catch (error) {
      console.warn('Catálogo en modo demostración:', error.message);
    }
  },

  async addProduct(data) {
    if (this.state.currentUser?.role !== 'vendor') {
      return 'No tienes permiso para agregar productos.';
    }
    const title = data.title.trim();
    const price = Number(data.price);
    const stock = Number(data.stock);
    const cost = Number(data.cost);
    if (!title || !data.platform || !data.category || !Number.isFinite(cost) || cost < 0 || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      return 'Revisa el nombre, plataforma, categoría, costo, precio y stock.';
    }
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, title, price, stock, cost })
      });
      const payload = await response.json();
      if (!response.ok) return payload.error || 'No se pudo guardar el producto.';
      this.setState({ vendorProducts: [...this.state.vendorProducts, payload], modal: null });
      showToast('✅ Producto guardado en la base de datos.');
      return null;
    } catch (_error) {
      return 'No hay conexión con el servidor. Inicia Node y MySQL para guardar.';
    }
  },

  // Gestión de usuarios (administrador)
  toggleUserBan(id) {
    if (id === this.state.currentUser?.id) return;
    const target = this.state.users.find(u => u.id === id);
    if (!target) return;
    const updated = this.state.users.map(u => u.id === id ? { ...u, banned: !u.banned } : u);
    localStorage.setItem('ps_users', JSON.stringify(updated));
    this.setState({ users: updated });
    showToast(target.banned ? '✅ Usuario reactivado' : '🚫 Usuario baneado');
  },

  // Render principal
  render() {
    const { page, currentUser, modal, cart, cartOpen, paymentMethod, selectedProduct, favorites, orders, notifications } = this.state;

    document.getElementById('app').innerHTML = `
      ${renderHeader(this.state)}
      <main style="flex:1">
        ${page === 'store' ? renderStore(this.state) : ''}
        ${page === 'consolas' ? renderConsolas(this.state) : ''}
        ${page === 'admin' && currentUser?.role === 'admin' ? renderAdmin(this.state) : ''}
        ${page === 'vendor' && currentUser?.role === 'vendor' ? renderVendor(this.state) : ''}
        ${page === 'profile' && currentUser ? renderProfile({ currentUser, favorites, orders, notifications, sellerRequests: this.state.sellerRequests }) : ''}
        ${page === 'admin' && currentUser?.role !== 'admin' ? `<div style="padding:80px 24px;text-align:center;color:var(--muted)"><p>Acceso restringido.</p></div>` : ''}
      </main>
      ${renderFooter()}
      ${modal === 'login' ? renderLoginModal() : ''}
      ${modal === 'register' ? renderRegisterModal() : ''}
      ${modal === 'seller-request' ? renderSellerRequestModal() : ''}
      ${modal === 'add-product' ? renderAddProductModal() : ''}
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
    // Header nav
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

    // Cart sidebar
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

    // Search
    document.getElementById('search-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('search-input')?.value?.trim();
      if (q) this.setState({ page: 'store', activeGenre: 'todos', searchQuery: q });
    });
    document.getElementById('search-input')?.addEventListener('input', e => {
      this.state.searchQuery = e.target.value;
      if (!e.target.value) this.setState({ searchQuery: '' });
    });

    // Genre filter
    document.querySelectorAll('[data-genre]').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ activeGenre: btn.dataset.genre, searchQuery: '' }));
    });

    // Brand filter
    document.querySelectorAll('[data-brand]').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ activeBrand: btn.dataset.brand }));
    });

    // Add to cart
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = +btn.dataset.addCart;
        const type = btn.dataset.type || 'game';
        const item = type === 'game'
          ? GAMES.find(g => g.id === id)
          : CONSOLAS.find(c => c.id === id);
        if (item) this.addToCart({ ...item, title: item.title || item.name, type, stock: this.getStock(id, type) });
      });
    });
    document.getElementById('catalog-sort')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, sort: event.target.value } }));
    document.getElementById('catalog-price')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, price: event.target.value } }));
    document.getElementById('catalog-deals')?.addEventListener('change', event => this.setState({ catalogFilters: { ...this.state.catalogFilters, dealsOnly: event.target.checked } }));
    document.querySelectorAll('[data-favorite]').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); this.toggleFavorite(+btn.dataset.favorite, btn.dataset.type); });
    });

    // Ver detalle de producto (click en la tarjeta, evitando el botón de carrito)
    document.querySelectorAll('[data-view-product]').forEach(card => {
      card.addEventListener('click', e => {
        if (e.target.closest('[data-add-cart]')) return;
        const [type, idStr] = card.dataset.viewProduct.split('-');
        this.openProduct(+idStr, type);
      });
    });

    // Selector de estrellas en el formulario de reseña
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

    // Enviar reseña
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

    // Iniciar sesión desde el modal de producto (para dejar reseña)
    document.getElementById('btn-login-from-review')?.addEventListener('click', () => this.setState({ modal: 'login' }));

    // Modals
    document.getElementById('modal-backdrop')?.addEventListener('click', e => {
      if (e.target === document.getElementById('modal-backdrop')) this.setState({ modal: null });
    });
    document.getElementById('btn-close-modal')?.addEventListener('click', () => this.setState({ modal: null }));
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ modal: null }));
    });
    document.getElementById('btn-switch-register')?.addEventListener('click', () => this.setState({ modal: 'register' }));
    document.getElementById('btn-switch-login')?.addEventListener('click', () => this.setState({ modal: 'login' }));

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) bindLoginForm(loginForm, this);

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) bindRegisterForm(registerForm, this);

    // Demo accounts
    document.querySelectorAll('[data-demo]').forEach(btn => {
      btn.addEventListener('click', () => {
        const acc = DEMO_ACCOUNTS.find(a => a.role === btn.dataset.demo);
        if (acc) {
          document.getElementById('login-user').value = acc.username;
          document.getElementById('login-pass').value = acc.password;
        }
      });
    });

    // Solicitud de cliente para ser vendedor
    document.querySelectorAll('[data-request-vendor]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.state.currentUser?.role !== 'client') return;
        if (this.getSellerRequestForUser(this.state.currentUser.id)) {
          showToast('⏳ Ya tienes una solicitud pendiente.');
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
        showToast('⚠️ Debes aceptar los derechos y condiciones.');
        return;
      }
      if (!imageFile) {
        showToast('⚠️ Debes subir una foto del producto.');
        return;
      }
      if (!imageFile.type.startsWith('image/')) {
        showToast('⚠️ El archivo debe ser una imagen.');
        return;
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        showToast('⚠️ La imagen no puede superar los 5 MB.');
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

    // Alta de productos exclusiva del administrador
    document.querySelectorAll('[data-open-add-product]').forEach(btn => {
      btn.addEventListener('click', () => this.setState({ modal: 'add-product' }));
    });
    document.getElementById('add-product-form')?.addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = event.currentTarget.querySelector('[type="submit"]');
      const imageFile = document.getElementById('product-image').files[0];
      let imageData = '';
      if (imageFile) {
        if (imageFile.size > 2 * 1024 * 1024) {
          document.getElementById('add-product-error').textContent = 'La imagen no puede superar los 2 MB.';
          document.getElementById('add-product-error').style.display = 'block';
          return;
        }
        imageData = await readImageFile(imageFile);
      }
      submitButton.disabled = true;
      submitButton.textContent = 'Guardando...';
      const error = await this.addProduct({
        title: document.getElementById('product-title').value,
        platform: document.getElementById('product-platform').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        cost: document.getElementById('product-cost').value,
        price: document.getElementById('product-price').value,
        stock: document.getElementById('product-stock').value,
        imageData
      });
      if (error) {
        const message = document.getElementById('add-product-error');
        message.textContent = error;
        message.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Crear producto';
      }
    });
    document.getElementById('product-image')?.addEventListener('change', event => {
      const file = event.target.files[0];
      document.getElementById('product-image-name').textContent = file ? `${file.name} (${Math.ceil(file.size / 1024)} KB)` : 'Ningún archivo seleccionado.';
    });
    document.querySelectorAll('[data-vendor-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-vendor-tab]').forEach(b => b.classList.remove('active-tab'));
        btn.classList.add('active-tab');
        document.querySelectorAll('[data-vendor-panel]').forEach(p => p.style.display = 'none');
        document.querySelector(`[data-vendor-panel="${btn.dataset.vendorTab}"]`).style.display = 'block';
      });
    });

    // Editar / eliminar productos (vendedor y administrador)
    document.querySelectorAll('[data-edit-product]').forEach(btn => {
      btn.addEventListener('click', () => this.editProductPrice(+btn.dataset.editProduct));
    });
    document.querySelectorAll('[data-delete-product]').forEach(btn => {
      btn.addEventListener('click', () => this.deleteProduct(+btn.dataset.deleteProduct));
    });

    // Admin tabs
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-admin-tab]').forEach(b => b.classList.remove('active-tab'));
        btn.classList.add('active-tab');
        document.querySelectorAll('[data-admin-panel]').forEach(p => p.style.display = 'none');
        document.querySelector(`[data-admin-panel="${btn.dataset.adminTab}"]`).style.display = 'block';
      });
    });

    // Admin: banear / reactivar usuarios
    document.querySelectorAll('[data-toggle-ban]').forEach(btn => {
      btn.addEventListener('click', () => this.toggleUserBan(+btn.dataset.toggleBan));
    });

    // Admin user role change
    document.querySelectorAll('[data-change-role]').forEach(sel => {
      sel.addEventListener('change', () => {
        const uid = +sel.dataset.changeRole;
        const updated = this.state.users.map(u => u.id === uid ? { ...u, role: sel.value } : u);
        localStorage.setItem('ps_users', JSON.stringify(updated));
        this.setState({ users: updated });
        showToast('✅ Rol actualizado');
      });
    });

    // Hero scroll button
    document.getElementById('btn-explorar')?.addEventListener('click', () => {
      document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.getElementById('btn-consolas')?.addEventListener('click', () => this.navigate('consolas'));

    // Toggle password visibility
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

    // Password strength (register)
    document.getElementById('reg-password')?.addEventListener('input', e => {
      updatePasswordStrength(e.target.value);
    });

    // Confirm password live
    document.getElementById('reg-confirm')?.addEventListener('input', e => {
      const pass = document.getElementById('reg-password')?.value;
      const hint = document.getElementById('confirm-hint');
      if (!hint) return;
      if (!e.target.value) { hint.textContent = ''; return; }
      if (e.target.value === pass) {
        hint.style.color = '#a4d96f'; hint.textContent = 'Las contraseñas coinciden ✓';
        document.getElementById('reg-confirm').style.borderColor = 'rgba(0,229,255,0.45)';
      } else {
        hint.style.color = '#ff8080'; hint.textContent = 'Las contraseñas no coinciden';
        document.getElementById('reg-confirm').style.borderColor = 'rgba(255,0,47,0.5)';
      }
    });

    // Checkout
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
    const id = document.getElementById('login-user').value.trim();
    const pw = document.getElementById('login-pass').value;
    const errEl = document.getElementById('login-error');
    if (!id || !pw) { errEl.textContent = 'Completa usuario y contraseña.'; errEl.style.display = 'block'; return; }
    const err = app.login(id, pw);
    if (err) { errEl.textContent = err; errEl.style.display = 'block'; }
  });
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.readAsDataURL(file);
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


// Start
document.addEventListener('DOMContentLoaded', () => App.init());
