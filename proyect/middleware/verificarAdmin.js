const { getConnection, sql } = require("../../db");

/**
 * Middleware que verifica que el usuario autenticado tiene rol 'admin'.
 * Debe usarse DESPUÉS de verificarToken (necesita req.usuarioId).
 */
async function verificarAdmin(req, res, next) {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("id", sql.Int, req.usuarioId)
            .query("SELECT role FROM Users WHERE id = @id");

        const user = result.recordset[0];
        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                ok: false,
                error: "Acceso denegado. Se requiere rol de administrador."
            });
        }

        req.usuarioRole = 'admin';
        next();
    } catch (error) {
        console.error("❌ Error al verificar rol admin:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

module.exports = { verificarAdmin };
