const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar campos
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar si el email ya existe
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existing.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // El primer usuario registrado es admin
        const [allUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
        const role = allUsers[0].count === 0 ? 'admin' : 'user';

        // Insertar usuario
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        // Generar token JWT
        const token = jwt.sign(
            { id: result.insertId, email, role, name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            message: role === 'admin'
                ? '¡Bienvenido administrador! Tu cuenta ha sido creada.'
                : 'Usuario registrado exitosamente',
            token,
            user: { id: result.insertId, name, email, role }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        // Buscar usuario
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        // req.user is populated by the authMiddleware
        const userId = req.user.id;
        const { name, email, currentPassword, newPassword } = req.body;

        if (!name || !email) {
            return res.status(400).json({ message: 'El nombre y correo electrónico son obligatorios.' });
        }

        // Fetch current user from DB to verify existence and password if needed
        const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const user = users[0];

        // Ensure email isn't taken by someone else
        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Este correo electrónico ya está en uso por otra cuenta.' });
        }

        let hashedPassword = user.password;

        // If they want to change the password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Debes proporcionar tu contraseña actual para establecer una nueva.' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'La contraseña actual es incorrecta.' });
            }
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        // Update user
        await pool.execute(
            'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?',
            [name, email, hashedPassword, userId]
        );

        // Generate a fresh token with updated info
        const token = jwt.sign(
            { id: userId, email, role: user.role, name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Perfil actualizado con éxito',
            token,
            user: { id: userId, name, email, role: user.role }
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error en el servidor al actualizar el perfil.' });
    }
};

module.exports = { register, login, updateProfile };
