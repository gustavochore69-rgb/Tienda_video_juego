const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================
// CONFIGURACIÓN DE SESIONES
// ============================================
const sessionStore = new MySQLStore({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_video_juegos'
});

app.use(session({
    secret: 'mi_secreto_seguro_2024',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: false,
        maxAge: 3600000,
        httpOnly: true
    }
}));

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================
function autenticar(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    }
    res.status(401).json({ error: 'No autenticado' });
}

function autorizar(...rolesPermitidos) {
    return (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            return res.status(401).json({ error: 'No autenticado' });
        }
        if (rolesPermitidos.includes(req.session.usuario.rol)) {
            return next();
        }
        res.status(403).json({ error: 'Acceso denegado' });
    };
}

// ============================================
// 1. RUTA PARA REGISTRAR CLIENTE
// ============================================
app.post('/api/registro', async (req, res) => {
    const { nombre, apellido, correo, contra, rol } = req.body;

    if (!nombre || !apellido || !correo || !contra) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contra, salt);
        const userRol = rol || 'cliente';

        const query = 'INSERT INTO cliente (nombre, apellido, correo, contra, rol) VALUES (?, ?, ?, ?, ?)';
        await db.execute(query, [nombre, apellido, correo, hashedPassword, userRol]);

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', success: true });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// 2. RUTA PARA LOGIN
// ============================================
app.post('/api/login', async (req, res) => {
    const { correo, contra } = req.body;

    if (!correo || !contra) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM cliente WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const cliente = rows[0];

        let esCorrecta = false;
        if (cliente.contra.startsWith('$2a$') || cliente.contra.startsWith('$2b$')) {
            esCorrecta = await bcrypt.compare(contra, cliente.contra);
        } else {
            esCorrecta = (contra === cliente.contra);
        }

        if (!esCorrecta) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Crear sesión
        req.session.usuario = {
            id: cliente.id,
            nombre: `${cliente.nombre} ${cliente.apellido}`,
            email: cliente.correo,
            rol: cliente.rol || 'cliente'
        };

        req.session.save((err) => {
            if (err) {
                console.error('Error guardando sesión:', err);
                return res.status(500).json({ error: 'Error al guardar sesión' });
            }

            let redirect = '/index.html';
            if (cliente.rol === 'administrador' || cliente.rol === 'admin') redirect = '/admin.html';
            else if (cliente.rol === 'vendedor' || cliente.rol === 'vendor') redirect = '/vendor.html';

            res.json({
                success: true,
                mensaje: 'Inicio de sesión exitoso',
                cliente: {
                    id: cliente.id,
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    correo: cliente.correo,
                    rol: cliente.rol || 'cliente'
                },
                redirect: redirect
            });
        });

    } catch (error) {
        console.error('Error en /api/login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// 3. CERRAR SESIÓN
// ============================================
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ success: true, mensaje: 'Sesión cerrada exitosamente' });
    });
});

// ============================================
// 4. OBTENER USUARIO ACTUAL
// ============================================
app.get('/api/usuario', (req, res) => {
    if (req.session && req.session.usuario) {
        res.json(req.session.usuario);
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
});

// ============================================
// 5. ADMIN - OBTENER TODOS LOS USUARIOS (CORREGIDO)
// ============================================
app.get('/api/admin/usuarios', async (req, res) => {
    // Verificar autenticación
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    
    // Verificar rol de administrador
    const rol = req.session.usuario.rol;
    if (rol !== 'administrador' && rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. No eres administrador.' });
    }

    try {
        const [rows] = await db.execute('SELECT id, nombre, apellido, correo, rol, activo FROM cliente ORDER BY id DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// 6. ADMIN - ACTUALIZAR USUARIO
// ============================================
app.put('/api/admin/usuarios/:id', async (req, res) => {
    // Verificar autenticación
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    
    // Verificar rol de administrador
    const rol = req.session.usuario.rol;
    if (rol !== 'administrador' && rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. No eres administrador.' });
    }

    const userId = req.params.id;
    const { nombre, apellido, correo, rol: nuevoRol, activo } = req.body;

    try {
        await db.execute(
            'UPDATE cliente SET nombre = ?, apellido = ?, correo = ?, rol = ?, activo = ? WHERE id = ?',
            [nombre, apellido, correo, nuevoRol, activo !== false, userId]
        );
        res.json({ success: true, mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(3000, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Servidor corriendo en http://localhost:3000');
    console.log('🔐 Sistema de sesiones activado');
    console.log('📧 Admin: admin@tienda.com');
    console.log('🔑 Contraseña: admin123');
    console.log('═══════════════════════════════════════════════════════');
});