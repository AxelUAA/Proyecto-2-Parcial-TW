const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');

// Rutas públicas
router.get('/', getAll);
router.get('/:id', getById);

// Rutas protegidas (admin only)
router.post('/', verifyToken, isAdmin, validateProduct, create);
router.put('/:id', verifyToken, isAdmin, validateProduct, update);
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
