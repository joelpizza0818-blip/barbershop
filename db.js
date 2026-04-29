const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true,
        trustServerCertificate: true,
    },
};

let pool = null;

/**
 * Devuelve la conexión al pool (singleton).
 * Reutiliza la conexión si ya existe y está activa.
 */
async function getConnection() {
    if (pool && pool.connected) return pool;
    try {
        pool = await sql.connect(config);
        console.log("✅ Conectado a la base de datos:", process.env.DB_NAME);
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        throw error;
    }
}

module.exports = { getConnection, sql };