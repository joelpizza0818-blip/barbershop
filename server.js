const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { getConnection, sql } = require("./db");
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/registro', async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        const pool = await getConnection();

        const hash = await bcrypt.hash(password, 10); // ← primero hashear

        await pool.request()
            .input("name", sql.VarChar, name)
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hash) // ← guardar hash
            .query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");

        res.json({ ok: true, user: { nombre: name, email: email } });

    } catch (error) {
        console.error(error); // ← ver en terminalz
        res.status(500).json({ ok: false, error: error.message }); // ← mandar error real al frontend
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await getConnection();
        if (!pool) throw new Error("No se pudo establecer conexión con la base de datos");

        const result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        if (result.recordset.length === 0) {
            return res.status(401).json({ ok: false, error: "Email no registrado" });
        }

        const user = result.recordset[0];
        const Vpassword = await bcrypt.compare(password, user.password);

        if (!Vpassword) {
            return res.status(401).json({ ok: false, error: "Contraseña incorrecta" });
        }

        // Ocultar password antes de devolver
        delete user.password;

        res.json({ ok: true, user: { nombre: user.name, email: user.email } });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/agendar', async (req, res) => {

    const { nombre, servicio, hora, fecha } = req.body;
    try {
        const pool = await getConnection();
        if (!pool) throw new Error("No se pudo establecer conexión con la base de datos");

        await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("servicio", sql.VarChar, servicio)
            .input("hora", sql.VarChar, hora)
            .input("fecha", sql.VarChar, fecha)
            .query("INSERT INTO Citas (nombre,servicio,hora,fecha) VALUES (@nombre,@servicio,@hora,@fecha)");
        res.json({ ok: true, mensaje: "Cita agendada con exito" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.listen(3000, () => console.log("🚀 Servidor corriendo en http://localhost:3000"));