const express = require('express');
const router = express.Router();
const { register, login, updateProfile } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// PUT /api/auth/profile
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
