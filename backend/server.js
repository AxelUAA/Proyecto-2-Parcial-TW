const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const categoryRoutes = require('./routes/category.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();

// =============================================
// Middleware Global
// =============================================
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =============================================
// Routes
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'BackpackBoyz API is running ',
        timestamp: new Date().toISOString()
    });
});

// =============================================
// 404 — Route not found
// =============================================
app.use((req, res) => {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// =============================================
// Global Error Handler
// =============================================
app.use((err, req, res, next) => {
    console.error('❌ Error no controlado:', err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// =============================================
// Start Server
// =============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n BackpackBoyz API running on http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health\n`);
});
