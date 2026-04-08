const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth');

// Todas las rutas del carrito requieren autenticación
router.get('/', verifyToken, getCart);
router.post('/', verifyToken, addToCart);
router.put('/:id', verifyToken, updateQuantity);
router.delete('/clear', verifyToken, clearCart);
router.delete('/:id', verifyToken, removeFromCart);

module.exports = router;
