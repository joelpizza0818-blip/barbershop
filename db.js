const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

/**
 * Construye la cadena de conexión ODBC usando Named Pipes.
 * Named Pipes no requiere SQL Server Browser ni TCP/IP habilitado.
 * El pipe para SQLEXPRESS es: \\.\pipe\MSSQL$SQLEXPRESS\sql\query
 */
const buildConnectionString = () => {
    const db     = process.env.DB_NAME;
    const driver = "ODBC Driver 17 for SQL Server";

    // Named Pipes: conecta directamente al pipe local de SQL Server
    // Esto evita depender del SQL Server Browser y de TCP/IP
    const namedPipe = String.raw`\\.\pipe\MSSQL$SQLEXPRESS\sql\query`;

    let cs = `Driver={${driver}};Server=${namedPipe};Database=${db};`;

    if (process.env.DB_USER && process.env.DB_PASSWORD) {
        cs += `Uid=${process.env.DB_USER};Pwd=${process.env.DB_PASSWORD};`;
    } else {
        cs += `Trusted_Connection=yes;`;
    }
    return cs;
};

const config = { connectionString: buildConnectionString() };

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
    } catch (err) {
        console.error("❌ Error al conectar a la base de datos:", err.message);
        pool = null; // reset para que reintente en la próxima llamada
        throw err;
    }
}

module.exports = { getConnection, sql };