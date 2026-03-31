const jwt = require("jsonwebtoken");

const SECRET = "barbershop_secret_2024"; // ← el mismo que tienes en server.js

function verificarToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "No autorizado" });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        req.usuarioId = decoded.id;
        next();
    });
}

module.exports = { verificarToken, SECRET };