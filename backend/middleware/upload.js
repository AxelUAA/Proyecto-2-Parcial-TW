const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento físico
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Carpeta donde se guardarán los archivos
        cb(null, path.join(__dirname, '../uploads/products'));
    },
    filename: function (req, file, cb) {
        // Nombre único sumándole un timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato de archivo no válido. Solo JPG, PNG o WEBP.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
