const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/verificartoken");
const { agendar, miscitas } = require("../controllers/citasController");

// POST /api/agendar — Crear cita (requiere token)
router.post("/agendar", verificarToken, agendar);

// GET /api/miscitas — Ver mis citas (requiere token)
router.get("/miscitas", verificarToken, miscitas);

module.exports = router;
