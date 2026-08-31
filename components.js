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

      <!-- Search with Live Autocomplete -->
      <div class="search-wrapper-rel">
        <form id="search-form" class="search-form" style="display:flex;align-items:center;width:100%;border-radius:8px;min-width:0;" autocomplete="off">
          <span style="padding:0 10px;flex-shrink:0;display:flex;align-items:center;"><svg width="18" height="17" viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg" style="display:block;"><circle cx="136" cy="139" r="84" fill="none" stroke="#9aa1a6" stroke-width="16"/><path d="M 86 169 C 78 148 81 123 92 105 C 103 87 120 76 140 73" fill="none" stroke="#9aa1a6" stroke-width="14" stroke-linecap="round"/><path d="M 195 198 L 218 221 L 201 238 L 178 215 Z" fill="#9aa1a6"/><path d="M 210 214 L 278 282 C 286 290 286 303 278 311 L 269 320 C 261 328 248 328 240 320 L 172 252 C 164 244 164 231 172 223 L 181 214 C 189 206 202 206 210 214 Z" fill="#9aa1a6"/><path d="M 202 226 L 267 291 C 271 295 271 301 267 305 L 263 309 C 267 303 267 298 262 293 L 197 228 Z" fill="#ffffff"/><path d="M 248 318 C 255 325 264 325 271 319 L 278 312 C 285 305 285 296 279 290 L 268 300 C 273 305 273 310 268 315 L 263 320 C 258 324 252 323 248 318 Z" fill="#9aa1a6"/></svg></span>
          <input id="search-input" type="search" placeholder="Buscar juegos, consolas..." style="flex:1;min-width:0;padding:9px 8px;background:transparent;border:none;color:var(--text);font-size:13.5px;font-family:inherit;outline:none;" autocomplete="off"
            onfocus="this.closest('.search-form').classList.add('search-focused')"
            onblur="this.closest('.search-form').classList.remove('search-focused')" />
          <button type="submit" style="margin:3px;padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:6px;color:#ffffff;font-weight:700;font-size:12px;cursor:pointer;flex-shrink:0;font-family:inherit;transition:filter 160ms;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
            onmouseenter="this.style.filter='brightness(1.1)'"
            onmouseleave="this.style.filter='none'">Buscar</button>
        </form>
        <div id="search-autocomplete-box" class="search-autocomplete-dropdown" style="display:none;"></div>
      </div>

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
          ${isLight ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
        ${currentUser?.role === 'client' ? `
          <button data-request-vendor class="btn-glow" type="button" style="padding:7px 12px;background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.08));border-radius:8px;color:var(--text-strong,#eef2f4);font-size:12px;cursor:pointer;font-family:inherit;font-weight:700;">
            Ser vendedor
          </button>
        ` : ''}
        ${currentUser ? `
          <div style="display:flex;align-items:center;gap:8px;padding:4px 10px;background:var(--surface2,rgba(255,255,255,0.03));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:10px;margin-right:2px;">
            <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:800;font-size:11.5px;text-transform:uppercase;box-shadow:0 0 8px rgba(var(--accent-rgb),0.3);flex-shrink:0;">
              ${(currentUser.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.2;">
              <span style="font-size:12.5px;font-weight:700;color:var(--text-strong,#fff);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${currentUser.fullName.split(' ')[0]}</span>
              <span style="font-size:9.5px;font-weight:800;letter-spacing:0.6px;text-transform:uppercase;color:${roleColor};">${ROLE_LABELS[currentUser.role] || currentUser.role}</span>
            </div>
          </div>
          <button id="btn-logout" style="padding:7px 14px;background:transparent;border:1px solid var(--border-subtle,rgba(255,255,255,0.08));border-radius:8px;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;transition:color 160ms,border-color 160ms;"
            onmouseenter="this.style.color='var(--text-strong,#fff)';this.style.borderColor='rgba(255,0,47,0.4)'"
            onmouseleave="this.style.color='var(--muted)';this.style.borderColor='var(--border-subtle,rgba(255,255,255,0.08))'">Salir</button>
        ` : `
          <button id="btn-login" class="btn-glow" style="padding:7px 14px;background:var(--surface);border:1px solid var(--border-subtle,rgba(255,255,255,0.08));border-radius:8px;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit;font-weight:500;">Iniciar sesión</button>
          <button id="btn-register" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#ffffff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;text-shadow:0 1px 2px rgba(0,0,0,0.3);">Registrarse</button>
        `}
        <button id="btn-cart" class="cart-trigger" aria-label="Abrir carrito${cartCount ? `, ${cartCount} productos` : ''}" style="padding:7px 14px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);font-size:13px;cursor:pointer;font-family:inherit;font-weight:600;flex-shrink:0;position:relative;transition:border-color 200ms;display:inline-flex;align-items:center;gap:6px;"
          onmouseenter="this.style.borderColor='rgba(0,229,255,0.3)'"
          onmouseleave="this.style.borderColor='var(--border-subtle,rgba(255,255,255,0.07))'">
          <svg width="22" height="16" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 3px rgba(var(--accent2-rgb),0.5));"><path d="M34 43 H61 L69 67" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"><path d="M27 67 H52"/><path d="M22 82 H50"/><path d="M28 98 H51"/></g><path d="M68 67 H264 L238 132 Q235 139 226 139 H96 Q88 139 85 132 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M88 139 L99 159 H230" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M99 159 C90 159 85 165 85 173 C85 181 91 185 101 185 H228" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><circle cx="104" cy="199" r="12" fill="currentColor"/><circle cx="221" cy="199" r="12" fill="currentColor"/></svg>${cartCount > 0 ? `<span style="background:var(--accent);color:#fff;font-size:10px;font-weight:800;padding:1px 5px;border-radius:999px;">${cartCount}</span>` : ''}
        </button>
      </div>
    </div>
  </header>`;
}

// ─── FOOTER ──────────────────────────────────────────────────
function renderFooter() {
  const year = new Date().getFullYear();
  return `
  <footer style="position:relative;background:var(--bg);color:var(--muted);margin-top:60px;padding:48px 0 24px;isolation:isolate;">
    <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,0,47,0.35),rgba(0,229,255,0.35),transparent);"></div>
    
    <div style="max-width:var(--maxw);margin:0 auto;padding:0 20px;">
      
      <!-- ── Barra de Confianza Gamer (Trust Badges) ── -->
      <div class="trust-badges-grid">
        
        <div class="trust-badge badge-red">
          <div class="trust-badge-icon icon-red">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div class="trust-badge-title">Entrega Inmediata</div>
            <div class="trust-badge-sub">Códigos y descargas al instante</div>
          </div>
        </div>

        <div class="trust-badge badge-cyan">
          <div class="trust-badge-icon icon-cyan">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div class="trust-badge-title">Pago 100% Seguro</div>
            <div class="trust-badge-sub">Transacciones protegidas</div>
          </div>
        </div>

        <div class="trust-badge badge-green">
          <div class="trust-badge-icon icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
          </div>
          <div>
            <div class="trust-badge-title">Garantía Original</div>
            <div class="trust-badge-sub">Juegos y consolas oficiales</div>
          </div>
        </div>

        <div class="trust-badge badge-gold">
          <div class="trust-badge-icon icon-gold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div class="trust-badge-title">Soporte Gamer</div>
            <div class="trust-badge-sub">Asistencia rápida y directa</div>
          </div>
        </div>

      </div>

      <!-- ── Columnas de Navegación e Información ── -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:32px 24px;padding-bottom:32px;">
        
        <!-- Marca y descripción -->
        <div style="grid-column:span 2;max-width:380px;">
          <h5 style="margin:0 0 10px;font-size:18px;font-weight:800;letter-spacing:0.4px;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;display:inline-block;">PixelStore</h5>
          <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:var(--muted);">Tu tienda de confianza para videojuegos digitales y físicos. Juega más, paga menos.</p>
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#a4d96f;box-shadow:0 0 8px #a4d96f;"></span>
            <span style="font-size:12px;font-weight:600;color:var(--text-strong,#fff);">Servidores y catálogo activos</span>
          </div>
        </div>

        <!-- Tienda -->
        <div>
          <h6 style="margin:0 0 14px;font-size:11.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Tienda</h6>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;">
            <li><button data-nav="store" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent2)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">🎮 Juegos destacados</button></li>
            <li><button data-nav="store" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent2)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">🔥 Ofertas de la semana</button></li>
            <li><button data-nav="consolas" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent2)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">🕹️ Consolas y hardware</button></li>
            <li><button data-nav="store" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent2)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">⚡ Novedades</button></li>
          </ul>
        </div>

        <!-- Soporte -->
        <div>
          <h6 style="margin:0 0 14px;font-size:11.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Soporte</h6>
          <ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;">
            <li><button onclick="if(typeof showToast==='function')showToast('💬 Contacta a soporte en soporte@pixelstore.com');" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">Centro de Ayuda</button></li>
            <li><button onclick="if(typeof showToast==='function')showToast('📱 WhatsApp de atención: +591 7000-0000');" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">Contacto</button></li>
            <li><button onclick="if(typeof showToast==='function')showToast('📄 Compras 100% garantizadas y protegidas');" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">Términos de servicio</button></li>
            <li><button onclick="if(typeof showToast==='function')showToast('🔒 Tus datos personales están seguros');" style="background:none;border:none;padding:0;font-size:13px;color:var(--muted);cursor:pointer;font-family:inherit;transition:all 160ms ease;text-align:left;" onmouseenter="this.style.color='var(--accent)';this.style.transform='translateX(4px)'" onmouseleave="this.style.color='var(--muted)';this.style.transform='none'">Privacidad</button></li>
          </ul>
        </div>

        <!-- Comunidad / Redes -->
        <div>
          <h6 style="margin:0 0 14px;font-size:11.5px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-strong,#eef2f4);">Comunidad</h6>
          <div style="display:flex;flex-wrap:wrap;gap:10px;">
            
            <!-- Discord -->
            <a href="https://discord.com" target="_blank" rel="noopener" title="Discord" style="width:38px;height:38px;border-radius:10px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;transition:all 180ms ease;" onmouseenter="this.style.borderColor='#5865F2';this.style.color='#5865F2';this.style.boxShadow='0 0 12px rgba(88,101,242,0.3)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='var(--border-subtle)';this.style.color='var(--muted)';this.style.boxShadow='none';this.style.transform='none'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
            </a>

            <!-- Twitter / X -->
            <a href="https://twitter.com" target="_blank" rel="noopener" title="X (Twitter)" style="width:38px;height:38px;border-radius:10px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;transition:all 180ms ease;" onmouseenter="this.style.borderColor='var(--text-strong)';this.style.color='var(--text-strong)';this.style.boxShadow='0 0 12px rgba(255,255,255,0.2)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='var(--border-subtle)';this.style.color='var(--muted)';this.style.boxShadow='none';this.style.transform='none'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            <!-- Instagram -->
            <a href="https://instagram.com" target="_blank" rel="noopener" title="Instagram" style="width:38px;height:38px;border-radius:10px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;transition:all 180ms ease;" onmouseenter="this.style.borderColor='#E1306C';this.style.color='#E1306C';this.style.boxShadow='0 0 12px rgba(225,48,108,0.3)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='var(--border-subtle)';this.style.color='var(--muted)';this.style.boxShadow='none';this.style.transform='none'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>

            <!-- YouTube -->
            <a href="https://youtube.com" target="_blank" rel="noopener" title="YouTube" style="width:38px;height:38px;border-radius:10px;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;transition:all 180ms ease;" onmouseenter="this.style.borderColor='#FF0000';this.style.color='#FF0000';this.style.boxShadow='0 0 12px rgba(255,0,0,0.3)';this.style.transform='translateY(-2px)'" onmouseleave="this.style.borderColor='var(--border-subtle)';this.style.color='var(--muted)';this.style.boxShadow='none';this.style.transform='none'">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>

          </div>
        </div>

      </div>

      <!-- ── Pie Inferior: Copyright y Métodos de Pago ── -->
      <div style="border-top:1px solid var(--border-subtle,rgba(255,255,255,0.06));padding-top:20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;font-size:12.5px;">
        <p style="margin:0;color:var(--muted);">© ${year} <strong style="color:var(--text-strong,#fff);font-weight:700;">PixelStore</strong> – Todos los derechos reservados.</p>
        
        <!-- Métodos de pago -->
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:11.5px;color:var(--muted);margin-right:4px;">Métodos de pago:</span>
          <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;background:var(--surface2,rgba(255,255,255,0.03));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));font-size:11px;color:var(--text-strong,#fff);font-weight:600;">💳 Tarjeta de Crédito/Débito</span>
          <span style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:6px;background:var(--surface2,rgba(255,255,255,0.03));border:1px solid var(--border-subtle,rgba(255,255,255,0.08));font-size:11px;color:var(--text-strong,#fff);font-weight:600;">📱 QR Bancario</span>
        </div>
      </div>

    </div>
  </footer>`;
}

// ─── CART SIDEBAR ─────────────────────────────────────────────
function renderCart(cart, open, paymentMethod = 'card') {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  // Cambia esta URL por tu archivo, por ejemplo: 'assets/mi-qr.png'.
  // Es solo una imagen de muestra; PixelStore no genera ni procesa códigos QR reales.
  const QR_PAYMENT_IMAGE = 'https://placehold.co/280x280/111215/00e5ff?text=Tu+imagen+QR';
  const paymentOptions = [
    {
      id: 'card',
      label: 'Tarjeta',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>`
    },
    {
      id: 'qr',
      label: 'Código QR',
      icon: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><circle cx="6.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="6.5" r="1.5"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="17.5" cy="17.5" r="1.5"/></svg>`
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
              <p>Escanea el código con tu app bancaria para transferir directamente.</p>
            </div>` : `
            <div class="card-payment-preview">
              <div class="card-payment-header">
                <span class="card-payment-title">Pago seguro con tarjeta</span>
                <div class="card-brands">
                  <div class="card-brand-pill" id="brand-badge-visa" title="Visa">
                    <svg viewBox="0 0 36 22" width="34" height="20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="36" height="22" rx="3.5" fill="#0E4595"/>
                      <path d="M14.7 15.6h-2.3L13.8 6.4h2.3l-1.4 9.2zm9.3-8.9c-.5-.2-1.2-.4-2.1-.4-2.3 0-3.9 1.2-3.9 3 0 1.3 1.2 2 2.1 2.5.9.5 1.2.8 1.2 1.2 0 .6-.8 1-1.5 1-1 0-1.6-.2-2.5-.6l-.3-.2-.4 2.3c.7.3 1.8.6 2.9.6 2.5 0 4.1-1.2 4.1-3.2 0-1.1-.7-1.9-2.1-2.6-.9-.4-1.4-.7-1.4-1.1 0-.4.4-.8 1.4-.8.8 0 1.4.2 1.8.4l.2.1.5-2.2zm5.4 0h-1.8c-.6 0-1 .2-1.2.7l-3.4 8.2h2.5l.5-1.4h3.1l.3 1.4h2.2l-2.2-8.9zm-2.9 5.6l1.3-3.6.7 3.6h-2zm-14.7-5.6l-2.2 6.2-.2-1.2c-.4-1.4-1.7-2.9-3.1-3.7l2 7.7h2.5l3.7-9h-2.7z" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div class="card-brand-pill" id="brand-badge-mc" title="Mastercard">
                    <svg viewBox="0 0 36 22" width="34" height="20" xmlns="http://www.w3.org/2000/svg">
                      <rect width="36" height="22" rx="3.5" fill="#1C1F26"/>
                      <circle cx="14" cy="11" r="6" fill="#EB001B"/>
                      <circle cx="22" cy="11" r="6" fill="#F79E1B"/>
                      <path d="M18 6.4a5.95 5.95 0 0 0-3.6 4.6 5.95 5.95 0 0 0 3.6 4.6 5.95 5.95 0 0 0 3.6-4.6 5.95 5.95 0 0 0-3.6-4.6z" fill="#FF5F00" opacity="0.95"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="card-fields">
                <input type="text" id="card-holder-name" class="card-field-input" placeholder="Nombre en la tarjeta (Ej: Juan Pérez)" autocomplete="cc-name" />
                <input type="text" id="card-number" class="card-field-input" placeholder="Número de tarjeta (16 dígitos)" maxlength="19" autocomplete="cc-number" inputmode="numeric" />
                <div class="card-fields-row">
                  <input type="text" id="card-expiry" class="card-field-input" placeholder="MM/AA" maxlength="5" autocomplete="cc-exp" inputmode="numeric" />
                  <input type="password" id="card-cvv" class="card-field-input" placeholder="CVV" maxlength="4" autocomplete="cc-csc" inputmode="numeric" />
                </div>
                <button type="button" id="btn-fill-demo-card" style="margin-top:6px;padding:6px 10px;background:rgba(0,229,255,0.08);border:1px dashed rgba(0,229,255,0.3);border-radius:6px;color:var(--accent2);font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;width:100%;text-align:center;transition:background 160ms;">
                  🪄 Rellenar con tarjeta de prueba (4532... / 12/28 / 789)
                </button>
              </div>
              <p class="card-security-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Transacción protegida con cifrado SSL de 256 bits.
              </p>
            </div>`}
        </section>
      ` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <span style="font-size:14px;color:var(--muted);">Total</span>
        <span style="font-size:18px;font-weight:800;color:#a4d96f;">$${total.toFixed(2)}</span>
      </div>
      <button id="btn-checkout" style="width:100%;padding:12px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:10px;color:#ffffff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:filter 160ms,transform 160ms;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
        onmouseenter="this.style.filter='brightness(1.08)';this.style.transform='translateY(-2px)'"
        onmouseleave="this.style.filter='none';this.style.transform='none'">
        ${cart.length === 0 ? 'Carrito vacío' : 'Finalizar compra →'}
      </button>
      ${cart.length > 0 ? '<p class="checkout-note">Recibirás una confirmación cuando tu pedido esté listo.</p>' : ''}
    </div>
  </aside>`;
}

// ─── LOGIN MODAL ───────────────────────────────────────────────
function renderLoginModal() {
  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:120;">
    <div class="modal-box" style="max-width:440px;" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:16px;font-family:inherit;">×</button>
      <h2 id="login-title" style="margin:0 0 6px;font-size:1.4rem;font-weight:800;background:linear-gradient(90deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;">Iniciar sesión</h2>
      <p style="margin:0 0 20px;color:var(--muted);font-size:13.5px;">Ingresa con tu cuenta de PixelStore.</p>
      
      <div id="login-error" style="display:none;margin-bottom:14px;padding:10px 12px;background:rgba(255,20,20,0.1);color:#ffb7b7;border-radius:8px;font-size:13px;"></div>

      <form id="login-form" autocomplete="off">
        <div style="margin-bottom:14px;">
          <label class="field-label">Usuario o correo</label>
          <input id="login-user" type="text" class="field-input" placeholder="usuario o correo@gmail.com" />
        </div>
        <div style="margin-bottom:18px;">
          <label class="field-label">Contraseña</label>
          <div style="display:flex;gap:8px;">
            <input id="login-pass" type="password" class="field-input" placeholder="contraseña" style="flex:1;" />
            <button type="button" data-toggle-pass="login-pass" style="width:42px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:var(--surface2,rgba(255,255,255,0.02));border:1px solid var(--border-subtle,rgba(255,255,255,0.09));border-radius:8px;cursor:pointer;padding:0;transition:border-color 160ms;"
              onmouseenter="this.style.borderColor='rgba(0,229,255,0.35)'"
              onmouseleave="this.style.borderColor='rgba(255,255,255,0.09)'">
              <svg class="eye-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" width="22" height="14" style="display:block;"><path d="M18 60 C38 29 66 14 100 14 C134 14 162 29 182 60 C162 91 134 106 100 106 C66 106 38 91 18 60 Z" fill="#9aa1a6"/><path d="M30 60 C48 37 71 26 100 26 C129 26 152 37 170 60 C152 83 129 94 100 94 C71 94 48 83 30 60 Z" fill="#1a1b1f"/><circle cx="100" cy="60" r="30" fill="#9aa1a6"/><circle cx="100" cy="60" r="16" fill="#1a1b1f"/></svg>
            </button>
          </div>
        </div>
        <button type="submit" style="width:100%;padding:11px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:9px;color:#ffffff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;letter-spacing:0.3px;transition:filter 160ms ease,transform 160ms ease;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
          onmouseenter="this.style.filter='brightness(1.08)';this.style.transform='translateY(-2px)'"
          onmouseleave="this.style.filter='none';this.style.transform='none'">Iniciar sesión</button>
      </form>

      <p style="margin:16px 0 0;text-align:center;font-size:13px;color:var(--muted);">
        ¿No tienes cuenta?&nbsp;
        <button id="btn-switch-register" style="background:none;border:none;color:var(--accent2);cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;padding:0;">Regístrate gratis</button>
      </p>

      <!-- Demo accounts -->
      <div style="margin-top:20px;padding-top:18px;border-top:1px solid var(--border-subtle,rgba(255,255,255,0.07));">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.9px;text-transform:uppercase;color:var(--text-sub,#cfd6db);font-weight:700;margin-bottom:10px;">Cuentas demo</div>
        <ul style="list-style:none;margin:0;padding:0;">
          ${DEMO_ACCOUNTS.map(acc => `
          <li style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-subtle,rgba(255,255,255,0.05));">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text-strong,#f2f5f7);">${acc.label}</div>
              <div style="font-size:11.5px;color:var(--muted);margin-top:2px;">${acc.username}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
              <div style="font-size:11px;color:var(--muted);">${acc.password}</div>
              <button data-demo="${acc.role}" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border,rgba(255,255,255,0.1));background:transparent;color:var(--muted);font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;transition:background 160ms,color 160ms;"
                onmouseenter="this.style.background='linear-gradient(90deg,var(--accent),var(--accent2))';this.style.color='#ffffff';this.style.borderColor='transparent'"
                onmouseleave="this.style.background='transparent';this.style.color='var(--muted)';this.style.borderColor='var(--border,rgba(255,255,255,0.1))'">Usar</button>
            </div>
          </li>`).join('')}
        </ul>
      </div>
    </div>
  </div>`;
}

// ─── REGISTER MODAL ────────────────────────────────────────────
function renderRegisterModal() {
  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:120;">
    <div class="modal-box" style="max-width:460px;" role="dialog" aria-modal="true" aria-labelledby="register-title">
      <div style="position:absolute;top:0;left:10%;right:10%;height:2px;border-radius:0 0 4px 4px;background:linear-gradient(90deg,var(--accent),var(--accent2));"></div>
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:16px;font-family:inherit;">×</button>
      <h2 id="register-title" style="margin:0 0 4px;font-size:1.4rem;font-weight:800;background:linear-gradient(90deg,var(--accent2),var(--accent));-webkit-background-clip:text;background-clip:text;color:transparent;">Crear cuenta</h2>
      <p style="margin:0 0 22px;color:var(--muted);font-size:13.5px;">Regístrate para acceder a toda la tienda.</p>

      <div id="reg-error" style="display:none;margin-bottom:14px;padding:10px 12px;background:rgba(255,20,20,0.1);color:#ffb7b7;border-radius:8px;font-size:13px;border-left:3px solid rgba(255,0,47,0.5);"></div>

      <form id="register-form" autocomplete="off">
        <div style="margin-bottom:14px;">
          <label class="field-label" for="reg-fullname">Nombre Completo</label>
          <input id="reg-fullname" type="text" class="field-input" placeholder="Tu nombre y apellido" />
        </div>
        <div style="margin-bottom:14px;">
          <label class="field-label" for="reg-phone">Teléfono</label>
          <input id="reg-phone" type="tel" class="field-input" placeholder="Ej: 9900-1234" />
        </div>
        <div style="margin-bottom:14px;">
          <label class="field-label" for="reg-email">Cuenta Gmail</label>
          <input id="reg-email" type="email" class="field-input" placeholder="tucuenta@gmail.com" />
        </div>
        <div style="margin-bottom:14px;">
          <label class="field-label" for="reg-password">Contraseña</label>
          <div style="display:flex;gap:8px;">
            <input id="reg-password" type="password" class="field-input" placeholder="Mínimo 6 caracteres" style="flex:1;" />
            <button type="button" data-toggle-pass="reg-password" style="width:42px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.02));border:1px solid var(--border-subtle,rgba(255,255,255,0.09));border-radius:8px;cursor:pointer;padding:0;transition:border-color 160ms;"
              onmouseenter="this.style.borderColor='rgba(0,229,255,0.35)'"
              onmouseleave="this.style.borderColor='rgba(255,255,255,0.09)'">
              <svg class="eye-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" width="22" height="14" style="display:block;"><path d="M18 60 C38 29 66 14 100 14 C134 14 162 29 182 60 C162 91 134 106 100 106 C66 106 38 91 18 60 Z" fill="#9aa1a6"/><path d="M30 60 C48 37 71 26 100 26 C129 26 152 37 170 60 C152 83 129 94 100 94 C71 94 48 83 30 60 Z" fill="#1a1b1f"/><circle cx="100" cy="60" r="30" fill="#9aa1a6"/><circle cx="100" cy="60" r="16" fill="#1a1b1f"/></svg>
            </button>
          </div>
          <div class="strength-bar">
            <div class="strength-segment"></div>
            <div class="strength-segment"></div>
            <div class="strength-segment"></div>
            <div class="strength-segment"></div>
            <span id="strength-label" style="font-size:10px;color:var(--muted);margin-left:4px;flex-shrink:0;"></span>
          </div>
        </div>
        <div style="margin-bottom:20px;">
          <label class="field-label" for="reg-confirm">Repetir Contraseña</label>
          <div style="display:flex;gap:8px;">
            <input id="reg-confirm" type="password" class="field-input" placeholder="Repite tu contraseña" style="flex:1;" />
            <button type="button" data-toggle-pass="reg-confirm" style="width:42px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.02));border:1px solid var(--border-subtle,rgba(255,255,255,0.09));border-radius:8px;cursor:pointer;padding:0;transition:border-color 160ms;"
              onmouseenter="this.style.borderColor='rgba(0,229,255,0.35)'"
              onmouseleave="this.style.borderColor='rgba(255,255,255,0.09)'">
              <svg class="eye-icon" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" width="22" height="14" style="display:block;"><path d="M18 60 C38 29 66 14 100 14 C134 14 162 29 182 60 C162 91 134 106 100 106 C66 106 38 91 18 60 Z" fill="#9aa1a6"/><path d="M30 60 C48 37 71 26 100 26 C129 26 152 37 170 60 C152 83 129 94 100 94 C71 94 48 83 30 60 Z" fill="#1a1b1f"/><circle cx="100" cy="60" r="30" fill="#9aa1a6"/><circle cx="100" cy="60" r="16" fill="#1a1b1f"/></svg>
            </button>
          </div>
          <p id="confirm-hint" style="margin:5px 0 0;font-size:11.5px;"></p>
        </div>
        <button type="submit" style="width:100%;padding:12px;background:linear-gradient(90deg,var(--accent2),var(--accent));border:none;border-radius:9px;color:#ffffff;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;letter-spacing:0.3px;transition:filter 160ms ease,transform 160ms ease;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
          onmouseenter="this.style.filter='brightness(1.08)';this.style.transform='translateY(-2px)'"
          onmouseleave="this.style.filter='none';this.style.transform='none'">Crear mi cuenta</button>
      </form>

      <p style="margin:16px 0 0;text-align:center;font-size:13px;color:var(--muted);">
        ¿Ya tienes cuenta?&nbsp;
        <button id="btn-switch-login" style="background:none;border:none;color:var(--accent);cursor:pointer;font-family:inherit;font-size:13px;font-weight:600;padding:0;">Iniciar sesión</button>
      </p>
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

        <button type="submit" style="width:100%;padding:11px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:9px;color:#ffffff;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;text-shadow:0 1px 2px rgba(0,0,0,0.3);">
          Enviar solicitud
        </button>
      </form>
    </div>
  </div>`;
}

function renderProductModal(product, type, reviews, currentUser, favorites = {}, activeTab = 'desc') {
  if (!product) return '';
  const isGame = type === 'game';
  const name = isGame ? product.title : product.name;
  const category = isGame ? product.genreLabel : ('Consola · ' + product.brand);
  const rating = avgRating(reviews);
  const favorite = currentUser && (favorites[currentUser.id] || []).includes(`${type}-${product.id}`);
  const related = (isGame
    ? GAMES.filter(item => item.id !== product.id && item.genres.some(genre => product.genres?.includes(genre)))
    : CONSOLAS.filter(item => item.id !== product.id && item.brand === product.brand)
  ).slice(0, 3);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : (product.discount || 0);
  const savings = product.originalPrice ? (product.originalPrice - product.price).toFixed(2) : 0;

  function getInitials(nameStr) {
    if (!nameStr) return 'G';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:130;">
    <div class="modal-box product-detail-modal" role="dialog" aria-modal="true" aria-labelledby="product-title">
      
      <!-- Fondo dinámico con glow ambiental -->
      <div class="modal-ambient-glow" style="background-image: url('${product.image}');"></div>

      <!-- Botón Cerrar -->
      <button id="btn-close-modal" class="modal-btn-close" aria-label="Cerrar modal">✕</button>

      <div class="modal-inner-content">
        <!-- Hero: Portada y Bloque de Compra -->
        <div class="pdetail-hero">
          
          <!-- Columna Izquierda: Portada + Detalles Rápidos -->
          <div class="pdetail-media-column">
            <!-- Portada con Badges -->
            <div class="pdetail-cover-wrapper">
              <img src="${product.image}" alt="${name}" class="pdetail-cover-img" onerror="this.src='https://via.placeholder.com/460x215/111215/444?text=${isGame ? 'Game' : 'Consola'}'">
              ${discountPercent > 0 ? `<div class="pdetail-badge-discount">🔥 -${discountPercent}%</div>` : ''}
              <div class="pdetail-badge-instant">⚡ Entrega Inmediata</div>
            </div>

            <!-- Mini Ficha de Verificación & Soporte -->
            <div class="pdetail-quick-box">
              <div class="pdetail-quick-item">
                <span class="pdetail-quick-icon">🌐</span>
                <div class="pdetail-quick-text">
                  <span class="pdetail-quick-label">Idioma y Región</span>
                  <span class="pdetail-quick-val">Español / Multilenguaje · Global</span>
                </div>
              </div>
              <div class="pdetail-quick-item">
                <span class="pdetail-quick-icon">👥</span>
                <div class="pdetail-quick-text">
                  <span class="pdetail-quick-label">Modalidad</span>
                  <span class="pdetail-quick-val">${isGame ? '1 Jugador · Coop Online' : 'Hardware Original'}</span>
                </div>
              </div>
              <div class="pdetail-quick-item">
                <span class="pdetail-quick-icon">🏪</span>
                <div class="pdetail-quick-text">
                  <span class="pdetail-quick-label">Vendido por</span>
                  <span class="pdetail-quick-val">PixelStore Oficial <span style="color:#f5a623;font-size:11px;font-weight:800;">★ 4.9</span></span>
                </div>
              </div>
            </div>

            <!-- Tags rápidos de compatibilidad -->
            <div class="pdetail-feature-pills">
              <span class="pdetail-feature-pill">🕹️ Mando compatible</span>
              <span class="pdetail-feature-pill">☁️ Cloud Save</span>
            </div>
          </div>

          <!-- Info y Acciones -->
          <div class="pdetail-info">
            <div class="pdetail-tag-row">
              <span class="pdetail-chip">🏷️ ${category}</span>
              <span class="pdetail-chip-stock"><span class="pdetail-stock-dot"></span> En Stock</span>
            </div>

            <h2 id="product-title" class="pdetail-title">${name}</h2>

            <!-- Rating bar -->
            <div class="pdetail-rating-row">
              ${renderStars(rating, '15px')}
              <span class="pdetail-score-pill">${rating ? rating.toFixed(1) : 'Nuevo'}</span>
              <span class="pdetail-review-meta">${reviews.length ? `(${reviews.length} reseña${reviews.length === 1 ? '' : 's'})` : 'Sin reseñas'}</span>
            </div>

            <!-- Price Box -->
            <div class="pdetail-price-box">
              <span class="pdetail-price-current">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `<span class="pdetail-price-old">$${product.originalPrice.toFixed(2)}</span>` : ''}
              ${savings > 0 ? `<span class="pdetail-price-saving">Ahorras $${savings}</span>` : ''}
            </div>

            <!-- CTA Buttons -->
            <div class="pdetail-actions">
              <button data-add-cart="${product.id}" data-type="${type}" class="pdetail-btn-cart">
                <span>🛒</span> Añadir al carrito
              </button>
              <button data-buy-now="${product.id}" data-type="${type}" class="pdetail-btn-buynow">
                <span>⚡</span> Comprar ya
              </button>
              <button type="button" data-favorite="${product.id}" data-type="${type}" class="pdetail-btn-fav ${favorite ? 'is-active' : ''}" aria-label="${favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
                ${favorite ? '♥ Guardado' : '♡ Favorito'}
              </button>
            </div>

            <!-- Micro Garantías -->
            <div class="pdetail-trust-bar">
              <span>🛡️ Garantía PixelStore</span>
              <span>⚡ Activación instantánea</span>
              <span>🔒 Pago 100% seguro</span>
            </div>
          </div>
        </div>

        <!-- Ficha Técnica Rápida con Iconos -->
        <div class="pdetail-specs-grid">
          <div class="pdetail-spec-card">
            <div class="pdetail-spec-icon">🎮</div>
            <div>
              <div class="pdetail-spec-label">${isGame ? 'Plataforma' : 'Marca'}</div>
              <div class="pdetail-spec-val">${isGame ? (product.platform || 'Multiplataforma') : product.brand}</div>
            </div>
          </div>
          <div class="pdetail-spec-card">
            <div class="pdetail-spec-icon">🏢</div>
            <div>
              <div class="pdetail-spec-label">Desarrollador</div>
              <div class="pdetail-spec-val">${product.developer || 'Estudio Oficial'}</div>
            </div>
          </div>
          <div class="pdetail-spec-card">
            <div class="pdetail-spec-icon">💎</div>
            <div>
              <div class="pdetail-spec-label">Formato</div>
              <div class="pdetail-spec-val">${isGame ? 'Clave Digital Global' : 'Consola Original'}</div>
            </div>
          </div>
          <div class="pdetail-spec-card">
            <div class="pdetail-spec-icon">🎯</div>
            <div>
              <div class="pdetail-spec-label">Categoría</div>
              <div class="pdetail-spec-val">${category}</div>
            </div>
          </div>
        </div>

        <!-- Barra de Pestañas (Tabs) -->
        <div class="pdetail-tabs-bar">
          <button type="button" class="pdetail-tab-btn ${activeTab === 'desc' ? 'is-active' : ''}" data-pdetail-tab="desc">
            📖 Descripción
          </button>
          ${isGame && product.requirements ? `
          <button type="button" class="pdetail-tab-btn ${activeTab === 'specs' ? 'is-active' : ''}" data-pdetail-tab="specs">
            💻 Requisitos PC
          </button>` : ''}
          <button type="button" class="pdetail-tab-btn ${activeTab === 'reviews' ? 'is-active' : ''}" data-pdetail-tab="reviews">
            ⭐ Reseñas ${reviews.length ? `(${reviews.length})` : ''}
          </button>
        </div>

        <!-- Panel 1: DESCRIPCIÓN -->
        <div id="pdetail-panel-desc" class="pdetail-tab-panel" style="${activeTab === 'desc' ? 'display:block;' : 'display:none;'}">
          <div class="pdetail-desc-box">
            <div class="pdetail-section-title">📖 Acerca de este título</div>
            <p class="pdetail-desc-text">${product.description || 'Sin descripción disponible para este producto.'}</p>
            <div class="pdetail-desc-perks">
              <div class="pdetail-desc-perk-item"><span>✓</span> Clave original verificada con entrega inmediata</div>
              <div class="pdetail-desc-perk-item"><span>✓</span> Descarga y canje directo en tu cuenta oficial</div>
              <div class="pdetail-desc-perk-item"><span>✓</span> Soporte y garantía post-venta de por vida</div>
            </div>
          </div>

          <!-- También te puede gustar -->
          ${related.length ? `
          <div style="margin-bottom:22px;">
            <div class="pdetail-section-title">✨ Títulos relacionados recomendados</div>
            <div class="pdetail-related-grid">
              ${related.map(item => `
                <button type="button" class="pdetail-rel-card" data-view-product="${type}-${item.id}">
                  <img src="${item.image}" alt="" class="pdetail-rel-img" onerror="this.src='https://via.placeholder.com/160x80/111215/444?text=Game'">
                  <div class="pdetail-rel-body">
                    <span class="pdetail-rel-name">${item.title || item.name}</span>
                    <span class="pdetail-rel-price">$${item.price.toFixed(2)}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>` : ''}
        </div>

        <!-- Panel 2: REQUISITOS PC -->
        ${isGame && product.requirements ? `
        <div id="pdetail-panel-specs" class="pdetail-tab-panel" style="${activeTab === 'specs' ? 'display:block;' : 'display:none;'}">
          <div class="pdetail-desc-box">
            <div class="pdetail-section-title">💻 Ficha Técnica y Requisitos del Sistema PC</div>
            <p style="font-size:12.5px;color:var(--muted);margin:0 0 14px;line-height:1.5;">
              Consulta las especificaciones de hardware recomendadas para garantizar el rendimiento óptimo y la mejor tasa de fotogramas (FPS) en <strong>${name}</strong>.
            </p>

            <div class="pc-req-dual-grid">
              <!-- Requisitos Mínimos -->
              <div class="pc-req-card">
                <div class="pc-req-card-header">
                  <span class="pc-req-card-title">Mínimos (720p / 30 FPS)</span>
                  <span class="pc-req-badge pc-req-badge-min">Mínimo</span>
                </div>
                <table class="pc-req-table">
                  <tr>
                    <td class="pc-req-label">🖥️ S.O.</td>
                    <td class="pc-req-val">${product.requirements.minimum.os}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">⚡ CPU</td>
                    <td class="pc-req-val">${product.requirements.minimum.cpu}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🎮 GPU</td>
                    <td class="pc-req-val">${product.requirements.minimum.gpu}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🧠 RAM</td>
                    <td class="pc-req-val">${product.requirements.minimum.ram}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">💾 Disco</td>
                    <td class="pc-req-val">${product.requirements.minimum.storage}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🎯 DirectX</td>
                    <td class="pc-req-val">${product.requirements.minimum.directx}</td>
                  </tr>
                </table>
              </div>

              <!-- Requisitos Recomendados -->
              <div class="pc-req-card">
                <div class="pc-req-card-header">
                  <span class="pc-req-card-title">Recomendados (1080p-4K / 60+ FPS)</span>
                  <span class="pc-req-badge pc-req-badge-rec">Recomendado</span>
                </div>
                <table class="pc-req-table">
                  <tr>
                    <td class="pc-req-label">🖥️ S.O.</td>
                    <td class="pc-req-val">${product.requirements.recommended.os}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">⚡ CPU</td>
                    <td class="pc-req-val">${product.requirements.recommended.cpu}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🎮 GPU</td>
                    <td class="pc-req-val">${product.requirements.recommended.gpu}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🧠 RAM</td>
                    <td class="pc-req-val">${product.requirements.recommended.ram}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">💾 Disco</td>
                    <td class="pc-req-val">${product.requirements.recommended.storage}</td>
                  </tr>
                  <tr>
                    <td class="pc-req-label">🎯 DirectX</td>
                    <td class="pc-req-val">${product.requirements.recommended.directx}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>` : ''}

        <!-- Panel 3: RESEÑAS -->
        <div id="pdetail-panel-reviews" class="pdetail-tab-panel" style="${activeTab === 'reviews' ? 'display:block;' : 'display:none;'}">
          <div class="pdetail-reviews-container" style="margin-top:0;">
            <div class="pdetail-reviews-header">
              <div class="pdetail-section-title" style="margin-bottom:0;">⭐ Opiniones de la comunidad ${reviews.length ? `(${reviews.length})` : ''}</div>
            </div>

            ${reviews.length ? `
              <div class="pdetail-score-box">
                <div class="pdetail-score-big">${rating.toFixed(1)}</div>
                <div>
                  <div>${renderStars(rating, '16px')}</div>
                  <div style="font-size:11.5px;color:var(--muted);margin-top:2px;">Basado en ${reviews.length} valoración${reviews.length === 1 ? '' : 'es'} de usuarios reales</div>
                </div>
              </div>
            ` : ''}

            <div class="pdetail-reviews-list">
              ${reviews.length === 0 ? `
                <div style="padding:20px;text-align:center;background:rgba(255,255,255,0.02);border-radius:10px;color:var(--muted);font-size:13px;">
                  🎮 Aún no hay opiniones para este título. ¡Sé el primero en calificarlo!
                </div>
              ` : reviews.slice().reverse().map(r => `
                <div class="pdetail-review-card">
                  <div class="pdetail-review-top">
                    <div class="pdetail-user-badge">
                      <div class="pdetail-user-avatar">${getInitials(r.user)}</div>
                      <div>
                        <div style="display:flex;align-items:center;gap:6px;">
                          <span class="pdetail-user-name">${r.user}</span>
                          <span class="pdetail-verified-tag">✓ Verificado</span>
                        </div>
                      </div>
                    </div>
                    <span class="pdetail-review-date">${r.date}</span>
                  </div>
                  <div style="margin-bottom:6px;">${renderStars(r.rating, '13px')}</div>
                  <p class="pdetail-review-text">"${r.comment}"</p>
                </div>
              `).join('')}
            </div>

            <!-- Formulario o Invitación a Login -->
            ${currentUser ? `
              <form id="review-form" style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:14px 16px;margin-top:16px;">
                <div style="font-size:12.5px;font-weight:700;color:var(--text-strong,#fff);margin-bottom:8px;">Deja tu opinión como <span style="color:var(--accent2);">${currentUser.fullName || currentUser.username}</span></div>
                <div id="review-error" style="display:none;margin-bottom:10px;padding:8px 10px;background:rgba(255,20,20,0.12);color:#ffb7b7;border-radius:8px;font-size:12px;border:1px solid rgba(255,20,20,0.3);"></div>
                <div style="margin-bottom:10px;">
                  <label class="field-label">Tu Calificación:</label>
                  <div class="pdetail-star-picker">
                    ${[1, 2, 3, 4, 5].map(i => `<span data-star-select="${i}" title="${i} estrellas">☆</span>`).join('')}
                    <input type="hidden" id="review-rating-input" value="0" />
                  </div>
                </div>
                <div style="margin-bottom:12px;">
                  <label class="field-label" for="review-comment">Tu Comentario:</label>
                  <textarea id="review-comment" class="field-input" rows="3" placeholder="¿Qué te pareció el juego, rendimiento, historia...?" style="resize:vertical;font-family:inherit;"></textarea>
                </div>
                <button type="submit" class="pdetail-login-btn" style="padding:10px 22px;">Publicar Reseña</button>
              </form>
            ` : `
              <div class="pdetail-login-prompt" style="margin-top:16px;">
                <div>
                  <div style="font-size:13px;font-weight:700;color:var(--text-strong,#fff);">¿Has probado este título?</div>
                  <div style="font-size:12px;color:var(--muted);">Inicia sesión para compartir tu opinión con la comunidad gamer.</div>
                </div>
                <button id="btn-login-from-review" class="pdetail-login-btn">Iniciar Sesión</button>
              </div>
            `}
          </div>
        </div>

      </div>
    </div>
  </div>`;
}

// ─── MODAL DE COMPRA EXITOSA & ENTREGA DE CLAVES DIGITALES ──────
function renderOrderSuccessModal(order) {
  if (!order) return '';
  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:140;">
    <div class="modal-box" style="max-width:620px;" role="dialog" aria-modal="true">
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:var(--surface2,rgba(255,255,255,0.04));border:1px solid var(--border-subtle,rgba(255,255,255,0.07));border-radius:8px;color:var(--text-strong,#fff);cursor:pointer;font-size:16px;font-family:inherit;">✕</button>
      
      <div class="order-success-hero">
        <div class="order-success-icon">✓</div>
        <h2 style="margin:0 0 4px;font-size:1.5rem;font-weight:800;background:linear-gradient(90deg,#a4d96f,#00e5ff);-webkit-background-clip:text;background-clip:text;color:transparent;">¡Compra Completada con Éxito!</h2>
        <p style="margin:0;color:var(--muted);font-size:13.5px;">Pedido <strong>#${order.id}</strong> · Gracias por tu compra en PixelStore.</p>
      </div>

      <div style="font-size:12px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase;color:var(--accent2);margin-bottom:8px;">🔑 Tus Claves de Activación Digital</div>
      
      <div class="digital-keys-list">
        ${order.items.map((item, idx) => `
          <div class="digital-key-card">
            <div class="key-card-header">
              <span class="key-card-title">🎮 ${item.title}</span>
              <span class="key-card-badge">${item.productId && item.productId.startsWith('consola') ? 'Garantía Hardware' : 'Clave Digital Global'}</span>
            </div>
            
            <div class="key-box-display">
              <span id="key-text-${idx}">${item.key || 'PIXEL-89FA-4491-GAME'}</span>
              <button type="button" class="btn-copy-key" data-copy-key="${item.key || 'PIXEL-89FA-4491-GAME'}">Copiar Clave</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="key-guide-box">
        <strong>💡 Instrucciones de canje:</strong>
        <p style="margin:4px 0 0;">
          Abre tu plataforma (Steam / PlayStation Store / Xbox / Nintendo eShop) > <em>"Canjear Código"</em> > Pega la clave entregada.
        </p>
      </div>

      <!-- Botones de Acción -->
      <div style="display:flex;gap:10px;margin-top:18px;">
        <button id="btn-print-receipt" class="receipt-print-btn" data-print-receipt="${order.id}" style="flex:1;padding:11px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:9px;color:#ffffff;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;text-shadow:0 1px 2px rgba(0,0,0,0.3);">
          🖨️ Imprimir / Guardar Comprobante PDF
        </button>
        <button id="btn-close-modal-alt" style="padding:11px 18px;background:var(--surface2);border:1px solid var(--border-subtle);border-radius:9px;color:var(--text);font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;">
          Cerrar
        </button>
      </div>

    </div>
  </div>`;
}

// ─── MODAL DE COMPROBANTE / FACTURA IMPRIMIBLE ──────────────────
function renderReceiptModal(order, buyerUser) {
  if (!order) return '';
  const dateStr = new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  return `
  <div id="modal-backdrop" class="modal-backdrop" style="z-index:150;">
    <div class="modal-box" style="max-width:580px;background:#fff;color:#111827;padding:24px;" role="dialog" aria-modal="true">
      <button id="btn-close-modal" aria-label="Cerrar" style="position:absolute;right:14px;top:14px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;color:#111827;cursor:pointer;font-size:16px;font-family:inherit;">✕</button>

      <div id="printable-receipt-area" class="printable-ticket">
        <div class="ticket-header">
          <div class="ticket-logo">🎮 PixelStore</div>
          <div style="font-size:12px;color:#6b7280;margin-top:2px;">Comprobante de Compra Digital Oficial</div>
          <div style="font-size:11px;color:#9ca3af;">soporte@pixelstore.com · www.pixelstore.com</div>
        </div>

        <table class="ticket-meta-table">
          <tr>
            <td style="color:#6b7280;">Nº Pedido:</td>
            <td style="font-weight:700;text-align:right;">${order.id}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;">Fecha de emisión:</td>
            <td style="text-align:right;">${dateStr}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;">Cliente:</td>
            <td style="text-align:right;">${buyerUser?.fullName || 'Cliente PixelStore'}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;">Correo:</td>
            <td style="text-align:right;">${buyerUser?.email || 'N/A'}</td>
          </tr>
          <tr>
            <td style="color:#6b7280;">Método de Pago:</td>
            <td style="text-align:right;text-transform:capitalize;">${order.payment?.method === 'qr' ? 'Código QR Bancario' : 'Tarjeta de Crédito/Débito'}</td>
          </tr>
        </table>

        <table class="ticket-items-table">
          <thead>
            <tr>
              <th>Producto / Licencia</th>
              <th style="text-align:center;">Cant.</th>
              <th style="text-align:right;">Precio</th>
              <th style="text-align:right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <strong>${item.title}</strong>
                  ${item.key ? `<div style="font-family:monospace;font-size:10.5px;color:#2563eb;">Clave: ${item.key}</div>` : ''}
                </td>
                <td style="text-align:center;">${item.qty}</td>
                <td style="text-align:right;">$${item.unitPrice.toFixed(2)}</td>
                <td style="text-align:right;font-weight:700;">$${(item.unitPrice * item.qty).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="border-top:1px solid #e5e7eb;padding-top:10px;display:flex;flex-direction:column;gap:4px;font-size:12.5px;">
          <div style="display:flex;justify-content:space-between;color:#6b7280;">
            <span>Subtotal:</span>
            <span>$${(order.pricing?.subtotal || order.pricing?.total).toFixed(2)}</span>
          </div>
          ${order.pricing?.discount > 0 ? `
            <div style="display:flex;justify-content:space-between;color:#16a34a;font-weight:600;">
              <span>Descuento aplicado:</span>
              <span>-$${order.pricing.discount.toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="ticket-total-row">
            <span>TOTAL PAGADO:</span>
            <span>$${order.pricing?.total.toFixed(2)} USD</span>
          </div>
        </div>

        <div style="text-align:center;margin-top:20px;font-size:11px;color:#9ca3af;border-top:1px dashed #e5e7eb;padding-top:10px;">
          ¡Gracias por tu preferencia! Conserva este comprobante para cualquier reclamo o garantía.
        </div>
      </div>

      <div style="display:flex;gap:10px;margin-top:18px;">
        <button onclick="window.print()" style="flex:1;padding:11px;background:#111827;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;">
          🖨️ Imprimir Ticket / Guardar PDF
        </button>
        <button id="btn-close-modal-ticket" style="padding:11px 18px;background:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;color:#111827;font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;">
          Cerrar
        </button>
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
    <section class="hero-banner hero-grid">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <span class="eyebrow">Tu portal gamer</span>
        <h2 class="hero-title">Bienvenido a PixelStore</h2>
        <p class="hero-desc">Encuentra tus juegos favoritos, ofertas exclusivas y las últimas novedades — todo en un solo lugar.</p>
        <div class="hero-actions">
          <button id="btn-explorar" class="hero-btn-primary">Explorar juegos</button>
          <button id="btn-consolas" class="hero-btn-secondary"><svg width="22" height="15" viewBox="0 0 520 360" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;filter:drop-shadow(0 0 4px rgba(var(--accent2-rgb),0.55));"><defs><linearGradient id="gpad-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ff002f"/><stop offset="100%" stop-color="#00e5ff"/></linearGradient></defs><path d="M116 39 C94 39 77 50 68 68 C49 75 37 94 31 120 C24 149 22 190 22 225 C22 249 25 270 36 286 C45 299 58 306 72 305 C87 304 98 296 105 281 L135 218 C141 205 153 198 168 198 H352 C367 198 379 205 385 218 L415 281 C422 296 433 304 448 305 C462 306 475 299 484 286 C495 270 498 249 498 225 C498 190 496 149 489 120 C483 94 471 75 452 68 C443 50 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H175 L170 53 C168 44 162 39 153 39 Z" fill="url(#gpad-grad)"/><path d="M72 68 C77 49 94 39 116 39 H153 C162 39 168 44 170 53 L175 70 H88 C82 70 76 70 72 68 Z" fill="url(#gpad-grad)"/><path d="M448 68 C443 49 426 39 404 39 H367 C358 39 352 44 350 53 L345 70 H432 C438 70 444 70 448 68 Z" fill="url(#gpad-grad)"/><rect x="174" y="62" width="172" height="83" rx="2" fill="#0b0b0d"/><rect x="181" y="68" width="158" height="70" rx="1" fill="url(#gpad-grad)"/><g fill="#0b0b0d"><rect x="78" y="78" width="18" height="58" rx="2"/><rect x="58" y="98" width="58" height="18" rx="2"/></g><rect x="78" y="98" width="18" height="18" fill="#0b0b0d"/><circle cx="407" cy="72" r="13" fill="#0b0b0d"/><circle cx="382" cy="103" r="13" fill="#0b0b0d"/><circle cx="438" cy="103" r="13" fill="#0b0b0d"/><circle cx="410" cy="132" r="13" fill="#0b0b0d"/><circle cx="181" cy="204" r="25" fill="#0b0b0d"/><circle cx="181" cy="204" r="18" fill="url(#gpad-grad)"/><circle cx="339" cy="204" r="25" fill="#0b0b0d"/><circle cx="339" cy="204" r="18" fill="url(#gpad-grad)"/><rect x="204" y="157" width="25" height="10" rx="5" fill="#0b0b0d"/><rect x="291" y="157" width="25" height="10" rx="5" fill="#0b0b0d"/><rect x="249" y="157" width="22" height="8" rx="4" fill="#0b0b0d"/></svg> Consolas</button>
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
          ${games.map((g, i) => renderGameCard(g, reviews, i)).join('')}
        </div>`}
      </section>
    </div>
  </div>`;
}

function renderGameCard(g, reviews, index = 0) {
  const list = (reviews && reviews[`game-${g.id}`]) || [];
  const rating = avgRating(list);
  return `
  <article class="game-card" data-view-product="game-${g.id}" style="animation-delay:${Math.min(index * 45, 450)}ms;">
    <div style="position:relative;overflow:hidden;background:var(--surface2,#0a0a0c);height:170px;">
      <img class="card-img" src="${g.image}" alt="${g.title}" style="width:100%;height:170px;object-fit:cover;" onerror="this.src='https://via.placeholder.com/280x170/111215/444?text=Game'">
      ${g.discount ? `<div class="discount-tag">-${g.discount}%</div>` : ''}
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
        <button data-add-cart="${g.id}" data-type="game" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#ffffff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;transition:filter 160ms,transform 160ms;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
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
      <h2 style="margin:0;font-size:2rem;font-weight:800;color:var(--text-strong,#fff);">Consolas</h2>
      <p style="margin:8px 0 0;color:var(--muted);font-size:14px;">Las mejores consolas de la generación actual.</p>
    </div>

    <!-- Brand Filter -->
    <div style="display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap;">
      ${brands.map(b => `
        <button data-brand="${b}" style="padding:8px 18px;border-radius:999px;font-size:13.5px;cursor:pointer;font-family:inherit;transition:all 180ms ease;
          ${activeBrand === b
            ? 'border:none;background:linear-gradient(90deg,var(--accent),var(--accent2));color:#ffffff;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.3);'
            : 'border:1px solid var(--border-subtle,rgba(255,255,255,0.07));background:var(--surface);color:var(--muted);font-weight:400;'}"
          onmouseenter="${activeBrand !== b ? "this.style.borderColor='rgba(var(--accent2-rgb),0.5)';this.style.color='var(--text-strong,#fff)'" : ''}"
          onmouseleave="${activeBrand !== b ? "this.style.borderColor='var(--border-subtle,rgba(255,255,255,0.07))';this.style.color='var(--muted)'" : ''}"
        >${b === 'todos' ? 'Todas' : b}</button>
      `).join('')}
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px;">
      ${consolas.map((c, index) => {
        const list = (reviews && reviews[`consola-${c.id}`]) || [];
        const rating = avgRating(list);
        return `
        <article class="game-card" data-view-product="consola-${c.id}" style="animation-delay:${Math.min(index * 45, 450)}ms;">
          <div style="overflow:hidden;height:180px;background:var(--surface2,#0a0a0c);">
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
              <button data-add-cart="${c.id}" data-type="consola" style="padding:7px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#ffffff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:filter 160ms,transform 160ms;text-shadow:0 1px 2px rgba(0,0,0,0.3);"
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
          ${orders.length ? orders.map(order => { const buyer = users.find(user => user.id === order.buyerId); return `<tr style="border-top:1px solid var(--border-subtle);"><td style="padding:12px 16px;color:var(--text);font-size:12px;font-weight:700;">${order.id}</td><td style="padding:12px 16px;color:var(--muted);font-size:12px;">${buyer?.email || 'Cliente'}</td><td style="padding:12px 16px;color:#a4d96f;font-weight:700;">$${order.pricing.total.toFixed(2)}</td><td style="padding:12px 16px;color:var(--muted);font-size:12px;">${order.payment.method === 'qr' ? 'QR' : 'Tarjeta'}</td><td style="padding:12px 16px;"><select data-order-status="${order.id}" class="order-status-select">${[['pending_payment','Pendiente'],['paid','Pagado'],['processing','Preparación'],['ready','Listo'],['delivered','Entregado'],['cancelled','Cancelado']].map(([value,label]) => `<option value="${value}" ${order.status === value ? 'selected' : ''}>${label}</option>`).join('')}</select></td></tr>`; }).join('') : '<tr><td colspan="5" style="padding:24px;text-align:center;color:var(--muted);font-size:13px;">Aún no hay pedidos.</td></tr>'}
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
              : `<button data-request-vendor class="btn-glow" type="button" style="padding:9px 14px;background:linear-gradient(90deg,var(--accent),var(--accent2));border:none;border-radius:8px;color:#ffffff;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;text-shadow:0 1px 2px rgba(0,0,0,0.3);">Quiero ser vendedor</button>`
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
      ${userOrders.length ? `<div class="orders-list">${userOrders.map(order => `
        <article class="order-row" style="flex-wrap:wrap;gap:12px;">
          <div>
            <strong>#${order.id}</strong>
            <span>${new Date(order.createdAt).toLocaleDateString('es')} · ${order.items.reduce((qty, item) => qty + item.qty, 0)} artículo(s)</span>
          </div>
          <div class="order-row__items" style="flex:1;min-width:180px;">${order.items.map(item => item.title).join(', ')}</div>
          <div style="display:flex;align-items:center;gap:10px;margin-left:auto;">
            <span class="order-status status-${order.status}">${labels[order.status] || order.status}</span>
            <strong style="color:#a4d96f;">$${order.pricing.total.toFixed(2)}</strong>
            <button type="button" data-view-order-receipt="${order.id}" style="padding:6px 12px;background:rgba(0,229,255,0.1);border:1px solid rgba(0,229,255,0.3);border-radius:6px;color:var(--accent2);font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 160ms ease;">
              🔑 Claves & Ticket
            </button>
          </div>
        </article>`).join('')}</div>` : '<p class="empty-copy">Tus pedidos aparecerán aquí al finalizar una compra.</p>'}
    </section>
  </div>`;
}

// ─── ASISTENTE GAMER VIRTUAL (PIXELBOT) ──────────────────────
function renderPixelBot({ pixelBotOpen, pixelBotMessages = [], pixelBotTyping }) {
  const defaultGreeting = {
    sender: 'bot',
    text: '¡Hola, gamer! 🎮 Soy **PixelBot**, tu asistente inteligente en PixelStore.\n\n¿Buscas recomendaciones según tu presupuesto, saber si un juego corre en tu PC o ver las ofertas más recientes?',
    time: 'Ahora'
  };

  const messages = pixelBotMessages.length ? pixelBotMessages : [defaultGreeting];

  const quickPrompts = [
    { label: '🔥 Ofertas < $20', prompt: 'Muéstrame los mejores juegos en oferta por menos de $20' },
    { label: '💻 Juegos para 8GB RAM', prompt: '¿Qué juegos corren fluido en una PC con 8GB de RAM?' },
    { label: '🗡️ Mejores RPGs', prompt: 'Recomiéndame los mejores juegos RPG y de aventura' },
    { label: '🕹️ Consolas oficiales', prompt: '¿Qué consolas tienen disponibles?' },
    { label: '🔑 ¿Cómo canjeo mi clave?', prompt: '¿Cómo funciona la entrega y canje de claves digitales?' }
  ];

  return `
  <!-- Botón Flotante de PixelBot -->
  <button id="btn-pixelbot-toggle" class="pixelbot-floating-trigger" aria-label="Abrir asistente PixelBot">
    <div class="pixelbot-avatar-badge">
      <span>🤖</span>
      <span class="pixelbot-online-dot"></span>
    </div>
    <div class="pixelbot-trigger-text">
      <span class="pixelbot-trigger-title">PixelBot</span>
      <span class="pixelbot-trigger-subtitle">Asistente Gamer IA</span>
    </div>
  </button>

  <!-- Ventana de Chat de PixelBot -->
  ${pixelBotOpen ? `
  <div id="pixelbot-chat-window" class="pixelbot-window" role="dialog" aria-labelledby="pixelbot-header-title">
    <div class="pixelbot-header">
      <div class="pixelbot-header-info">
        <div class="pixelbot-avatar-badge" style="width:32px;height:32px;font-size:16px;">
          <span>🤖</span>
          <span class="pixelbot-online-dot"></span>
        </div>
        <div>
          <h4 id="pixelbot-header-title" class="pixelbot-header-title">PixelBot <span style="font-size:10px;background:rgba(0,229,255,0.15);color:var(--accent2);padding:1px 5px;border-radius:4px;">IA</span></h4>
          <span class="pixelbot-header-status">● En línea · Especialista Gamer</span>
        </div>
      </div>
      <div class="pixelbot-header-actions">
        <button id="btn-pixelbot-reset" class="pixelbot-btn-icon" title="Reiniciar chat">🔄</button>
        <button id="btn-pixelbot-close" class="pixelbot-btn-icon" title="Cerrar chat">✕</button>
      </div>
    </div>

    <!-- Mensajes -->
    <div id="pixelbot-messages-body" class="pixelbot-body">
      ${messages.map(m => `
        <div class="pixelbot-msg is-${m.sender}">
          <div class="pixelbot-bubble">
            ${m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
            
            ${m.products && m.products.length ? `
              <div class="pixelbot-products-list">
                ${m.products.map(p => `
                  <div class="pixelbot-prod-card" data-bot-view-product="${p.type || 'game'}-${p.id}">
                    <img src="${p.image}" alt="" class="pixelbot-prod-thumb" onerror="this.src='https://via.placeholder.com/50x38/111215/444?text=Game'">
                    <div class="pixelbot-prod-info">
                      <div class="pixelbot-prod-title">${p.title}</div>
                      <div class="pixelbot-prod-price">$${p.price.toFixed(2)} ${p.discount ? `<span style="font-size:9.5px;color:#ff416c;font-weight:700;">(-${p.discount}%)</span>` : ''}</div>
                    </div>
                    <span class="pixelbot-prod-btn">Ver ➔</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <span class="pixelbot-time">${m.time || ''}</span>
        </div>
      `).join('')}

      ${pixelBotTyping ? `
        <div class="pixelbot-msg is-bot">
          <div class="pixelbot-typing-indicator">
            <span class="pixelbot-dot"></span>
            <span class="pixelbot-dot"></span>
            <span class="pixelbot-dot"></span>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Chips de Preguntas Frecuentes Rápidas -->
    <div class="pixelbot-chips-wrapper">
      ${quickPrompts.map(qp => `
        <button type="button" class="pixelbot-chip" data-bot-prompt="${qp.prompt}">
          ${qp.label}
        </button>
      `).join('')}
    </div>

    <!-- Formulario de Entrada -->
    <div class="pixelbot-footer">
      <form id="pixelbot-form" class="pixelbot-form">
        <input type="text" id="pixelbot-input" class="pixelbot-input" placeholder="Pregúntale a PixelBot..." autocomplete="off" />
        <button type="submit" class="pixelbot-send-btn" aria-label="Enviar mensaje">➤</button>
      </form>
    </div>
  </div>` : ''}
  `;
}
