const pool = require('../config/db');

// GET /api/cart
const getCart = async (req, res) => {
    try {
        const [items] = await pool.execute(
            `SELECT ci.id, ci.quantity, ci.product_id,
                    p.name, p.price, p.image_url, p.stock, p.brand
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.id
             WHERE ci.user_id = ?
             ORDER BY ci.created_at DESC`,
            [req.user.id]
        );
        res.json(items);
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// POST /api/cart
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;
        const qty = quantity || 1;

        if (!product_id) {
            return res.status(400).json({ message: 'El ID del producto es obligatorio' });
        }

        // Verificar que el producto existe y tiene stock
        const [products] = await pool.execute(
            'SELECT stock FROM products WHERE id = ?',
            [product_id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (products[0].stock < qty) {
            return res.status(400).json({ message: 'Stock insuficiente' });
        }

        // Verificar si ya está en el carrito
        const [existing] = await pool.execute(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id]
        );

        if (existing.length > 0) {
            // Actualizar cantidad
            const newQty = existing[0].quantity + qty;
            if (newQty > products[0].stock) {
                return res.status(400).json({ message: 'No hay suficiente stock para esa cantidad' });
            }
            await pool.execute(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQty, existing[0].id]
            );
        } else {
            // Insertar nuevo item
            await pool.execute(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, qty]
            );
        }

        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// PUT /api/cart/:id
const updateQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'La cantidad debe ser al menos 1' });
        }

        // Verificar que el item pertenece al usuario y obtener product_id
        const [items] = await pool.execute(
            'SELECT ci.product_id FROM cart_items ci WHERE ci.id = ? AND ci.user_id = ?',
            [req.params.id, req.user.id]
        );

        if (items.length === 0) {
            return res.status(404).json({ message: 'Item del carrito no encontrado' });
        }

        // Verificar stock disponible
        const [products] = await pool.execute(
            'SELECT stock FROM products WHERE id = ?',
            [items[0].product_id]
        );

        if (products.length > 0 && quantity > products[0].stock) {
            return res.status(400).json({ message: 'No hay suficiente stock para esa cantidad' });
        }

        await pool.execute(
            'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user.id]
        );

        res.json({ message: 'Cantidad actualizada' });
    } catch (error) {
        console.error('Error actualizando carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
    try {
        const [result] = await pool.execute(
            'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item del carrito no encontrado' });
        }

        res.json({ message: 'Producto removido del carrito' });
    } catch (error) {
        console.error('Error removiendo del carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// DELETE /api/cart/clear
const clearCart = async (req, res) => {
    try {
        await pool.execute(
            'DELETE FROM cart_items WHERE user_id = ?',
            [req.user.id]
        );
        res.json({ message: 'Carrito vaciado' });
    } catch (error) {
        console.error('Error vaciando carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
