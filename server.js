require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./proyect/routers/authRoutes");
const citasRoutes = require("./proyect/routers/citasRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware global ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Rutas ───────────────────────────────────────────────────────────────────
app.use("/api", authRoutes);   // POST /api/registro  |  POST /api/login
app.use("/api", citasRoutes);  // POST /api/agendar   |  GET  /api/miscitas

// ─── 404 catch-all ───────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ ok: false, error: "Ruta no encontrada." });
});

// ─── Error handler global ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error("❌ Error no manejado:", err.message);
    res.status(500).json({ ok: false, error: "Error interno del servidor." });
});

// ─── Iniciar servidor ────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});