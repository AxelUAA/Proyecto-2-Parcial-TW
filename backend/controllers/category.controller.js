const pool = require('../config/db');

// GET /api/categories
const getAll = async (req, res) => {
    try {
        const [categories] = await pool.execute(
            'SELECT * FROM categories ORDER BY name'
        );
        res.json(categories);
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { getAll };
