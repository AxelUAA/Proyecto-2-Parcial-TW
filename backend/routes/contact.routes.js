const express = require('express');
const router = express.Router();
const { create } = require('../controllers/contact.controller');
const validateContact = require('../middleware/validateContact');

// POST /api/contact (público, con validación)
router.post('/', validateContact, create);

module.exports = router;
