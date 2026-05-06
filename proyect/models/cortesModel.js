const { getConnection, sql } = require("../../db");

/**
 * Obtiene todos los cortes de cabello registrados.
 * @returns {Array<{id, nombre, precio, descripcion, foto_url, created_at}>}
 */
async function getAllCortes() {
    const pool = await getConnection();
    const result = await pool.request()
        .query("SELECT id, nombre, precio, descripcion, foto_url, tipo, created_at FROM Cortes ORDER BY id ASC");
    return result.recordset;
}

/**
 * Obtiene un corte por su ID.
 * @param {number} id
 * @returns {object|null}
 */
async function getCorteById(id) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Cortes WHERE id = @id");
    return result.recordset[0] || null;
}

/**
 * Crea un nuevo corte de cabello.
 * @param {{nombre: string, precio: number, descripcion: string, foto_url: string, tipo: string}} datos
 */
async function crearCorte(datos) {
    const { nombre, precio, descripcion, foto_url, tipo } = datos;
    const pool = await getConnection();
    const result = await pool.request()
        .input("nombre",      sql.VarChar(100), nombre)
        .input("precio",      sql.Decimal(10, 2), precio)
        .input("descripcion", sql.VarChar(500), descripcion || '')
        .input("foto_url",    sql.VarChar(500), foto_url || '')
        .input("tipo",        sql.VarChar(50), tipo || 'normal')
        .query(`
            INSERT INTO Cortes (nombre, precio, descripcion, foto_url, tipo)
            OUTPUT INSERTED.*
            VALUES (@nombre, @precio, @descripcion, @foto_url, @tipo)
        `);
    return result.recordset[0];
}

/**
 * Actualiza un corte existente.
 * @param {number} id
 * @param {{nombre: string, precio: number, descripcion: string, foto_url: string, tipo: string}} datos
 */
async function actualizarCorte(id, datos) {
    const { nombre, precio, descripcion, foto_url, tipo } = datos;
    const pool = await getConnection();
    const result = await pool.request()
        .input("id",          sql.Int, id)
        .input("nombre",      sql.VarChar(100), nombre)
        .input("precio",      sql.Decimal(10, 2), precio)
        .input("descripcion", sql.VarChar(500), descripcion || '')
        .input("foto_url",    sql.VarChar(500), foto_url || '')
        .input("tipo",        sql.VarChar(50), tipo || 'normal')
        .query(`
            UPDATE Cortes
            SET nombre = @nombre, precio = @precio, descripcion = @descripcion, foto_url = @foto_url, tipo = @tipo
            WHERE id = @id;
            SELECT * FROM Cortes WHERE id = @id;
        `);
    return result.recordset[0] || null;
}

/**
 * Elimina un corte por su ID.
 * @param {number} id
 * @returns {number} Filas afectadas
 */
async function eliminarCorte(id) {
    const pool = await getConnection();
    const result = await pool.request()
        .input("id", sql.Int, id)
        .query("DELETE FROM Cortes WHERE id = @id");
    return result.rowsAffected[0];
}

module.exports = { getAllCortes, getCorteById, crearCorte, actualizarCorte, eliminarCorte };
