const fs = require('fs');
const path = require('path');
const { getConnection } = require('./db.js');

async function runMigration() {
    try {
        console.log("Conectando a la base de datos...");
        const pool = await getConnection();
        console.log("Conexión exitosa.");

        const sqlScript = fs.readFileSync(path.join(__dirname, 'migracion_roles_cortes.sql'), 'utf8');
        
        // El script tiene varios GO, mssql no soporta GO en un solo request por defecto,
        // tenemos que separarlos
        const batches = sqlScript.split(/^\s*GO\s*$/im);

        for (const batch of batches) {
            // Eliminar sentencias USE y PRINT que mssql no soporta directamente
            const cleanBatch = batch
                .replace(/^\s*USE\s+\w+\s*;?\s*/im, '')   // quitar USE barberia;
                .trim();
            if (cleanBatch) {
                console.log("Ejecutando lote...");
                await pool.request().query(cleanBatch);
            }
        }
        
        console.log("✅ Migración ejecutada correctamente!");
        process.exit(0);
    } catch (e) {
        console.error("❌ Error en la migración:", e.message);
        process.exit(1);
    }
}

runMigration();
