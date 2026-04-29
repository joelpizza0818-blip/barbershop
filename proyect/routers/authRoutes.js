const express = require("express");
const router = express.Router();
const { registro, login } = require("../controllers/authController");

// POST /api/registro — Crear cuenta nueva
router.post("/registro", registro);

// POST /api/login — Iniciar sesión
router.post("/login", login);

module.exports = router;
