// Middleware: Validación de mensaje de contacto
const validateContact = (req, res, next) => {
    const { name, email, subject, message } = req.body;
    const errors = [];

    // Validación de campos vacíos
    if (!name || name.trim() === '') {
        errors.push('El nombre es obligatorio');
    }

    if (!subject || subject.trim() === '') {
        errors.push('El asunto es obligatorio');
    }

    if (!message || message.trim() === '') {
        errors.push('El mensaje es obligatorio');
    }

    // Validación de email
    if (!email || email.trim() === '') {
        errors.push('El email es obligatorio');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('El formato del email no es válido');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Error de validación', errors });
    }

    next();
};

module.exports = validateContact;
