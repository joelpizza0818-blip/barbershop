/**
 * Script de inicialización de base de datos
 * Crea las tablas necesarias si no existen
 * Uso: node init-db.js
 */

const sql = require("mssql/msnodesqlv8");
require("dotenv").config();

const DEBUG = process.env.DB_DEBUG === "true";

// Reutilizar la lógica de db.js
const getWindowsAuthConfig = () => {
    const db = process.env.DB_NAME || "barberia";
    const instance = process.env.DB_INSTANCE_WINDOWS || "SQLEXPRESS";
    const driver = "ODBC Driver 17 for SQL Server";
    const namedPipe = String.raw`\\.\pipe\MSSQL$${instance}\sql\query`;
    const connectionString = `Driver={${driver}};Server=${namedPipe};Database=${db};Trusted_Connection=yes;`;
    return { connectionString };
};

const getSqlAuthConfig = () => {
    const db = process.env.DB_NAME || "barberia";
    const server = process.env.DB_SERVER || "localhost";
    const port = process.env.DB_PORT || "49814";
    const user = process.env.DB_USER || "sa";
    const password = process.env.DB_PASSWORD || "123456";
    const driver = "ODBC Driver 17 for SQL Server";
    const connectionString = `Driver={${driver}};Server=${server},${port};Database=${db};Uid=${user};Pwd=${password};`;
    return { connectionString };
};

async function attemptConnection(config, authMethod, retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const connection = await sql.connect(config);
            console.log(`✅ Conectado con ${authMethod} Authentication`);
            return connection;
        } catch (err) {
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }
    }
    return null;
}

async function getConnection() {
    try {
        const windowsConfig = getWindowsAuthConfig();
        let pool = await attemptConnection(windowsConfig, "Windows", 2);
        if (pool && pool.connected) return pool;
    } catch (err) {
        if (DEBUG) console.log("Windows Auth intentado...");
    }

    try {
        const sqlConfig = getSqlAuthConfig();
        let pool = await attemptConnection(sqlConfig, "SQL", 2);
        if (pool && pool.connected) return pool;
    } catch (err) {
        if (DEBUG) console.log("SQL Auth intentado...");
    }

    throw new Error("No se pudo conectar a la base de datos");
}

// ============================================================
// SCRIPT DE INICIALIZACIÓN
// ============================================================

const CREATE_TABLES_SQL = `

-- ===== TABLA: Users =====
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users')
BEGIN
    CREATE TABLE Users (
        id INT PRIMARY KEY IDENTITY(1,1),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        fecha_registro DATETIME DEFAULT GETDATE(),
        role VARCHAR(50) DEFAULT 'usuario'
    );
    PRINT '✅ Tabla Users creada';
END
ELSE
    PRINT '⚠️  Tabla Users ya existe';

-- ===== TABLA: Cortes =====
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Cortes')
BEGIN
    CREATE TABLE Cortes (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        descripcion TEXT,
        foto_url VARCHAR(500)
    );
    PRINT '✅ Tabla Cortes creada';
END
ELSE
    PRINT '⚠️  Tabla Cortes ya existe';

-- ===== TABLA: Citas =====
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Citas')
BEGIN
    CREATE TABLE Citas (
        id INT PRIMARY KEY IDENTITY(1,1),
        id_usuario INT NOT NULL,
        service VARCHAR(255) NOT NULL,
        [date] DATE NOT NULL,
        [time] VARCHAR(5) NOT NULL,
        fecha_creacion DATETIME DEFAULT GETDATE(),
        FOREIGN KEY (id_usuario) REFERENCES Users(id) ON DELETE CASCADE
    );
    PRINT '✅ Tabla Citas creada';
END
ELSE
    PRINT '⚠️  Tabla Citas ya existe';

-- ===== TABLA: Roles =====
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Roles')
BEGIN
    CREATE TABLE Roles (
        id INT PRIMARY KEY IDENTITY(1,1),
        nombre VARCHAR(50) UNIQUE NOT NULL,
        descripcion VARCHAR(255)
    );
    
    INSERT INTO Roles (nombre, descripcion) VALUES ('admin', 'Administrador');
    INSERT INTO Roles (nombre, descripcion) VALUES ('usuario', 'Usuario regular');
    
    PRINT '✅ Tabla Roles creada con datos iniciales';
END
ELSE
    PRINT '⚠️  Tabla Roles ya existe';

`;

async function initializeDatabase() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║        🗄️  INICIALIZACIÓN DE BASE DE DATOS                 ║
╚════════════════════════════════════════════════════════════╝
`);

    let pool;
    try {
        pool = await getConnection();
        console.log(`\n📊 Base de datos: ${process.env.DB_NAME}\n`);

        // Ejecutar script de creación de tablas
        console.log("Creando tablas...\n");
        await pool.request().batch(CREATE_TABLES_SQL);

        console.log("\n✅ Base de datos inicializada correctamente\n");

        // Verificar tablas creadas
        console.log("📋 Tablas en la base de datos:");
        const result = await pool.request().query(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"
        );
        
        result.recordset.forEach(row => {
            console.log(`   ✓ ${row.TABLE_NAME}`);
        });

        console.log("\n🎉 Listo para usar!\n");

    } catch (error) {
        console.error("\n❌ Error durante inicialización:", error.message);
        console.error("\n💡 Posibles soluciones:");
        console.error("   1. Verifica que la base de datos exista");
        console.error("   2. Verifica la conexión con: npm run test:db");
        console.error("   3. Verifica que SQL Server esté ejecutándose");
        process.exit(1);
    } finally {
        if (pool) await pool.close();
    }
}

initializeDatabase();
