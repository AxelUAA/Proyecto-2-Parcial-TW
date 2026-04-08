const pool = require('../config/db');

// GET /api/products
const getAll = async (req, res) => {
    try {
        const { category, search, featured } = req.query;
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            query += ' AND p.category_id = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (p.name LIKE ? OR p.short_description LIKE ? OR p.brand LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (featured === 'true') {
            query += ' AND p.featured = 1';
        }

        query += ' ORDER BY p.created_at DESC';

        const [products] = await pool.execute(query, params);
        res.json(products);
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// GET /api/products/:id
const getById = async (req, res) => {
    try {
        const [products] = await pool.execute(
            `SELECT p.*, c.name as category_name 
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             WHERE p.id = ?`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(products[0]);
    } catch (error) {
        console.error('Error obteniendo producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// POST /api/products
const create = async (req, res) => {
    try {
        const { name, short_description, description, price, image_url, category_id, brand, stock, featured } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO products (name, short_description, description, price, image_url, category_id, brand, stock, featured) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, short_description || '', description || '', price, image_url || '', category_id, brand, stock || 0, featured ? 1 : 0]
        );

        res.status(201).json({
            message: 'Producto creado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creando producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// PUT /api/products/:id
const update = async (req, res) => {
    try {
        const { name, short_description, description, price, image_url, category_id, brand, stock, featured } = req.body;

        const [result] = await pool.execute(
            `UPDATE products 
             SET name = ?, short_description = ?, description = ?, price = ?, image_url = ?, 
                 category_id = ?, brand = ?, stock = ?, featured = ?
             WHERE id = ?`,
            [name, short_description, description, price, image_url, category_id, brand, stock, featured ? 1 : 0, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error actualizando producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// DELETE /api/products/:id
const remove = async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM products WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error eliminando producto:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { getAll, getById, create, update, remove };
