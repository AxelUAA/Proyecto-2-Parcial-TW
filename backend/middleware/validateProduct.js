// Middleware: Validación de campos de producto
const validateProduct = (req, res, next) => {
    const { name, price, stock, category_id, brand } = req.body;
    const errors = [];

    // Validación de campos vacíos
    if (!name || name.trim() === '') {
        errors.push('El nombre del producto es obligatorio');
    }

    if (!brand || brand.trim() === '') {
        errors.push('La marca es obligatoria');
    }

    if (!category_id) {
        errors.push('La categoría es obligatoria');
    }

    // Validación de precio
    if (price === undefined || price === null) {
        errors.push('El precio es obligatorio');
    } else if (isNaN(price) || Number(price) <= 0) {
        errors.push('El precio debe ser mayor a 0');
    }

    // Validación de stock
    if (stock === undefined || stock === null) {
        errors.push('El stock es obligatorio');
    } else if (isNaN(stock) || Number(stock) < 0) {
        errors.push('El stock debe ser 0 o mayor');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Error de validación', errors });
    }

    next();
};

module.exports = validateProduct;
