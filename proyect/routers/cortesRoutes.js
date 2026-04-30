const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/verificartoken");
const { verificarAdmin } = require("../middleware/verificarAdmin");
const { listarCortes, crear, editar, eliminar } = require("../controllers/cortesController");

// GET /api/cortes — Listar todos los cortes (público)
router.get("/cortes", listarCortes);

// POST /api/cortes — Crear corte (solo admin)
router.post("/cortes", verificarToken, verificarAdmin, crear);

// PUT /api/cortes/:id — Editar corte (solo admin)
router.put("/cortes/:id", verificarToken, verificarAdmin, editar);

// DELETE /api/cortes/:id — Eliminar corte (solo admin)
router.delete("/cortes/:id", verificarToken, verificarAdmin, eliminar);

module.exports = router;
