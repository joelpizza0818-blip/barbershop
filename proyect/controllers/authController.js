const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByEmail, createUser } = require("../models/userModel");

/**
 * POST /api/registro
 * Registra un nuevo usuario.
 */
async function registro(req, res) {
    const { name, email, password } = req.body;

    // Validación de campos
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({ ok: false, error: "Todos los campos son obligatorios." });
    }

    try {
        // Verificar si el email ya existe
        const existe = await findByEmail(email);
        if (existe) {
            return res.status(409).json({ ok: false, error: "El correo ya está registrado." });
        }

        const hash = await bcrypt.hash(password, 10);
        await createUser(name.trim(), email.trim(), hash);

        res.status(201).json({
            ok: true,
            user: {
                nombre: name.trim(),
                email: email.trim(),
                miembro_desde: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("❌ Error en registro:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

/**
 * POST /api/login
 * Autentica un usuario y devuelve un JWT.
 */
async function login(req, res) {
    const { email, password } = req.body;

    // Validación de campos
    if (!email?.trim() || !password?.trim()) {
        return res.status(400).json({ ok: false, error: "Email y contraseña son obligatorios." });
    }

    try {
        const user = await findByEmail(email.trim());
        if (!user) {
            return res.status(401).json({ ok: false, error: "Email no registrado." });
        }

        const passwordValida = await bcrypt.compare(password, user.password);
        if (!passwordValida) {
            return res.status(401).json({ ok: false, error: "Contraseña incorrecta." });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            ok: true,
            token,
            user: {
                nombre: user.name,
                email: user.email,
                miembro_desde: user.fecha_registro,
            },
        });
    } catch (error) {
        console.error("❌ Error en login:", error.message);
        res.status(500).json({ ok: false, error: "Error interno del servidor." });
    }
}

module.exports = { registro, login };
