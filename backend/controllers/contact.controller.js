const pool = require('../config/db');

// POST /api/contact
const create = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        await pool.execute(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({ message: 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.' });
    } catch (error) {
        console.error('Error guardando mensaje:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { create };
