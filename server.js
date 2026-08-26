const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs/promises');
const path = require('path');
const db = require('./db');

const app = express();
app.use(express.json({ limit: '3mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Productos: el panel de administración usa estas rutas para leer y guardar en MySQL.
app.get('/api/productos', async (_req, res) => {
    try {
        const [rows] = await db.execute(`SELECT id, nombre AS title, plataforma AS platform,
            categoria AS category, costo AS cost, precio AS price, stock,
            imagen_url AS image, descripcion AS description
            FROM productos ORDER BY id DESC`);
        res.json(rows);
    } catch (_error) {
        res.status(500).json({ error: 'No se pudo cargar el catálogo de productos.' });
    }
});

app.post('/api/productos', async (req, res) => {
    const { title, platform, category, cost, price, stock, imageData = '', description = '' } = req.body;
    const numericCost = Number(cost);
    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!title?.trim() || !platform || !category || !Number.isFinite(numericCost) || numericCost < 0 || !Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isInteger(numericStock) || numericStock < 0) {
        return res.status(400).json({ error: 'Datos de producto inválidos.' });
    }

    try {
        let image = '';
        if (imageData) {
            const match = /^data:image\/(png|jpeg|webp|gif);base64,([A-Za-z0-9+/=]+)$/.exec(imageData);
            if (!match) return res.status(400).json({ error: 'El archivo de imagen no es válido.' });

            const buffer = Buffer.from(match[2], 'base64');
            if (buffer.length > 2 * 1024 * 1024) return res.status(400).json({ error: 'La imagen no puede superar los 2 MB.' });

            const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
            const filename = `producto-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;
            const uploadsDir = path.join(__dirname, 'public', 'uploads');
            await fs.mkdir(uploadsDir, { recursive: true });
            await fs.writeFile(path.join(uploadsDir, filename), buffer);
            image = `/uploads/${filename}`;
        }
        const [result] = await db.execute(
            `INSERT INTO productos (nombre, plataforma, categoria, costo, precio, stock, imagen_url, descripcion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title.trim(), platform, category, numericCost, numericPrice, numericStock, image, description.trim()]
        );
        res.status(201).json({ id: result.insertId, title: title.trim(), platform, category, cost: numericCost, price: numericPrice, stock: numericStock, image, description: description.trim() });
    } catch (_error) {
        res.status(500).json({ error: 'No se pudo guardar el producto en la base de datos.' });
    }
});

// Ruta para Registrar Cliente
app.post('/api/registro', async (req, res) => {
    const { nombre, apellido, correo, contra } = req.body;

    if (!nombre || !apellido || !correo || !contra) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contra, salt);

        const query = 'INSERT INTO CLIENTE (nombre, apellido, correo, contra) VALUES (?, ?, ?, ?)';
        await db.execute(query, [nombre, apellido, correo, hashedPassword]);

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para Login de Cliente
app.post('/api/login', async (req, res) => {
    const { correo, contra } = req.body;

    if (!correo || !contra) {
        return res.status(400).json({ error: 'Correo y contraseña requeridos' });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM CLIENTE WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const cliente = rows[0];
        const esCorrecta = await bcrypt.compare(contra, cliente.contra);

        if (!esCorrecta) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                correo: cliente.correo
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
// Ruta para Iniciar Sesión (Login)
app.post('/api/login', async (req, res) => {
    const { correo, contra } = req.body;

    if (!correo || !contra) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Buscar el usuario por su correo
        const [rows] = await db.query('SELECT * FROM cliente WHERE correo = ?', [correo]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'El correo no está registrado' });
        }

        const cliente = rows[0];

        // Validar contraseña encriptada
        const coincide = await bcrypt.compare(contra, cliente.contra);

        if (!coincide) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Si todo coincide, devolver éxito y datos del cliente
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                correo: cliente.correo
            }
        });
    } catch (err) {
        console.error('Error en /api/login:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
