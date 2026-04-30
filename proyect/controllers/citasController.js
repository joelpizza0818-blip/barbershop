const { crearCita, getMisCitas } = require("../models/citasModel");

/**
 * POST /api/agendar
 * Crea una nueva cita para el usuario autenticado.
 */
async function agendar(req, res) {
    const { name, service, date, time } = req.body;
    const id_usuario = req.usuarioId;

    // Validación de campos
    if (!name?.trim() || !service?.trim() || !date?.trim() || !time?.trim()) {
        return res.status(400).json({ ok: false, error: "Todos los campos son obligatorios." });
    }

    try {
        await crearCita({ id_usuario, service: service.trim(), date, time });
        res.status(201).json({ ok: true, mensaje: "Cita agendada con éxito." });
    } catch (error) {
        console.error("❌ Error al agendar cita:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

/**
 * GET /api/miscitas
 * Devuelve el total de citas y la próxima del usuario autenticado.
 */
async function miscitas(req, res) {
    const id_usuario = req.usuarioId;

    try {
        const datos = await getMisCitas(id_usuario);
        res.json({
            ok: true,
            total: datos.total,
            proxima: datos.proxima || "Sin citas próximas",
        });
    } catch (error) {
        console.error("❌ Error al obtener citas:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

module.exports = { agendar, miscitas };
