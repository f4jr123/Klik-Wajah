const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    // Mengambil header Authorization
    const authHeader = req.headers['authorization'];

    // Format biasanya: "Bearer <token>"
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        return res.status(401).json({
            status: false,
            message: 'Akses ditolak. Token tidak ditemukan.'
        });
    }

    // Memverifikasi token menggunakan secret dari .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                status: false,
                message: 'Token tidak valid atau sudah kadaluarsa.'
            });
        }

        // Menyimpan data hasil decode (userId, role) ke object request
        req.user = decoded;
        next();
    });
}

module.exports = verifyToken;