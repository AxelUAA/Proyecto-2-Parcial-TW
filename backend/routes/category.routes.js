const express = require('express');
const router = express.Router();
const { getAll } = require('../controllers/category.controller');

// GET /api/categories (público)
router.get('/', getAll);

module.exports = router;
