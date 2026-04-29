const { getConnection, sql } = require("../../db");

/**
 * Busca un usuario por su email.
 * @param {string} email
 * @returns {object|null} Usuario encontrado o null
 */
async function findByEmail(email) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("email", sql.VarChar, email)
        .query("SELECT * FROM Users WHERE email = @email");
    return result.recordset[0] || null;
}

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {string} name
 * @param {string} email
 * @param {string} hashedPassword - Contraseña ya hasheada con bcrypt
 */
async function createUser(name, email, hashedPassword) {
    const pool = await getConnection();
    await pool.request()
        .input("name", sql.VarChar, name)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query("INSERT INTO Users (name, email, password, fecha_registro) VALUES (@name, @email, @password, GETDATE())");
}

module.exports = { findByEmail, createUser };
