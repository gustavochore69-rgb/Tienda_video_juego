const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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