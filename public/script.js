// Interacciones mínimas para la ventana de bienvenida
document.addEventListener('DOMContentLoaded', () => {
  // Año en el footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;

  // Explorar: scroll a destacados
  const exploreBtn = document.getElementById('exploreBtn');
  exploreBtn?.addEventListener('click', () => {
    const dest = document.getElementById('destacados');
    if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Buscar
  const formSearch = document.getElementById('searchForm');
  formSearch?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (!q) {
      alert('Ingresa un término para buscar.');
      return;
    }
    alert('Buscando: ' + q);
  });

  // Botón de carrito
  document.getElementById('cartBtn')?.addEventListener('click', () => {
    alert('Carrito vacío.');
  });

  // Categorías — filtro real con animación
  const catBtns = document.querySelectorAll('.categories .cat');
  const allCards = document.querySelectorAll('.cards .card');

  // Crear mensaje "sin resultados" dinámico
  const cardsContainer = document.querySelector('.cards');
  let noResultsMsg = document.createElement('p');
  noResultsMsg.id = 'noResults';
  noResultsMsg.textContent = 'No hay juegos en esta categoría.';
  noResultsMsg.style.cssText = 'color:var(--muted,#aaa);font-size:1rem;padding:2rem 0;display:none;grid-column:1/-1;text-align:center;';
  cardsContainer?.appendChild(noResultsMsg);

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Marcar activo
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat; // ej: "accion", "indie", "todos"
      let visible = 0;

      allCards.forEach(card => {
        const genres = (card.dataset.genre || '').split(' ');
        const match = cat === 'todos' || genres.includes(cat);

        if (match) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          visible++;
        } else {
          card.style.transition = 'opacity 0.2s ease';
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });

      // Mostrar mensaje si no hay resultados
      noResultsMsg.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  // Login modal: abrir/cerrar y conexión con el Backend
  (function() {
    // Elementos del DOM del modal
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('loginModal');
    const backdrop = modal?.querySelector('.modal-backdrop');
    const closeBtn = modal?.querySelector('.modal-close');
    const form = document.getElementById('loginFormModal');
    const userInput = document.getElementById('userInputModal');
    const pwInput = document.getElementById('pwInputModal');
    const togglePw = document.getElementById('togglePwModal');
    const msg = document.getElementById('msgModal');

    if (!modal || !loginBtn) return;

    // Abrir modal
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => { userInput?.focus(); }, 120);
    }

    // Cerrar modal
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      hideMsg();
    }

    // Cierre por backdrop o botón close
    backdrop?.addEventListener('click', () => closeModal());
    closeBtn?.addEventListener('click', () => closeModal());

    // Cerrar con ESC
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Mostrar/ocultar contraseña
    togglePw?.addEventListener('click', () => {
      const isPwd = pwInput.type === 'password';
      pwInput.type = isPwd ? 'text' : 'password';
      togglePw.setAttribute('aria-pressed', isPwd ? 'true' : 'false');
      togglePw.setAttribute('aria-label', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
      togglePw.setAttribute('title', isPwd ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });

    // Envío del form (Autenticación real contra el backend)
    form?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const ident = (userInput.value || '').trim();
      const pw = pwInput.value || '';

      if (!ident || !pw) {
        showMsg('Completa usuario y contraseña.', 'error');
        return;
      }

      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: ident, contra: pw })
        });

        const result = await res.json();

        if (res.ok) {
          const usuarioSesion = {
            id: result.cliente.id,
            username: result.cliente.nombre,
            email: result.cliente.correo,
            role: result.cliente.role || 'client'
          };

          localStorage.setItem('pixelUser', JSON.stringify(usuarioSesion));
          showMsg(`¡Bienvenido ${usuarioSesion.username}!`, 'success');

          setTimeout(() => {
            closeModal();
            window.location.reload();
          }, 800);
        } else {
          showMsg(result.error || 'Credenciales inválidas.', 'error');
        }
      } catch (err) {
        console.error('Error de autenticación:', err);
        showMsg('Error al conectar con el servidor.', 'error');
      }
    });

    // Mensajes
    function showMsg(text, type = 'error') {
      if (!msg) return;
      msg.className = 'msg';
      msg.classList.add(type === 'error' ? 'error' : 'success');
      msg.textContent = text;
      msg.style.display = 'block';
      setTimeout(() => { msg.style.display = 'none'; }, type === 'error' ? 4000 : 2000);
    }

    function hideMsg() {
      if (!msg) return;
      msg.style.display = 'none';
      msg.className = 'msg';
      msg.textContent = '';
    }
  })();

  // ── Carrusel de Géneros ──────────────────────────────────────────────────
  (function () {
    const carousel   = document.getElementById('genCarousel');
    const btnLeft    = document.getElementById('genCarLeft');
    const btnRight   = document.getElementById('genCarRight');
    const dotsWrap   = document.getElementById('genCarDots');

    if (!carousel || !btnLeft || !btnRight) return;

    const slides  = carousel.querySelectorAll('.generos-slide');
    const dots    = dotsWrap ? dotsWrap.querySelectorAll('.carousel-dot') : [];
    const total   = slides.length;
    let current   = 0;

    function goTo(index) {
      index = Math.max(0, Math.min(total - 1, index));
      current = index;

      carousel.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });

      btnLeft.disabled  = current === 0;
      btnRight.disabled = current === total - 1;
    }

    goTo(0);

    btnLeft.addEventListener('click',  () => goTo(current - 1));
    btnRight.addEventListener('click', () => goTo(current + 1));

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    carousel.closest?.('.generos-carousel-wrapper')?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  })();
});