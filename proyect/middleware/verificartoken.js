require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Middleware que verifica el JWT enviado en el header Authorization.
 * Añade req.usuarioId con el id del usuario autenticado.
 */
function verificarToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ ok: false, error: "No autorizado. Token requerido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ ok: false, error: "Token inválido o expirado." });
        }
        req.usuarioId = decoded.id;
        next();
    });
}

module.exports = { verificarToken };