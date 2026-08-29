// COMPONENTS.JS - Header, Footer, Cart, Modals, Store, Consolas, Admin, Vendor

// ─── HELPERS DE RESEÑAS/CALIFICACIÓN ───────────────────────────
function avgRating(reviews) {
  if (!reviews || !reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

function renderStars(rating, size) {
  size = size || '14px';
  const rounded = Math.round(rating);
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span style="font-size:${size};color:${i <= rounded ? '#f5a623' : 'rgba(128,128,128,0.3)'};line-height:1;">★</span>`;
  }
  return html;
}

// ─── HEADER ──────────────────────────────────────────────────
function renderHeader({ currentUser, cart, page }) {
  console.log('Renderizando header con usuario:', currentUser);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const isAdmin = currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor';
  const isLight = document.body.classList.contains('light');
  const roleColor = currentUser?.role === 'admin' ? 'var(--accent)' : currentUser?.role === 'vendor' ? 'var(--accent2)' : 'var(--muted)';

  function navBtn(label, target) {
    const active = page === target;
    return `<button data-nav="${target}" style="background:none;border:none;color:${active ? 'var(--text-strong,#fff)' : 'var(--muted)'};font-weight:${active ? 700 : 400};font-size:13.5px;cursor:pointer;padding:4px 2px;border-bottom:${active ? '2px solid var(--accent)' : '2px solid transparent'};transition:color 160ms ease,border-color 160ms ease;font-family:inherit;">${label}</button>`;
  }

  return `
  <header class="site-header">
    <div style="max-width:var(--maxw);margin:0 auto;padding:0 20px;display:flex;flex-wrap:wrap;align-items:center;gap:12px;min-height:60px;">
      
      <!-- Logo -->
      <button data-nav="store" style="display:flex;align-items:center;gap:10px;background:none;border:none;cursor:pointer;padding:0;flex-shrink:0;">
        <svg width="36" height="25" viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 5px #ff002f) drop-shadow(0 0 10px rgba(0,229,255,0.6));"><defs><linearGradient id="logo-glow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff002f"/><stop offset="100%" stop-color="#00e5ff"/></linearGradient></defs><!-- Cuerpo principal negro --><path d="M116 39 C94 39 77 50 68 68 C49 75 37 94 31 120 C24 149 22 190 22 225 C22 249 25 270 36 286 C45 299 58 306 72 305 C87 304 98 296 105 281 L135 218 C141 205 153 198 168 198 H352 C367 198 379 205 385 218 L415 281 C422 296 433 304 448 305 C462 306 475 299 484 286 C495 270 498 249 498 225 C498 190 496 149 489 120 C483 94 471 75 452 68 C443 50 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H175 L170 53 C168 44 162 39 153 39 Z" fill="#000"/><path d="M72 68 C77 49 94 39 116 39 H153 C162 39 168 44 170 53 L175 70 H88 C82 70 76 70 72 68 Z" fill="#000"/><path d="M448 68 C443 49 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H432 C438 70 444 70 448 68 Z" fill="#000"/><!-- Borde degradado visible del cuerpo --><path d="M116 39 C94 39 77 50 68 68 C49 75 37 94 31 120 C24 149 22 190 22 225 C22 249 25 270 36 286 C45 299 58 306 72 305 C87 304 98 296 105 281 L135 218 C141 205 153 198 168 198 H352 C367 198 379 205 385 218 L415 281 C422 296 433 304 448 305 C462 306 475 299 484 286 C495 270 498 249 498 225 C498 190 496 149 489 120 C483 94 471 75 452 68 C443 50 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H175 L170 53 C168 44 162 39 153 39 Z" fill="none" stroke="url(#logo-glow)" stroke-width="6"/><!-- Pantalla --><rect x="174" y="62" width="172" height="83" rx="2" fill="url(#logo-glow)" opacity="0.15"/><rect x="181" y="68" width="158" height="70" rx="1" fill="#111"/><!-- D-PAD con borde degradado --><rect x="78" y="78" width="18" height="58" rx="2" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><rect x="58" y="98" width="58" height="18" rx="2" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><!-- Botones derechos con borde degradado --><circle cx="407" cy="72" r="13" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><circle cx="382" cy="103" r="13" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><circle cx="438" cy="103" r="13" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><circle cx="410" cy="132" r="13" fill="#111" stroke="url(#logo-glow)" stroke-width="2"/><!-- Joysticks con borde degradado --><circle cx="181" cy="204" r="25" fill="#111" stroke="url(#logo-glow)" stroke-width="2.5"/><circle cx="181" cy="204" r="18" fill="#000"/><circle cx="339" cy="204" r="25" fill="#111" stroke="url(#logo-glow)" stroke-width="2.5"/><circle cx="339" cy="204" r="18" fill="#000"/><!-- Botones centrales --><rect x="204" y="157" width="25" height="10" rx="5" fill="#111" stroke="url(#logo-glow)" stroke-width="1.5"/><rect x="291" y="157" width="25" height="10" rx="5" fill="#111" stroke="url(#logo-glow)" stroke-width="1.5"/><rect x="249" y="157" width="22" height="8" rx="4" fill="#111" stroke="url(#logo-glow)" stroke-width="1.5"/></svg>
        <div style="text-align:left;">
          <div style="font-size:15px;font-weight:800;color:var(--text-strong,#fff);letter-spacing:0.5px;">PixelStore</div>
          <div style="font-size:10px;color:var(--muted);margin-top:-2px;">Tu tienda de videojuegos</div>
        </div>
      </button>

      <!-- Search -->
      <form id="search-form" class="search-form" style="flex:1;display:flex;align-items:center;max-width:480px;border-radius:8px;min-width:0;">
        <span style="padding:0 10px;flex-shrink:0;display:flex;align-items:center;"><svg width="18" height="17" viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg" style="display:block;"><circle cx="136" cy="139" r="84" fill="none" stroke="#9aa1a6" stroke-width="16"/><path d="M 86 169 C 78 148 81 123 92 105 C 103 87 120 76 140 73" fill="none" stroke="#9aa1a6" stroke-width="14" stroke-linecap="round"/><path d="M 195 198 L 218 221 L 201 238 L 178 215 Z" fill="#9aa1a6"/><path d="M 210 214 L 278 282 C 286 290 286 303 278 311 L 269 320 C 261 328 248 328 240 320 L 172 252 C 164 244 164 231 172 223 L 181 214 C 189 206 202 206 210 214 Z" fill="#9aa1a6"/><path d="M 202 226 L 267 291 C 271 295 271 301 267 305 L 263 309 C 267 303 267 298 262 293 L 197 228 Z" fill="#ffffff"/><path d="M 248 318 C 255 325 264 325 271 319 L 278 312 C 285 305 285 296 279 290 L 268 300 C 273 305 273 310 268 315 L 263 320 C 258 324 252 323 248 318 Z" fill="#9aa1a6"/></svg></span>
        <input id="search-input" type="search" placeholder="Buscar juegos, consolas..." style="flex:1;min-width:0;padding:9px 8px;background:transparent;border:none;color:var(--text);font-size:13.5px;font-family:inherit;outline:none;"
          onfocus="this.closest('.search-form').classList.add('search-focused')"
          onblur="this.closest('.search-form').classList.remove('search-focused')" />
        <button type="submit" style="margin:3px;padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:6px;color:#070607;font-weight:700;font-size:12px;cursor:pointer;flex-shrink:0;font-family:inherit;transition:filter 160ms;"
          onmouseenter="this.style.filter='brightness(1.1)'"
          onmouseleave="this.style.filter='none'">Buscar</button>
      </form>

      <!-- Nav -->
      <nav style="display:flex;gap:16px;align-items:center;flex-shrink:0;">
        ${navBtn('Tienda', 'store')}
        ${navBtn('Consolas', 'consolas')}
        ${currentUser ? navBtn('Perfil', 'profile') : ''}
        ${isAdmin ? navBtn('Admin', 'admin') : ''}
        ${isVendor ? navBtn('Mi Panel', 'vendor') : ''}
      </nav>

      <!-- User / Auth -->
      <div style="display:flex;gap:8px;align-items:center;margin-left:auto;flex-shrink:0;">
        <button id="btn-theme-toggle" class="theme-toggle-btn" type="button" aria-label="Cambiar a modo ${isLight ? 'oscuro' : 'claro'}">
          ${isLight ? 'Oscuro' : 'Claro'}
        </button>
        ${currentUser?.role === 'client' ? `
          <button data-request-vendor class="btn-glow" type="button" style="padding:7px 12px;background:var(--surface);border:1px solid var(--border,rgba(255,255,255,0.08));border-radius:8px;color:var(--text-strong,#eef2f4);font-size:12px;cursor:pointer;font-family:inherit;font-weight:700;">
            Ser vendedor
          </button>
        ` : ''}
        ${currentUser ? `
          <div style="display:flex;flex-direction:column;align-items:flex-end;margin-right:4px;">
            <span style="font-size:13px;font-weight:700;color:var(--text-strong,#fff);">${currentUser.fullName.split(' ')[0]}</span>
            <span style="font-size:10px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:${roleColor};">${ROLE_LABELS[currentUser.role]}</span>
          </div>
          <button id="btn-logout" style="padding:7px 14px;background:transparent;border:1px solid var(--border,rgba(255,255,255,0.08));border-radius:8px;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;transition:color 160ms,border-color 160ms;"
            onmouseenter="this.style.color='#fff';this.style.borderColor='rgba(255,0,47,0.4)'"
            onmouseleave="this.style.color='var(--muted)';this.style.borderColor='var(--border,rgba(255,255,255,0.08))'">Salir</button>
        ` : `
          <button id="btn-login" class="btn-glow" style="padding:7px 14px;background:var(--surface);border:1px solid var(--border,rgba(255,255,255,0.08));border-radius:8px;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;font-weight:500;">Iniciar sesión</button>
          <button id="btn-register" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#070607;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">Registrarse</button>
        `}
        <button id="btn-cart" class="cart-trigger" aria-label="Abrir carrito${cartCount ? `, ${cartCount} productos` : ''}" style="padding:7px 14px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);font-size:13px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0;position:relative;transition:border-color 200ms;display:inline-flex;align-items:center;gap:6px;"
          onmouseenter="this.style.borderColor='rgba(0,229,255,0.3)'"
          onmouseleave="this.style.borderColor='rgba(255,255,255,0.07)'">
          <svg width="22" height="16" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 3px rgba(255,255,255,0.9)) drop-shadow(0 0 7px rgba(255,255,255,0.5));"><path d="M34 43 H61 L69 67" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"><path d="M27 67 H52"/><path d="M22 82 H50"/><path d="M28 98 H51"/></g><path d="M68 67 H264 L238 132 Q235 139 226 139 H96 Q88 139 85 132 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/><path d="M88 139 L99 159 H230" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M99 159 C90 159 85 165 85 173 C85 181 91 185 101 185 H228" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><circle cx="104" cy="199" r="12" fill="#ffffff"/><circle cx="221" cy="199" r="12" fill="#ffffff"/></svg>${cartCount > 0 ? `<span style="background:var(--accent);color:#fff;font-size:10px;font-weight:800;padding:1px 5px;border-radius:999px;">${cartCount}</span>` : ''}
        </button>
      </div>
    </div>
  </header>`;
}

// ─── FOOTER ──────────────────────────────────────────────────
function renderFooter() {
  const year = new Date().getFullYear();
  return `
  <footer style="position:relative;background:var(--bg);color:var(--muted);margin-top:56px;padding:40px 0 22px;isolation:isolate;">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,0,47,0.3),rgba(0,229,255,0.3),transparent);"></div>
    <div style="max-width:var(--maxw);margin:0 auto;padding:0 20px;">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:28px 24px;padding-bottom:24px;">
        <div style="grid-column:1/-1;max-width:400px;">
          <h5 style="margin:0 0 10px;font-size:16px;font-weight:800;letter-spacing:0.4px;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;">PixelStore</h5>
          <p style="margin:0;font-size:13px;line-height:1.6;">Tu tienda de confianza para videojuegos digitales y físicos. Juega más, paga menos.</p>
        </div>
        <div>
          <h6 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Tienda</h6>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;">
            ${['Juegos destacados','Ofertas','Novedades','Consolas'].map(t => `<li><a href="#" style="font-size:13px;color:var(--muted);text-decoration:none;transition:color 160ms ease;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='var(--muted)'">${t}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h6 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Soporte</h6>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;">
            ${['Ayuda','Contacto','Términos de uso','Privacidad'].map(t => `<li><a href="#" style="font-size:13px;color:var(--muted);text-decoration:none;transition:color 160ms ease;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='var(--muted)'">${t}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h6 style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Síguenos</h6>
          <div style="display:flex;flex-wrap:wrap;gap:12px;">
            ${['Twitter','Instagram','Discord','YouTube'].map(t => `<a href="#" style="font-size:13px;color:var(--muted);text-decoration:none;transition:color 160ms ease;" onmouseenter="this.style.color='#fff'" onmouseleave="this.style.color='var(--muted)'">${t}</a>`).join('')}
          </div>
        </div>
      </div>
      <div style="border-top:1px solid rgba(255,255,255,0.05);padding-top:16px;font-size:12px;">
        <p style="margin:0;">© ${year} PixelStore – Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>`;
}

// ─── CART SIDEBAR ─────────────────────────────────────────────
function renderCart(cart, open, paymentMethod = 'cash') {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const QR_PAYMENT_IMAGE = 'https://placehold.co/280x280/111215/00e5ff?text=Tu+imagen+QR';
  const paymentOptions = [
    {
      id: 'cash',
      label: 'Efectivo',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h16v10H4z"/><path d="M8 7.5V5h8v2.5M12 10.25a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z"/></svg>`
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM15 14h2v2h-2zM19 14h1v3h-3M14 18h2v2h-2zM18 19h2v1h-2z"/></svg>`
    }
  ];
  return `
  <div id="cart-overlay" class="cart-overlay ${open ? 'open' : ''}"></div>
  <aside class="cart-sidebar ${open ? 'open' : ''}">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 20px 16px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.06));">
      <h3 style="margin:0;font-size:16px;font-weight:700;color:var(--text-strong,#fff);display:flex;align-items:center;gap:8px;"><svg width="22" height="16" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 6px rgba(255,255,255,0.4));"><path d="M34 43 H61 L69 67" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"><path d="M27 67 H52"/><path d="M22 82 H50"/><path d="M28 98 H51"/></g><path d="M68 67 H264 L238 132 Q235 139 226 139 H96 Q88 139 85 132 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/><path d="M88 139 L99 159 H230" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M99 159 C90 159 85 165 85 173 C85 181 91 185 101 185 H228" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><circle cx="104" cy="199" r="12" fill="#ffffff"/><circle cx="221" cy="199" r="12" fill="#ffffff"/></svg> Carrito <span style="color:var(--muted);font-size:13px;font-weight:400;">(${cart.length})</span></h3>
      <button id="cart-close" style="width:32px;height:32px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center;">×</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 20px;">
      ${cart.length === 0 ? `
        <div style="text-align:center;padding:60px 0;color:var(--muted);">
          <div style="display:flex;justify-content:center;margin-bottom:16px;">
            <svg width="72" height="52" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="display:block;opacity:0.35;filter:drop-shadow(0 0 8px rgba(255,255,255,0.3));"><path d="M34 43 H61 L69 67" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round"><path d="M27 67 H52"/><path d="M22 82 H50"/><path d="M28 98 H51"/></g><path d="M68 67 H264 L238 132 Q235 139 226 139 H96 Q88 139 85 132 Z" fill="#ffffff" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/><path d="M88 139 L99 159 H230" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M99 159 C90 159 85 165 85 173 C85 181 91 185 101 185 H228" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/><circle cx="104" cy="199" r="12" fill="#ffffff"/><circle cx="221" cy="199" r="12" fill="#ffffff"/></svg>
          </div>
          <p>Tu carrito está vacío.</p>
        </div>
      ` : cart.map(item => `
        <div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
          <img src="${item.image}" alt="${item.title}" style="width:60px;height:44px;object-fit:cover;border-radius:6px;flex-shrink:0;" onerror="this.src='https://via.placeholder.com/60x44/111215/666?text=IMG'">
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:700;color:var(--text-strong,#eef2f4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</div>
            <div style="font-size:12px;color:var(--muted);">$${item.price.toFixed(2)} c/u</div>
            <div class="cart-quantity" aria-label="Cantidad de ${item.title}">
              <button type="button" data-cart-quantity="${item.id}" data-type="${item.type}" data-change="-1" aria-label="Restar una unidad">−</button>
              <span>${item.qty}</span>
              <button type="button" data-cart-quantity="${item.id}" data-type="${item.type}" data-change="1" aria-label="Sumar una unidad" ${item.qty >= (item.stock ?? 99) ? 'disabled' : ''}>+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            <span style="font-size:13px;font-weight:700;color:#a4d96f;">$${(item.price * item.qty).toFixed(2)}</span>
            <button data-remove-cart="${item.id}" data-type="${item.type}" style="font-size:11px;color:var(--muted);background:none;border:none;cursor:pointer;padding:0;transition:color 160ms;"
              onmouseenter="this.style.color='#ff6b6b'" onmouseleave="this.style.color='var(--muted)'">Eliminar</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      ${cart.length > 0 ? `
        <section class="payment-methods" aria-labelledby="payment-method-title">
          <span id="payment-method-title" class="payment-methods__title">Método de pago</span>
          <div class="payment-methods__options" role="radiogroup" aria-label="Método de pago">
            ${paymentOptions.map(option => `
              <button type="button" class="payment-option ${paymentMethod === option.id ? 'is-selected' : ''}" data-payment-method="${option.id}" role="radio" aria-checked="${paymentMethod === option.id}">
                <span class="payment-option__icon">${option.icon}</span>
                <span>${option.label}</span>
              </button>
            `).join('')}
          </div>
          ${paymentMethod === 'qr' ? `
            <div class="qr-payment-preview">
              <img src="${QR_PAYMENT_IMAGE}" alt="Imagen de pago QR de ejemplo" onerror="this.src='https://placehold.co/280x280/111215/00e5ff?text=QR'">
              <p>Reemplaza la URL <code>QR_PAYMENT_IMAGE</code> por la ruta de tu imagen PNG.</p>
            </div>` : ''}
        </section>
      ` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:14px;color:var(--muted);">Total</span>
        <span style="font-size:18px;font-weight:800;color:#a4d96f;">$${total.toFixed(2)}</span>
      </div>
      <button id="btn-checkout" style="width:100%;padding:12px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:10px;color:#070607;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:filter 160ms,transform 160ms;"
        onmouseenter="this.style.filter='brightness(1.08)';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.filter='none';this.style.transform='none'">
        ${cart.length === 0 ? 'Carrito vacío' : 'Finalizar compra →'}
      </button>
      ${cart.length > 0 ? '<p class="checkout-note">Recibirás una confirmación cuando tu pedido esté listo.</p>' : ''}
    </div>
  </aside>`;
}

// ============================================
// ✅ LOGIN MODAL CORREGIDO (CON IDS CORRECTOS)
// ============================================
function renderLoginModal() {
  return `
  <div class="modal-overlay" id="login-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;">
    <div class="modal-content" style="background:var(--surface,#1a1a1a);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px;width:100%;max-width:400px;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
      
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <h3 style="margin:0;font-size:1.4rem;font-weight:800;color:#fff;">Iniciar Sesión</h3>
        <button type="button" id="btn-close-login" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;">&times;</button>
      </div>

      <!-- ✅ FORMULARIO CON IDS CORRECTOS -->
      <form id="login-form">
        <div style="margin-bottom:16px;">
          <label style="display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px;">Correo electrónico o Usuario</label>
          <input 
            type="text" 
            id="login-user" 
            required 
            placeholder="tu@email.com"
            style="width:100%;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:#111;color:#fff;box-sizing:border-box;"
          />
        </div>

        <div style="margin-bottom:24px;">
          <label style="display:block;font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px;">Contraseña</label>
          <input 
            type="password" 
            id="login-pass" 
            required 
            placeholder="••••••••"
            style="width:100%;padding:12px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:#111;color:#fff;box-sizing:border-box;"
          />
        </div>

        <div id="login-error" style="display:none;margin-bottom:14px;padding:8px 12px;background:rgba(255,20,20,0.1);color:#ffb7b7;border-radius:8px;font-size:13px;"></div>

        <button 
          type="submit" 
          style="width:100%;padding:12px;border-radius:8px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:opacity 0.2s;"
        >
          Entrar a PixelStore
        </button>
      </form>

      <div style="margin-top:20px;text-align:center;font-size:13px;color:var(--muted);">
        ¿No tienes cuenta? <a href="#" id="link-open-register" style="color:var(--accent);text-decoration:none;font-weight:600;">Regístrate aquí</a>
      </div>
    </div>
  </div>`;
}

// ─── PRODUCT DETAIL MODAL ──────────────────────────────────────
function renderSellerRequestModal() {
  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:120;">
    <div class="modal-box" style="max-width:600px;" role="dialog" aria-modal="true">
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:16px;font-family:inherit;">×</button>
      <h2 style="margin:0 0 6px;font-size:1.4rem;font-weight:800;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;">Solicitar ser vendedor</h2>
      <p style="margin:0 0 18px;color:var(--muted);font-size:13.5px;">Completa los datos del producto que quieres vender.</p>

      <form id="seller-request-form">
        <label class="field-label">Teléfono</label>
        <input id="seller-phone" class="field-input" type="text" required>

        <label class="field-label">¿Qué quieres vender?</label>
        <select id="seller-sale-type" class="field-input" required>
          <option value="">Seleccionar...</option>
          <option value="Videojuegos">Videojuegos</option>
          <option value="Consolas">Consolas</option>
        </select>

        <label class="field-label">Nombre del producto</label>
        <input id="seller-product-title" class="field-input" type="text" required>

        <label class="field-label">Descripción del producto</label>
        <textarea id="seller-product-description" class="field-input" rows="4" required></textarea>

        <label class="field-label">Precio</label>
        <input id="seller-product-price" class="field-input" type="number" min="0.01" step="0.01" required>

        <label class="field-label">Stock</label>
        <input id="seller-product-stock" class="field-input" type="number" min="1" step="1" required>

        <label class="field-label">Foto del producto</label>
        <input id="seller-product-image" class="field-input" type="file" accept="image/*" required>
        <p style="margin:5px 0 14px;font-size:11px;color:var(--muted);">Imagen obligatoria. Máximo 5 MB.</p>

        <label style="display:flex;align-items:flex-start;gap:9px;margin:14px 0 18px;color:var(--muted);font-size:12.5px;line-height:1.45;">
          <input id="seller-terms" type="checkbox" required style="margin-top:2px;">
          <span>Acepto los derechos, condiciones y responsabilidades de los vendedores de PixelStore.</span>
        </label>

        <button type="submit" style="width:100%;padding:11px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:9px;color:#070607;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;">
          Enviar solicitud
        </button>
      </form>
    </div>
  </div>`;
}

function renderProductModal(product, type, reviews, currentUser, favorites = {}) {
  if (!product) return '';
  const isGame = type === 'game';
  const name = isGame ? product.title : product.name;
  const category = isGame ? product.genreLabel : ('Consola · ' + product.brand);
  const rating = avgRating(reviews);
  const favorite = currentUser && (favorites[currentUser.id] || []).includes(`${type}-${product.id}`);
  const related = (isGame ? GAMES.filter(item => item.id !== product.id && item.genres.some(genre => product.genres?.includes(genre))) : CONSOLAS.filter(item => item.id !== product.id && item.brand === product.brand)).slice(0, 3);

  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:130;">
    <div class="modal-box" style="max-width:640px;" role="dialog" aria-modal="true" aria-labelledby="product-title">
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:16px;font-family:inherit;">×</button>

      <div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:20px;">
        <img src="${product.image}" alt="${name}" style="width:100%;max-width:220px;height:150px;object-fit:cover;border-radius:12px;flex-shrink:0;" onerror="this.src='https://via.placeholder.com/220x150/111215/444?text=${isGame ? 'Game' : 'Consola'}'">
        <div style="flex:1;min-width:200px;">
          <span class="eyebrow">${category}</span>
          <h2 id="product-title" style="margin:0 0 8px;font-size:1.4rem;font-weight:800;color:var(--text-strong,#fff);">${name}</h2>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            ${renderStars(rating)}
            <span style="font-size:12.5px;color:var(--muted);">${rating ? rating.toFixed(1) : 'Sin calificación'} ${reviews.length ? `(${reviews.length} reseña${reviews.length === 1 ? '' : 's'})` : ''}</span>
          </div>
          <div style="margin-bottom:14px;">
            ${product.originalPrice ? `<span style="font-size:13px;color:var(--muted);text-decoration:line-through;margin-right:8px;">$${product.originalPrice.toFixed(2)}</span>` : ''}
            <span style="font-size:22px;font-weight:800;color:#a4d96f;">$${product.price.toFixed(2)}</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button data-add-cart="${product.id}" data-type="${type}" style="padding:10px 20px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:9px;color:#070607;font-size:13.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:filter 160ms,transform 160ms;"
            onmouseenter="this.style.filter='brightness(1.1)';this.style.transform='translateY(-1px)'"
            onmouseleave="this.style.filter='none';this.style.transform='none'">+ Añadir al carrito</button>
          <button type="button" data-favorite="${product.id}" data-type="${type}" class="favorite-button ${favorite ? 'is-active' : ''}" aria-label="${favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">${favorite ? '♥ Guardado' : '♡ Favorito'}</button>
          </div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px;padding:14px 16px;background:var(--surface2,rgba(255,255,255,0.03));border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:10px;">
        ${isGame ? `
        <div>
          <div style="font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">Plataforma</div>
          <div style="font-size:13px;color:var(--text-strong,#eef2f4);font-weight:700;">${product.platform || 'N/D'}</div>
        </div>` : `
        <div>
          <div style="font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">Marca</div>
          <div style="font-size:13px;color:var(--text-strong,#eef2f4);font-weight:700;">${product.brand}</div>
        </div>`}
        <div>
          <div style="font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:0.6px;margin-bottom:3px;">Desarrollador</div>
          <div style="font-size:13px;color:var(--text-strong,#eef2f4);font-weight:700;">${product.developer || 'N/D'}</div>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:var(--text-sub,#cfd6db);margin-bottom:8px;">Descripción</div>
        <p style="margin:0;font-size:13.5px;line-height:1.6;color:var(--muted);">${product.description || 'Sin descripción disponible.'}</p>
      </div>

      ${related.length ? `<div style="margin-bottom:24px;"><div style="font-size:11px;font-weight:700;letter-spacing:.9px;text-transform:uppercase;color:var(--text-sub);margin-bottom:9px;">También te puede gustar</div><div class="related-products">${related.map(item => `<button type="button" data-view-product="${type}-${item.id}"><img src="${item.image}" alt=""><span>${item.title || item.name}</span><strong>$${item.price.toFixed(2)}</strong></button>`).join('')}</div></div>` : ''}

      <!-- Reseñas -->
      <div style="border-top:1px solid var(--border-subtle,rgba(255,255,255,0.07));padding-top:18px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:var(--text-sub,#cfd6db);margin-bottom:12px;">Reseñas ${reviews.length ? `(${reviews.length})` : ''}</div>

        <div style="max-height:220px;overflow-y:auto;margin-bottom:18px;display:flex;flex-direction:column;gap:12px;padding-right:4px;">
          ${reviews.length === 0 ? `<p style="font-size:13px;color:var(--muted);">Aún no hay reseñas. ¡Sé el primero en opinar!</p>` : reviews.slice().reverse().map(r => `
            <div style="padding:10px 12px;background:var(--surface2,rgba(255,255,255,0.03));border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:9px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;gap:8px;">
                <span style="font-size:12.5px;font-weight:700;color:var(--text-strong,#eef2f4);">${r.user}</span>
                <span style="font-size:11px;color:var(--muted);white-space:nowrap;">${r.date}</span>
              </div>
              <div style="margin-bottom:5px;">${renderStars(r.rating, '12px')}</div>
              <p style="margin:0;font-size:12.5px;color:var(--muted);line-height:1.5;">${r.comment}</p>
            </div>
          `).join('')}
        </div>

        ${currentUser ? `
          <form id="review-form">
            <div id="review-error" style="display:none;margin-bottom:10px;padding:8px 10px;background:rgba(255,20,20,0.1);color:#ffb7b7;border-radius:8px;font-size:12.5px;"></div>
            <div style="margin-bottom:10px;">
              <label class="field-label">Tu calificación</label>
              <div style="display:flex;gap:4px;align-items:center;">
                ${[1, 2, 3, 4, 5].map(i => `<span data-star-select="${i}" style="font-size:22px;cursor:pointer;color:var(--muted);user-select:none;">☆</span>`).join('')}
                <input type="hidden" id="review-rating-input" value="0" />
              </div>
            </div>
            <div style="margin-bottom:12px;">
              <label class="field-label" for="review-comment">Tu reseña</label>
              <textarea id="review-comment" class="field-input" rows="3" placeholder="Cuéntanos qué te pareció..." style="resize:vertical;font-family:inherit;"></textarea>
            </div>
            <button type="submit" style="padding:9px 18px;background:linear-gradient(90deg,var(--accent2),var(--accent));border:none;border-radius:8px;color:#070607;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;">Publicar reseña</button>
          </form>
        ` : `
          <p style="font-size:13px;color:var(--muted);">
            <button id="btn-login-from-review" style="background:none;border:none;color:var(--accent2);cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;padding:0;">Inicia sesión</button> para dejar tu reseña.
          </p>
        `}
      </div>
    </div>
  </div>`;
}

// ─── STORE PAGE ───────────────────────────────────────────────
function renderStore({ activeGenre, searchQuery, reviews, catalogFilters = {} }) {
  let games = activeGenre === 'todos' ? [...GAMES] : GAMES.filter(g => g.genres.includes(activeGenre));
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    games = GAMES.filter(g => g.title.toLowerCase().includes(q) || g.genreLabel.toLowerCase().includes(q));
  }
  if (catalogFilters.price === 'under25') games = games.filter(game => game.price < 25);
  if (catalogFilters.price === '25to50') games = games.filter(game => game.price >= 25 && game.price <= 50);
  if (catalogFilters.price === 'over50') games = games.filter(game => game.price > 50);
  if (catalogFilters.dealsOnly) games = games.filter(game => game.discount);
  if (catalogFilters.sort === 'price-asc') games.sort((a, b) => a.price - b.price);
  if (catalogFilters.sort === 'price-desc') games.sort((a, b) => b.price - a.price);
  if (catalogFilters.sort === 'discount') games.sort((a, b) => (b.discount || 0) - (a.discount || 0));

  return `
  <div>
    <!-- Hero -->
    <section class="hero-grid" style="position:relative;min-height:56vh;display:flex;align-items:center;margin:16px 20px;border-radius:18px;overflow:hidden;background:radial-gradient(560px 360px at 12% 18%,rgba(255,0,47,0.28),transparent 60%),radial-gradient(520px 400px at 88% 82%,rgba(0,229,255,0.2),transparent 60%),linear-gradient(160deg,#121319 0%,#0a0b0d 55%,#060607 100%);">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,3,4,0) 0%,rgba(4,4,5,0.5) 100%);"></div>
      <div style="position:relative;z-index:2;padding:56px 40px;max-width:var(--maxw);margin:0 auto;width:100%;">
        <span class="eyebrow">Tu portal gamer</span>
        <h2 style="font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800;letter-spacing:-0.6px;margin:0 0 12px;color:#fff;">Bienvenido a PixelStore</h2>
        <p style="color:var(--muted);margin:0 0 24px;max-width:46ch;font-size:15px;">Encuentra tus juegos favoritos, ofertas exclusivas y las últimas novedades — todo en un solo lugar.</p>
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;">
          <button id="btn-explorar" style="padding:12px 22px;background:transparent;border:2px solid var(--accent);color:var(--accent);border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all 200ms ease;"
            onmouseenter="this.style.background='rgba(255,0,47,0.08)';this.style.boxShadow='0 24px 60px rgba(255,0,47,0.22)';this.style.transform='translateY(-3px)'"
            onmouseleave="this.style.background='transparent';this.style.boxShadow='none';this.style.transform='none'">Explorar juegos</button>
          <button id="btn-consolas" style="padding:12px 22px;background:transparent;border:2px solid rgba(0,229,255,0.5);color:var(--accent2);border-radius:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all 200ms ease;display:inline-flex;align-items:center;gap:8px;"
            onmouseenter="this.style.background='rgba(0,229,255,0.06)';this.style.transform='translateY(-3px)'"
            onmouseleave="this.style.background='transparent';this.style.transform='none'"><svg width="22" height="15" viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 4px rgba(0,229,255,0.55));"><defs><linearGradient id="gpad-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff002f"/><stop offset="100%" stop-color="#00e5ff"/></linearGradient></defs><path d="M116 39 C94 39 77 50 68 68 C49 75 37 94 31 120 C24 149 22 190 22 225 C22 249 25 270 36 286 C45 299 58 306 72 305 C87 304 98 296 105 281 L135 218 C141 205 153 198 168 198 H352 C367 198 379 205 385 218 L415 281 C422 296 433 304 448 305 C462 306 475 299 484 286 C495 270 498 249 498 225 C498 190 496 149 489 120 C483 94 471 75 452 68 C443 50 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H175 L170 53 C168 44 162 39 153 39 Z" fill="url(#gpad-grad)"/><path d="M72 68 C77 49 94 39 116 39 H153 C162 39 168 44 170 53 L175 70 H88 C82 70 76 70 72 68 Z" fill="url(#gpad-grad)"/><path d="M448 68 C443 49 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H432 C438 70 444 70 448 68 Z" fill="url(#gpad-grad)"/><rect x="174" y="62" width="172" height="83" rx="2" fill="#0b0b0d"/><rect x="181" y="68" width="158" height="70" rx="1" fill="url(#gpad-grad)"/><g fill="#0b0b0d"><rect x="78" y="78" width="18" height="58" rx="2"/><rect x="58" y="98" width="58" height="18" rx="2"/></g><rect x="78" y="98" width="18" height="18" fill="#0b0b0d"/><circle cx="407" cy="72" r="13" fill="#0b0b0d"/><circle cx="382" cy="103" r="13" fill="#0b0b0d"/><circle cx="438" cy="103" r="13" fill="#0b0b0d"/><circle cx="410" cy="132" r="13" fill="#0b0b0d"/><circle cx="181" cy="204" r="25" fill="#0b0b0d"/><circle cx="181" cy="204" r="18" fill="url(#gpad-grad)"/><circle cx="339" cy="204" r="25" fill="#0b0b0d"/><circle cx="339" cy="204" r="18" fill="url(#gpad-grad)"/><rect x="204" y="157" width="25" height="10" rx="5" fill="#0b0b0d"/><rect x="291" y="157" width="25" height="10" rx="5" fill="#0b0b0d"/><rect x="249" y="157" width="22" height="8" rx="4" fill="#0b0b0d"/></svg> Consolas</button>
        </div>
      </div>
    </section>

    <div style="max-width:var(--maxw);margin:0 auto;padding:0 20px;">
      <!-- Genre Filter -->
      <div style="display:flex;gap:8px;padding:18px 0 6px;overflow-x:auto;scrollbar-width:none;">
        ${GENRES.map(g => `<button data-genre="${g.id}" class="genre-pill ${activeGenre === g.id && !searchQuery ? 'active' : 'inactive'}">${g.label}</button>`).join('')}
      </div>
      <div class="catalog-tools" aria-label="Filtros avanzados">
        <select id="catalog-sort"><option value="featured" ${catalogFilters.sort === 'featured' ? 'selected' : ''}>Destacados</option><option value="price-asc" ${catalogFilters.sort === 'price-asc' ? 'selected' : ''}>Menor precio</option><option value="price-desc" ${catalogFilters.sort === 'price-desc' ? 'selected' : ''}>Mayor precio</option><option value="discount" ${catalogFilters.sort === 'discount' ? 'selected' : ''}>Mayor descuento</option></select>
        <select id="catalog-price"><option value="all">Todos los precios</option><option value="under25" ${catalogFilters.price === 'under25' ? 'selected' : ''}>Menos de $25</option><option value="25to50" ${catalogFilters.price === '25to50' ? 'selected' : ''}>$25 a $50</option><option value="over50" ${catalogFilters.price === 'over50' ? 'selected' : ''}>Más de $50</option></select>
        <label><input id="catalog-deals" type="checkbox" ${catalogFilters.dealsOnly ? 'checked' : ''}> Solo ofertas</label>
      </div>

      <!-- Games Grid -->
      <section id="destacados" style="padding:16px 0 40px;">
        <div style="margin-bottom:22px;">
          <span class="eyebrow">${searchQuery ? 'Resultados de búsqueda' : 'Selección de la semana'}</span>
          <h3 style="margin:0;font-size:1.5rem;letter-spacing:0.2px;color:var(--text-strong,#fff);font-weight:800;">${searchQuery ? `"${searchQuery}"` : 'Destacados'}</h3>
        </div>
        ${games.length === 0 ? `<p style="color:var(--muted);text-align:center;padding:40px 0;">No hay juegos en esta categoría.</p>` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;">
          ${games.map(g => renderGameCard(g, reviews)).join('')}
        </div>`}
      </section>
    </div>
  </div>`;
}

function renderGameCard(g, reviews) {
  const list = (reviews && reviews[`game-${g.id}`]) || [];
  const rating = avgRating(list);
  return `
  <article class="game-card" data-view-product="game-${g.id}" style="cursor:pointer;background:var(--surface);border:1px solid rgba(255,255,255,0.05);border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.6);display:flex;flex-direction:column;">
    <div style="position:relative;overflow:hidden;background:#0a0a0c;height:170px;">
      <img class="card-img" src="${g.image}" alt="${g.title}" style="width:100%;height:170px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/280x170/111215/444?text=Game'">
      ${g.discount ? `<div style="position:absolute;top:10px;right:10px;background:#4c6b22;color:#a4d96f;font-size:11px;font-weight:800;padding:3px 7px;border-radius:5px;">-${g.discount}%</div>` : ''}
    </div>
    <div style="padding:14px 14px 16px;display:flex;flex-direction:column;gap:8px;flex:1;">
      <h4 style="margin:0;font-size:14.5px;font-weight:700;color:var(--text-strong,#eef2f4);line-height:1.3;">${g.title}</h4>
      <span style="font-size:11.5px;color:var(--muted);">${g.genreLabel}</span>
      <div style="display:flex;align-items:center;gap:5px;">
        ${renderStars(rating, '12px')}
        <span style="font-size:11px;color:var(--muted);">${list.length ? `(${list.length})` : 'Sin reseñas'}</span>
      </div>
      <div style="margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:10px;">
        <div>
          ${g.originalPrice ? `<span style="font-size:11.5px;color:var(--muted);text-decoration:line-through;margin-right:6px;">$${g.originalPrice.toFixed(2)}</span>` : ''}
          <span style="font-size:16px;font-weight:800;color:#a4d96f;">$${g.price.toFixed(2)}</span>
        </div>
        <button data-add-cart="${g.id}" data-type="game" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#070607;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:filter 160ms,transform 160ms;"
          onmouseenter="this.style.filter='brightness(1.1)';this.style.transform='translateY(-1px)'"
          onmouseleave="this.style.filter='none';this.style.transform='none'">+ Carrito</button>
      </div>
    </div>
  </article>`;
}

// ─── CONSOLAS PAGE ────────────────────────────────────────────
function renderConsolas({ activeBrand, reviews }) {
  const brands = ['todos','PlayStation','Xbox','Nintendo'];
  const consolas = activeBrand === 'todos' ? CONSOLAS : CONSOLAS.filter(c => c.brand === activeBrand);

  return `
  <div style="max-width:var(--maxw);margin:0 auto;padding:32px 20px 60px;">
    <div style="margin-bottom:28px;">
      <span class="eyebrow">Hardware</span>
      <h2 style="margin:0;font-size:2rem;font-weight:800;">Consolas</h2>
      <p style="margin:8px 0 0;color:var(--muted);font-size:14px;">Las mejores consolas de la generación actual.</p>
    </div>

    <!-- Brand Filter -->
    <div style="display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap;">
      ${brands.map(b => `
        <button data-brand="${b}" style="padding:8px 18px;border-radius:999px;font-size:13.5px;cursor:pointer;font-family:inherit;transition:all 180ms ease;
          ${activeBrand === b
            ? 'border:none;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#070607;font-weight:700;'
            : 'border:1px solid var(--border-subtle,rgba(255,255,255,0.07));background:var(--surface);color:var(--muted);font-weight:400;'}"
          onmouseenter="${activeBrand !== b ? "this.style.borderColor='rgba(255,255,255,0.18)';this.style.color='#fff'" : ''}"
          onmouseleave="${activeBrand !== b ? "this.style.borderColor='rgba(255,255,255,0.07)';this.style.color='var(--muted)'" : ''}"
        >${b === 'todos' ? 'Todas' : b}</button>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;">
      ${consolas.map(c => {
        const list = (reviews && reviews[`consola-${c.id}`]) || [];
        const rating = avgRating(list);
        return `
        <article class="game-card" data-view-product="consola-${c.id}" style="cursor:pointer;background:var(--surface);border:1px solid rgba(255,255,255,0.05);border-radius:12px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.6);display:flex;flex-direction:column;">
          <div style="overflow:hidden;height:180px;background:#0a0a0c;">
            <img class="card-img" src="${c.image}" alt="${c.name}" style="width:100%;height:180px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/260x180/111215/444?text=Consola'">
          </div>
          <div style="padding:14px 14px 16px;display:flex;flex-direction:column;gap:8px;">
            <div style="font-size:11px;color:var(--muted);font-weight:600;letter-spacing:0.8px;text-transform:uppercase;">${c.brand}</div>
            <h4 style="margin:0;font-size:15px;font-weight:700;color:var(--text-strong,#eef2f4);">${c.name}</h4>
            <div style="display:flex;align-items:center;gap:5px;">
              ${renderStars(rating, '12px')}
              <span style="font-size:11px;color:var(--muted);">${list.length ? `(${list.length})` : 'Sin reseñas'}</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px;">
              <span style="font-size:17px;font-weight:800;color:#a4d96f;">$${c.price.toFixed(2)}</span>
              <button data-add-cart="${c.id}" data-type="consola" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#070607;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:filter 160ms,transform 160ms;"
                onmouseenter="this.style.filter='brightness(1.1)';this.style.transform='translateY(-1px)'"
                onmouseleave="this.style.filter='none';this.style.transform='none'">+ Carrito</button>
            </div>
          </div>
        </article>
      `;
      }).join('')}
    </div>
  </div>`;
}

// ─── ADMIN PANEL ──────────────────────────────────────────────
function renderAdmin({ users, currentUser, vendorProducts, orders = [], sellerRequests = [] }) {
  return `
  <div style="max-width:var(--maxw);margin:0 auto;padding:32px 20px 60px;">
    <div style="margin-bottom:28px;">
      <span class="eyebrow">Panel de control</span>
      <h2 style="margin:0;font-size:2rem;font-weight:800;">Administrador</h2>
      <p style="margin:8px 0 0;color:var(--muted);font-size:14px;">Gestión de usuarios y productos de la tienda.</p>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:28px;">
      ${[
        { label: 'Total usuarios', value: users.length, color: 'var(--accent2)' },
        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'var(--accent)' },
        { label: 'Vendedores', value: users.filter(u => u.role === 'vendor').length, color: '#f5a623' },
        { label: 'Clientes', value: users.filter(u => u.role === 'client').length, color: '#a4d96f' },
        { label: 'Baneados', value: users.filter(u => u.banned).length, color: '#ff6b6b' },
        { label: 'Pedidos', value: orders.length, color: '#f5a623' }
      ].map(s => `
        <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:12px;padding:18px 20px;">
          <div style="font-size:28px;font-weight:800;color:${s.color};">${s.value}</div>
          <div style="font-size:12px;color:var(--muted);font-weight:600;margin-top:4px;">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.06));padding-bottom:0;">
      <button data-admin-tab="users" class="active-tab" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Usuarios</button>
      <button data-admin-tab="products" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Productos</button>
      <button data-admin-tab="orders" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Pedidos</button>
      <button data-admin-tab="seller-requests" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Solicitudes vendedor</button>
    </div>

    <!-- Users Panel -->
    <div data-admin-panel="users">
      <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:14px;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
          <h4 style="margin:0;font-size:14px;font-weight:700;color:#eef2f4;">Usuarios registrados</h4>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>${['ID','Nombre','Email','Teléfono','Rol','Estado','Registrado',''].map(h => `<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--muted);background:var(--surface2,rgba(255,255,255,0.02));border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.04));white-space:nowrap;">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${users.map((u, i) => `
                <tr style="border-bottom:${i < users.length-1 ? '1px solid rgba(255,255,255,0.03)' : 'none'};transition:background 160ms;${u.banned ? 'opacity:0.55;' : ''}"
                  onmouseenter="this.style.background='rgba(255,255,255,0.02)'" onmouseleave="this.style.background='transparent'">
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">#${u.id}</td>
                  <td style="padding:13px 16px;font-size:13.5px;font-weight:700;color:var(--text-strong,#eef2f4);white-space:nowrap;">${u.fullName}</td>
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">${u.email}</td>
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">${u.phone}</td>
                  <td style="padding:13px 16px;">
                    <select data-change-role="${u.id}" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:${u.role==='admin'?'var(--accent)':u.role==='vendor'?'var(--accent2)':'#a4d96f'};font-size:11px;font-weight:700;padding:4px 8px;cursor:pointer;font-family:inherit;"
                      ${u.id === currentUser?.id ? 'disabled' : ''}>
                      <option value="client" ${u.role==='client'?'selected':''}>Cliente</option>
                      <option value="vendor" ${u.role==='vendor'?'selected':''}>Vendedor</option>
                      <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
                    </select>
                  </td>
                  <td style="padding:13px 16px;">
                    <span style="display:inline-block;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;background:${u.banned ? 'rgba(255,0,47,0.12)' : 'rgba(164,217,111,0.12)'};color:${u.banned ? '#ff6b6b' : '#a4d96f'};">${u.banned ? 'Baneado' : 'Activo'}</span>
                  </td>
                  <td style="padding:13px 16px;font-size:12px;color:var(--muted);white-space:nowrap;">${u.createdAt}</td>
                  <td style="padding:13px 16px;white-space:nowrap;">
                    <button data-toggle-ban="${u.id}" ${u.id === currentUser?.id ? 'disabled' : ''} style="padding:5px 12px;border-radius:6px;font-size:11px;font-weight:700;cursor:${u.id === currentUser?.id ? 'not-allowed' : 'pointer'};font-family:inherit;
                      ${u.id === currentUser?.id
                        ? 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);color:var(--muted);'
                        : u.banned
                          ? 'background:rgba(164,217,111,0.1);border:1px solid rgba(164,217,111,0.25);color:#a4d96f;'
                          : 'background:rgba(255,0,47,0.08);border:1px solid rgba(255,0,47,0.2);color:#ff6b6b;'}">
                      ${u.banned ? 'Reactivar' : 'Banear'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Products Panel -->
    <div data-admin-panel="products" style="display:none;">
      <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:14px;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
          <h4 style="margin:0;font-size:14px;font-weight:700;color:#eef2f4;">Catálogo de productos</h4>
          <p style="margin:4px 0 0;font-size:12px;color:var(--muted);">Como administrador puedes eliminar productos del catálogo. La edición de precios queda a cargo del vendedor.</p>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>${['','Producto','Precio','Stock',''].map(h => `<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--muted);background:var(--surface2,rgba(255,255,255,0.02));border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.04));white-space:nowrap;">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${vendorProducts.length === 0 ? `<tr><td colspan="5" style="padding:24px 16px;text-align:center;font-size:13px;color:var(--muted);">No hay productos en el catálogo.</td></tr>` : vendorProducts.map((p, i) => `
                <tr style="border-bottom:${i < vendorProducts.length-1 ? '1px solid rgba(255,255,255,0.03)' : 'none'};transition:background 160ms;"
                  onmouseenter="this.style.background='rgba(255,255,255,0.02)'" onmouseleave="this.style.background='transparent'">
                  <td style="padding:8px 16px;"><img src="${p.image}" alt="${p.title}" style="width:44px;height:32px;object-fit:cover;border-radius:5px;" onerror="this.src='https://via.placeholder.com/44x32/111215/444?text=Img'"></td>
                  <td style="padding:13px 16px;font-size:13.5px;font-weight:700;color:var(--text-strong,#eef2f4);white-space:nowrap;">${p.title}</td>
                  <td style="padding:13px 16px;font-size:13.5px;font-weight:700;color:#a4d96f;white-space:nowrap;">$${p.price.toFixed(2)}</td>
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">${p.stock}</td>
                  <td style="padding:13px 16px;white-space:nowrap;">
                    <button data-delete-product="${p.id}" style="padding:5px 12px;background:rgba(255,0,47,0.08);border:1px solid rgba(255,0,47,0.2);border-radius:6px;color:#ff6b6b;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;transition:background 160ms;"
                      onmouseenter="this.style.background='rgba(255,0,47,0.14)'" onmouseleave="this.style.background='rgba(255,0,47,0.08)'">Eliminar</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div data-admin-panel="seller-requests" style="display:none;">
      <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:14px;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
          <h4 style="margin:0;font-size:14px;font-weight:700;color:var(--text-strong,#eef2f4);">Solicitudes para ser vendedor</h4>
          <p style="margin:5px 0 0;font-size:12px;color:var(--muted);">Revisa el producto y decide si apruebas o rechazas cada solicitud.</p>
        </div>
        <div style="padding:18px 20px;">
          ${sellerRequests.filter(r => r.status === 'pendiente').length === 0
            ? `<p style="margin:0;text-align:center;color:var(--muted);font-size:13px;padding:25px 0;">No hay solicitudes pendientes.</p>`
            : sellerRequests.filter(r => r.status === 'pendiente').map(r => `
              <article style="display:grid;grid-template-columns:minmax(180px,240px) 1fr;gap:18px;padding:16px 0;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
                <div>
                  ${r.product.image ? `<img src="${r.product.image}" alt="${r.product.title}" style="width:100%;height:150px;object-fit:cover;border-radius:9px;" onerror="this.style.display='none'">` : ''}
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                    <div>
                      <strong style="font-size:15px;color:var(--text-strong,#eef2f4);">${r.applicantName}</strong>
                      <div style="font-size:12px;color:var(--muted);">${r.email} · ${r.phone || 'Sin teléfono'}</div>
                    </div>
                    <span style="font-size:11px;font-weight:700;color:var(--accent2);text-transform:uppercase;">${r.saleType}</span>
                  </div>
                  <h5 style="margin:14px 0 5px;font-size:14px;color:var(--text-strong,#eef2f4);">${r.product.title}</h5>
                  <p style="margin:0 0 8px;font-size:12.5px;line-height:1.5;color:var(--muted);">${r.product.description}</p>
                  <div style="font-size:12.5px;color:var(--muted);">Precio: <strong style="color:#a4d96f;">$${Number(r.product.price).toFixed(2)}</strong> · Stock: ${r.product.stock}</div>
                  <div style="display:flex;gap:8px;margin-top:14px;">
                    <button data-approve-seller="${r.id}" style="padding:8px 13px;background:rgba(164,217,111,0.1);border:1px solid rgba(164,217,111,0.25);border-radius:7px;color:#a4d96f;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Aprobar</button>
                    <button data-reject-seller="${r.id}" style="padding:8px 13px;background:rgba(255,0,47,0.08);border:1px solid rgba(255,0,47,0.2);border-radius:7px;color:#ff6b6b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Rechazar</button>
                  </div>
                </div>
              </article>
            `).join('')}
        </div>
      </div>
    </div>
    <div data-admin-panel="orders" style="display:none;">
      <div style="background:var(--surface);border:1px solid var(--border-subtle);border-radius:14px;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle);"><h4 style="margin:0;font-size:14px;color:var(--text-strong);">Pedidos y estados</h4></div>
        <div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;"><thead><tr>${['Pedido','Cliente','Total','Pago','Estado'].map(h => `<th style="padding:10px 16px;text-align:left;color:var(--muted);font-size:11px;">${h}</th>`).join('')}</tr></thead><tbody>
          ${orders.length ? orders.map(order => { const buyer = users.find(user => user.id === order.buyerId); return `<tr style="border-top:1px solid var(--border-subtle);"><td style="padding:12px 16px;color:var(--text);font-size:12px;font-weight:700;">${order.id}</td><td style="padding:12px 16px;color:var(--muted);font-size:12px;">${buyer?.email || 'Cliente'}</td><td style="padding:12px 16px;color:#a4d96f;font-weight:700;">$${order.pricing.total.toFixed(2)}</td><td style="padding:12px 16px;color:var(--muted);font-size:12px;">${order.payment.method === 'qr' ? 'QR' : 'Efectivo'}</td><td style="padding:12px 16px;"><select data-order-status="${order.id}" class="order-status-select">${[['pending_payment','Pendiente'],['paid','Pagado'],['processing','Preparación'],['ready','Listo'],['delivered','Entregado'],['cancelled','Cancelado']].map(([value,label]) => `<option value="${value}" ${order.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select></td></tr>`; }).join('') : '<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--muted);font-size:13px;">Aún no hay pedidos.</td></tr>'}
        </tbody></table></div>
      </div>
    </div>
  </div>`;
}

// ─── VENDOR PANEL ─────────────────────────────────────────────
function renderVendor({ currentUser, vendorProducts, vendorSales, orders = [] }) {
  const liveSales = orders.flatMap(order => order.items.filter(item => item.vendorId === currentUser?.id).map(item => ({ id: order.id, game: item.title, buyer: order.buyerId, amount: item.unitPrice * item.qty, date: order.createdAt.slice(0, 10), status: order.status === 'delivered' ? 'completado' : order.status })));
  const sales = [...liveSales, ...vendorSales];
  const totalRevenue = sales.filter(s => s.status === 'completado').reduce((sum, s) => sum + s.amount, 0);

  return `
  <div style="max-width:var(--maxw);margin:0 auto;padding:32px 20px 60px;">
    <div style="margin-bottom:28px;">
      <span class="eyebrow">Panel de vendedor</span>
      <h2 style="margin:0;font-size:2rem;font-weight:800;">Mi Panel</h2>
      <p style="margin:8px 0 0;color:var(--muted);font-size:14px;">Hola, <strong style="color:var(--text-strong,#eef2f4);">${currentUser?.fullName}</strong> — gestiona tus productos y ventas.</p>
    </div>

    <!-- Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:28px;">
      ${[
        { label: 'Productos', value: vendorProducts.length, color: 'var(--accent2)' },
        { label: 'Total ventas', value: sales.length, color: '#f5a623' },
        { label: 'Completadas', value: sales.filter(s=>s.status==='completado').length, color: '#a4d96f' },
        { label: 'Ingresos', value: '$'+totalRevenue.toFixed(2), color: '#a4d96f' }
      ].map(s => `
        <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:12px;padding:18px 20px;">
          <div style="font-size:24px;font-weight:800;color:${s.color};">${s.value}</div>
          <div style="font-size:12px;color:var(--muted);font-weight:600;margin-top:4px;">${s.label}</div>
        </div>
      `).join('')}
    </div>

    <!-- Tabs -->
    <div style="display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.06));padding-bottom:0;">
      <button data-vendor-tab="products" class="active-tab" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Mis Productos</button>
      <button data-vendor-tab="sales" style="padding:10px 18px;background:none;border:none;border-bottom:2px solid transparent;color:var(--muted);font-weight:400;font-size:13.5px;cursor:pointer;font-family:inherit;margin-bottom:-1px;">Historial de Ventas</button>
    </div>

    <!-- Products Panel -->
    <div data-vendor-panel="products">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px;margin-bottom:20px;">
        ${vendorProducts.map(p => `
          <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:13px;overflow:hidden;">
            <img src="${p.image}" alt="${p.title}" style="width:100%;height:130px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/240x130/111215/444?text=Game'">
            <div style="padding:12px 14px 14px;">
              <div style="font-size:13.5px;font-weight:700;color:var(--text-strong,#eef2f4);margin-bottom:4px;">${p.title}</div>
              <div style="font-size:13px;color:#a4d96f;font-weight:700;margin-bottom:10px;">$${p.price.toFixed(2)}</div>
              <div style="font-size:11.5px;color:var(--muted);margin-bottom:10px;">Stock: ${p.stock} unidades</div>
              <div style="display:flex;gap:8px;">
                <button data-edit-product="${p.id}" style="flex:1;padding:7px;background:rgba(0,229,255,0.06);border:1px solid rgba(0,229,255,0.2);border-radius:7px;color:var(--accent2);font-size:12px;cursor:pointer;font-family:inherit;transition:background 160ms;"
                  onmouseenter="this.style.background='rgba(0,229,255,0.12)'" onmouseleave="this.style.background='rgba(0,229,255,0.06)'">Editar</button>
                <button data-delete-product="${p.id}" style="flex:1;padding:7px;background:rgba(255,0,47,0.08);border:1px solid rgba(255,0,47,0.2);border-radius:7px;color:#ff6b6b;font-size:12px;cursor:pointer;font-family:inherit;transition:background 160ms;"
                  onmouseenter="this.style.background='rgba(255,0,47,0.14)'" onmouseleave="this.style.background='rgba(255,0,47,0.08)'">Eliminar</button>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Add product card -->
        <div id="btn-add-product" style="background:var(--surface2,rgba(255,255,255,0.01));border:2px dashed var(--border,rgba(255,255,255,0.08));border-radius:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:240px;gap:10px;cursor:pointer;transition:border-color 200ms,background 200ms;"
          onmouseenter="this.style.borderColor='rgba(0,229,255,0.3)';this.style.background='rgba(0,229,255,0.03)'"
          onmouseleave="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.01)'">
          <div style="font-size:32px;opacity:0.4;">+</div>
          <div style="font-size:13px;color:var(--muted);font-weight:600;">Agregar producto</div>
        </div>
      </div>
    </div>

    <!-- Sales Panel -->
    <div data-vendor-panel="sales" style="display:none;">
      <div style="background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.05));border-radius:14px;overflow:hidden;">
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
          <h4 style="margin:0;font-size:14px;font-weight:700;color:#eef2f4;">Historial completo de ventas</h4>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr>${['#','Juego','Comprador','Monto','Fecha','Estado'].map(h => `<th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:var(--muted);background:var(--surface2,rgba(255,255,255,0.02));border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.04));white-space:nowrap;">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${sales.map((s, i) => `
                <tr style="border-bottom:${i < sales.length-1?'1px solid rgba(255,255,255,0.03)':'none'};transition:background 160ms;"
                  onmouseenter="this.style.background='rgba(255,255,255,0.02)'" onmouseleave="this.style.background='transparent'">
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">#${s.id}</td>
                  <td style="padding:13px 16px;font-size:13.5px;font-weight:600;color:var(--text-strong,#eef2f4);white-space:nowrap;">${s.game}</td>
                  <td style="padding:13px 16px;font-size:13px;color:var(--muted);">${s.buyer}</td>
                  <td style="padding:13px 16px;font-size:13.5px;font-weight:700;color:#a4d96f;white-space:nowrap;">$${s.amount.toFixed(2)}</td>
                  <td style="padding:13px 16px;font-size:12.5px;color:var(--muted);white-space:nowrap;">${s.date}</td>
                  <td style="padding:13px 16px;">
                    <span style="display:inline-block;padding:3px 9px;border-radius:5px;font-size:11px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;background:${s.status==='completado'?'rgba(164,217,111,0.12)':'rgba(245,166,35,0.12)'};color:${s.status==='completado'?'#a4d96f':'#f5a623'};">${s.status}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

// ─── CLIENT PROFILE ───────────────────────────────────────────
function renderProfile({ currentUser, favorites, orders, notifications, sellerRequests = [] }) {
  const favoriteKeys = favorites[currentUser.id] || [];
  const favoriteProducts = favoriteKeys.map(key => {
    const [type, rawId] = key.split('-');
    const id = +rawId;
    const product = type === 'game' ? GAMES.find(item => item.id === id) : CONSOLAS.find(item => item.id === id);
    return product ? { ...product, type, title: product.title || product.name } : null;
  }).filter(Boolean);
  const userOrders = orders.filter(order => order.buyerId === currentUser.id);
  const userNotifications = notifications.filter(note => note.userId === currentUser.id).slice(0, 5);
  const labels = { pending_payment: 'Pendiente de pago', paid: 'Pagado', processing: 'En preparación', ready: 'Listo', delivered: 'Entregado', cancelled: 'Cancelado' };
  return `
  <div class="profile-page">
    <div class="profile-heading"><span class="eyebrow">Cuenta de jugador</span><h2>Mi perfil</h2><p>Gestiona tus compras, favoritos y avisos de PixelStore.</p></div>
    ${currentUser.role === 'client' ? `
      <section class="profile-card" style="margin-bottom:18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <span class="eyebrow">Vendedores</span>
            <h3 style="margin:4px 0 5px;">¿Quieres vender en PixelStore?</h3>
            <p style="margin:0;color:var(--muted);font-size:13px;">
              Envía una solicitud con los datos del producto que quieres publicar.
            </p>
          </div>
          ${
            sellerRequests.some(r => r.userId === currentUser.id && r.status === 'pendiente')
              ? `<span style="padding:8px 12px;border-radius:8px;background:rgba(245,166,35,0.1);color:#f5a623;font-size:12px;font-weight:700;">Solicitud pendiente</span>`
              : `<button data-request-vendor class="btn-glow" type="button" style="padding:9px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#070607;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">Quiero ser vendedor</button>`
          }
        </div>
      </section>
    ` : ''}
    <div class="profile-grid">
      <aside class="profile-card">
        <div class="profile-avatar">${currentUser.fullName.slice(0, 1)}</div>
        <h3>${currentUser.fullName}</h3><p>${currentUser.email}</p>
        <dl><div><dt>Teléfono</dt><dd>${currentUser.phone || 'Sin registrar'}</dd></div><div><dt>Miembro desde</dt><dd>${currentUser.createdAt}</dd></div></dl>
      </aside>
      <section class="profile-card"><h3>Notificaciones</h3>
        ${userNotifications.length ? `<ul class="notification-list">${userNotifications.map(note => `<li><span></span>${note.text}<time>${new Date(note.createdAt).toLocaleDateString('es')}</time></li>`).join('')}</ul>` : '<p class="empty-copy">Aún no tienes notificaciones.</p>'}
      </section>
    </div>
    <section class="profile-section"><div class="section-title"><div><span class="eyebrow">Tu colección</span><h3>Favoritos</h3></div><span>${favoriteProducts.length} guardado${favoriteProducts.length === 1 ? '' : 's'}</span></div>
      ${favoriteProducts.length ? `<div class="favorite-grid">${favoriteProducts.map(product => `<article class="favorite-card"><img src="${product.image}" alt="${product.title}"><div><h4>${product.title}</h4><p>$${product.price.toFixed(2)}</p><button data-view-product="${product.type}-${product.id}">Ver producto</button></div></article>`).join('')}</div>` : '<p class="empty-copy">Guarda juegos o consolas con el botón Favorito para verlos aquí.</p>'}
    </section>
    <section class="profile-section"><div class="section-title"><div><span class="eyebrow">Compras</span><h3>Historial de pedidos</h3></div><span>${userOrders.length} pedido${userOrders.length === 1 ? '' : 's'}</span></div>
      ${userOrders.length ? `<div class="orders-list">${userOrders.map(order => `<article class="order-row"><div><strong>${order.id}</strong><span>${new Date(order.createdAt).toLocaleDateString('es')} · ${order.items.reduce((qty, item) => qty + item.qty, 0)} artículo(s)</span></div><div class="order-row__items">${order.items.map(item => item.title).join(', ')}</div><span class="order-status status-${order.status}">${labels[order.status] || order.status}</span><strong>$${order.pricing.total.toFixed(2)}</strong></article>`).join('')}</div>` : '<p class="empty-copy">Tus pedidos aparecerán aquí al finalizar una compra.</p>'}
    </section>
  </div>`;
}