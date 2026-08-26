const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 1. RUTA PARA REGISTRAR CLIENTE
app.post('/api/registro', async (req, res) => {
    const { nombre, apellido, correo, contra, rol } = req.body;

    if (!nombre || !apellido || !correo || !contra) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contra, salt);

        // Se asigna 'cliente' por defecto si no se especifica un rol
        const userRol = rol || 'cliente';

        const query = 'INSERT INTO CLIENTE (nombre, apellido, correo, contra, rol) VALUES (?, ?, ?, ?, ?)';
        await db.execute(query, [nombre, apellido, correo, hashedPassword, userRol]);

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 2. RUTA ÚNICA PARA LOGIN DE CLIENTE
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

        // Manejo de la contraseña (soporta hash bcrypt o texto plano si fue insertada manualmente en phpMyAdmin)
        let esCorrecta = false;
        if (cliente.contra.startsWith('$2a$') || cliente.contra.startsWith('$2b$')) {
            esCorrecta = await bcrypt.compare(contra, cliente.contra);
        } else {
            esCorrecta = (contra === cliente.contra);
        }

        if (!esCorrecta) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Devuelve todos los datos esenciales, incluyendo el ROL
        res.json({
            mensaje: 'Inicio de sesión exitoso',
            cliente: {
                id: cliente.id,
                nombre: cliente.nombre,
                apellido: cliente.apellido,
                correo: cliente.correo,
                role: cliente.rol || 'cliente'
            }
        });
    } catch (error) {
        console.error('Error en /api/login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});