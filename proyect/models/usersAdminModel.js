const { getConnection, sql } = require("../../db");

/**
 * Obtiene todos los usuarios (sin contraseña).
 * @returns {Array<{id, name, email, role, fecha_registro}>}
 */
async function getAllUsers() {
    const pool = await getConnection();
    const result = await pool.request()
        .query("SELECT id, name, email, role, fecha_registro FROM Users ORDER BY id ASC");
    return result.recordset;
}

/**
 * Actualiza el rol de un usuario.
 * @param {number} id
 * @param {string} role - 'admin' o 'usuario'
 */
async function updateUserRole(id, role) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .input("role", sql.VarChar(20), role)
        .query("UPDATE Users SET role = @role WHERE id = @id; SELECT id, name, email, role, fecha_registro FROM Users WHERE id = @id;");
    return result.recordset[0] || null;
}

module.exports = { getAllUsers, updateUserRole };
