// Interacciones mínimas para la ventana de bienvenida
document.addEventListener('DOMContentLoaded', () => {
  // Año en el footer
  const y = new Date().getFullYear();
  document.getElementById('year').textContent = y;

  // Explorar: scroll a destacados
  const exploreBtn = document.getElementById('exploreBtn');
  exploreBtn?.addEventListener('click', () => {
    const dest = document.getElementById('destacados');
    if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Buscar (demo)
  const form = document.getElementById('searchForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if (!q) {
      alert('Ingresa un término para buscar.');
      return;
    }
    // Por ahora simulamos búsqueda
    alert('Buscando: ' + q + '\n(En esta demo no hay backend.)');
  });

  // Botones de login/carrito (demo)
  document.getElementById('loginBtn')?.addEventListener('click', () => {
    alert('Función de iniciar sesión no implementada en la demo.');
  });
  document.getElementById('cartBtn')?.addEventListener('click', () => {
    alert('Carrito vacío (demo).');
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
          // pequeña animación de entrada
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

  // Login modal: abrir/cerrar y lógica de autenticación demo
(function() {
  // Usuarios demo
  const users = [
    { id: 1, username: 'moderador', email: 'moder.pixel', password: 'modpass', role: 'moderador' },
    { id: 2, username: 'ver',       email: 'Ver.pixel', password: 'verpass', role: 'comprador' },
    { id: 3, username: 'vendedor',  email: 'Vendedor.pixel', password: 'Vendedor123', role: 'vendedor' }
  ];

  // Elementos del DOM del modal
  const loginBtn = document.getElementById('loginBtn'); // botón del header
  const modal = document.getElementById('loginModal');
  const backdrop = modal?.querySelector('.modal-backdrop');
  const closeBtn = modal?.querySelector('.modal-close');
  const form = document.getElementById('loginFormModal');
  const userInput = document.getElementById('userInputModal');
  const pwInput = document.getElementById('pwInputModal');
  const togglePw = document.getElementById('togglePwModal');
  const msg = document.getElementById('msgModal');
  const copyBtns = document.querySelectorAll('.modal-copy');

  if (!modal || !loginBtn) return; // no hacemos nada si faltan elementos

  // Abrir modal
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    // dejar foco en el primer input
    setTimeout(() => { userInput?.focus(); }, 120);
    // trap focus simple: opcional, no implementado aquí
  }

  // Cerrar modal
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // limpiar mensajes
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

  // Copiar credenciales demo
  copyBtns.forEach(b => {
    b.addEventListener('click', async () => {
      const user = b.dataset.user;
      const pass = b.dataset.pass;
      try {
        await navigator.clipboard.writeText(`usuario: ${user}\npass: ${pass}`);
        showMsg('Credenciales copiadas al portapapeles', 'success');
      } catch (err) {
        // fallback: llenar inputs
        userInput.value = user;
        pwInput.value = pass;
        showMsg('Rellenadas credenciales en el formulario', 'success');
      }
    });
  });

  // Envío del form (login modal)
  form?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const ident = (userInput.value || '').trim();
    const pw = pwInput.value || '';

    if (!ident || !pw) {
      showMsg('Completa usuario y contraseña.', 'error');
      return;
    }

    const found = users.find(u => {
      return (u.username.toLowerCase() === ident.toLowerCase()) ||
             (u.email.toLowerCase() === ident.toLowerCase());
    });

    if (!found) {
      showMsg('Usuario no encontrado.', 'error');
      return;
    }

    if (found.password !== pw) {
      showMsg('Contraseña incorrecta.', 'error');
      return;
    }

    // Éxito: guardar en localStorage (demo)
    const safeUser = { id: found.id, username: found.username, email: found.email, role: found.role };
    localStorage.setItem('pixelUser', JSON.stringify(safeUser));
    showMsg(`Bienvenido ${found.username} — rol: ${found.role}`, 'success');

    // Cerrar modal después de una breve espera
    setTimeout(() => {
      closeModal();
      // opcional: refrescar o redirigir a index.html si querés
      // location.href = 'index.html';
      // Actualizar header u otros elementos si hicieras eso después
    }, 700);
  });

  // Mensajes
  function showMsg(text, type = 'error') {
    if (!msg) return;
    msg.className = 'msg';
    msg.classList.add(type === 'error' ? 'error' : 'success');
    msg.textContent = text;
    msg.style.display = 'block';
    if (type === 'error') {
      setTimeout(() => { msg.style.display = 'none'; }, 4000);
    } else {
      setTimeout(() => { msg.style.display = 'none'; }, 2000);
    }
  }
  function hideMsg() {
    if (!msg) return;
    msg.style.display = 'none';
    msg.className = 'msg';
    msg.textContent = '';
  }

  // Si ya hay usuario, mostramos un mensaje breve en consola (opcional)
  try {
    const existing = localStorage.getItem('pixelUser');
    if (existing) {
      const u = JSON.parse(existing);
      console.log('Sesión activa:', u.username, u.role);
    }
  } catch {}
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
      // Limitar al rango válido
      index = Math.max(0, Math.min(total - 1, index));
      current = index;

      // Mover el track
      carousel.style.transform = `translateX(-${current * 100}%)`;

      // Actualizar dots
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });

      // Deshabilitar flechas en los extremos
      btnLeft.disabled  = current === 0;
      btnRight.disabled = current === total - 1;
    }

    // Inicializar
    goTo(0);

    // Eventos flechas
    btnLeft.addEventListener('click',  () => goTo(current - 1));
    btnRight.addEventListener('click', () => goTo(current + 1));

    // Eventos dots
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    // Soporte teclado (izquierda / derecha) cuando el carrusel está en foco
    carousel.closest?.('.generos-carousel-wrapper')?.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Swipe táctil básico
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