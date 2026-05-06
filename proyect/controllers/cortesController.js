const { getAllCortes, getCorteById, crearCorte, actualizarCorte, eliminarCorte } = require("../models/cortesModel");

/**
 * GET /api/cortes
 * Lista todos los cortes de cabello (público).
 */
async function listarCortes(req, res) {
    try {
        const cortes = await getAllCortes();
        res.json({ ok: true, cortes });
    } catch (error) {
        console.error("❌ Error al listar cortes:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

/**
 * POST /api/cortes
 * Crea un nuevo corte (solo admin).
 */
async function crear(req, res) {
    const { nombre, precio, descripcion, foto_url, tipo } = req.body;

    if (!nombre?.trim() || precio == null) {
        return res.status(400).json({ ok: false, error: "Nombre y precio son obligatorios." });
    }

    if (isNaN(precio) || Number(precio) <= 0) {
        return res.status(400).json({ ok: false, error: "El precio debe ser un número positivo." });
    }

    try {
        const corte = await crearCorte({
            nombre: nombre.trim(),
            precio: Number(precio),
            descripcion: descripcion?.trim() || '',
            foto_url: foto_url?.trim() || '',
            tipo: tipo?.trim() || 'normal'
        });
        res.status(201).json({ ok: true, corte });
    } catch (error) {
        console.error("❌ Error al crear corte:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

/**
 * PUT /api/cortes/:id
 * Actualiza un corte existente (solo admin).
 */
async function editar(req, res) {
    const { id } = req.params;
    const { nombre, precio, descripcion, foto_url, tipo } = req.body;

    if (!nombre?.trim() || precio == null) {
        return res.status(400).json({ ok: false, error: "Nombre y precio son obligatorios." });
    }

    if (isNaN(precio) || Number(precio) <= 0) {
        return res.status(400).json({ ok: false, error: "El precio debe ser un número positivo." });
    }

    try {
        const existe = await getCorteById(Number(id));
        if (!existe) {
            return res.status(404).json({ ok: false, error: "Corte no encontrado." });
        }

        const corte = await actualizarCorte(Number(id), {
            nombre: nombre.trim(),
            precio: Number(precio),
            descripcion: descripcion?.trim() || '',
            foto_url: foto_url?.trim() || '',
            tipo: tipo?.trim() || 'normal'
        });
        res.json({ ok: true, corte });
    } catch (error) {
        console.error("❌ Error al editar corte:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

/**
 * DELETE /api/cortes/:id
 * Elimina un corte (solo admin).
 */
async function eliminar(req, res) {
    const { id } = req.params;

    try {
        const existe = await getCorteById(Number(id));
        if (!existe) {
            return res.status(404).json({ ok: false, error: "Corte no encontrado." });
        }

        await eliminarCorte(Number(id));
        res.json({ ok: true, mensaje: "Corte eliminado correctamente." });
    } catch (error) {
        console.error("❌ Error al eliminar corte:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

module.exports = { listarCortes, crear, editar, eliminar };
