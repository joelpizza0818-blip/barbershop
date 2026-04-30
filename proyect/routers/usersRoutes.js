const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/verificartoken");
const { verificarAdmin } = require("../middleware/verificarAdmin");
const { listarUsuarios, cambiarRol } = require("../controllers/usersAdminController");

// GET /api/usuarios — Listar todos los usuarios (solo admin)
router.get("/usuarios", verificarToken, verificarAdmin, listarUsuarios);

// PUT /api/usuarios/:id/role — Cambiar rol de un usuario (solo admin)
router.put("/usuarios/:id/role", verificarToken, verificarAdmin, cambiarRol);

module.exports = router;
