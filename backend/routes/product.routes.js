const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const upload = require('../middleware/upload');

// Rutas públicas
router.get('/', getAll);
router.get('/:id', getById);

// Rutas protegidas (admin only)
router.post('/', verifyToken, isAdmin, upload.single('image'), validateProduct, create);
router.put('/:id', verifyToken, isAdmin, upload.single('image'), validateProduct, update);
router.delete('/:id', verifyToken, isAdmin, remove);

module.exports = router;
