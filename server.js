const express = require("express");
const { verificarToken, SECRET } = require("./proyect/middleware/verificartoken");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getConnection, sql } = require("./db");

app.use(cors());
app.use(express.json());

app.post('/api/registro', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const pool = await getConnection();
        const hash = await bcrypt.hash(password, 10);

        await pool.request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hash)
            .query("INSERT INTO Users (name, email, password, fecha_registro) VALUES (@name, @email, @password, GETDATE())");

        res.json({ ok: true, user: { nombre: name, email: email, miembro_desde: new Date().toISOString() } });
    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        if (result.recordset.length === 0)
            return res.status(401).json({ ok: false, error: "Email no registrado" });

        const user = result.recordset[0];
        const Vpassword = await bcrypt.compare(password, user.password);

        if (!Vpassword)
            return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
        res.json({ ok: true, token, user: { nombre: user.name, email: user.email, miembro_desde: user.fecha_registro } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/agendar', verificarToken, async (req, res) => {
    const { name, service, date, time } = req.body; // ← nombres correctos
    const id_usuario = req.usuarioId;               // ← nombre correcto

    console.log("Datos recibidos:", { id_usuario, name, service, date, time }); // ← para depurar

    try {
        const pool = await getConnection();

        await pool.request()
            .input("id_usuario", sql.Int, id_usuario)   // ← coincide con tu tabla
            .input("name", sql.VarChar, name)
            .input("service", sql.VarChar, service)
            .input("date", sql.Date, date)
            .input("time", sql.Time, time)
            .query(`INSERT INTO Citas (id_usuario, name, service, date, time) 
                    VALUES (@id_usuario, @name, @service, @date, @time)`);

        res.json({ ok: true, mensaje: "Cita agendada con éxito" });
    } catch (error) {
        console.error("Error:", error.message); // ← ver error en terminal
        res.status(500).json({ ok: false, error: error.message });
    }
});


app.get('/api/miscitas', verificarToken, async (req, res) => {
    const id_usuario = req.usuarioId;
    try {
        const pool = await getConnection();

        const result = await pool.request()
            .input("id_usuario", sql.Int, id_usuario)
            .query(`
                SELECT 
                    COUNT(*) AS total,
                    (SELECT TOP 1 service + ' — ' + CONVERT(VARCHAR, date, 103) 
                     FROM Citas 
                     WHERE id_usuario = @id_usuario 
                     AND date >= CAST(GETDATE() AS DATE)
                     ORDER BY date ASC) AS proxima
                FROM Citas 
                WHERE id_usuario = @id_usuario
            `);

        const datos = result.recordset[0];
        res.json({
            ok: true,
            total: datos.total,
            proxima: datos.proxima || 'Sin citas próximas'
        });

    } catch (error) {
        res.status(500).json({ ok: false, error: error.message });
    }
});
app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));