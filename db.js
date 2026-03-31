const sql = require("mssql/msnodesqlv8");

const config = {

    server: 'DESKTOP-AAHT4C4\\HOLA',
    database: 'barberia',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        console.log("Conectado a la base de datos");
        return pool;
    } catch (error) {
        console.error("error al conectar a la base de datos", error);
        throw error; // Lanzar el error para que el servidor sepa que falló
    }
}

module.exports = { getConnection, sql };