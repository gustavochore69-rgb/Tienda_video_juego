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

  // Categorías (marcar activo)
  document.querySelectorAll('.categories .cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.categories .cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Aquí podríamos filtrar las tarjetas según la categoría
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
  const btnDemo = document.getElementById('btnDemoModal');

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
    togglePw.textContent = isPwd ? 'Ocultar' : 'Mostrar';
    togglePw.setAttribute('aria-pressed', isPwd ? 'true' : 'false');
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

  // Rellenar demo (comprador)
  btnDemo?.addEventListener('click', () => {
    const d = users.find(u => u.role === 'comprador');
    if (d) {
      userInput.value = d.email;
      pwInput.value = d.password;
      showMsg('Credenciales de demo cargadas (comprador)', 'success');
    }
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

});