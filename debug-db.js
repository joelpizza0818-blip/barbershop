/**
 * Quick DB diagnostic: test connection + check if Users table exists
 */
require("dotenv").config();
const { getConnection, sql } = require("./db");

async function diagnose() {
    console.log("\n=== DB DIAGNOSTIC ===\n");
    try {
        console.log("1. Attempting connection...");
        const pool = await getConnection();
        console.log("   ✅ Connection successful!\n");

        console.log("2. Checking tables...");
        const tables = await pool.request().query(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME"
        );
        console.log("   Tables found:", tables.recordset.map(r => r.TABLE_NAME));

        // Check Users table structure
        console.log("\n3. Users table columns:");
        const cols = await pool.request().query(
            "SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='Users' ORDER BY ORDINAL_POSITION"
        );
        cols.recordset.forEach(c => {
            console.log(`   - ${c.COLUMN_NAME} (${c.DATA_TYPE}${c.CHARACTER_MAXIMUM_LENGTH ? '(' + c.CHARACTER_MAXIMUM_LENGTH + ')' : ''}, nullable: ${c.IS_NULLABLE})`);
        });

        // Try a test insert
        console.log("\n4. Testing INSERT into Users...");
        try {
            const result = await pool.request()
                .input("name", sql.VarChar, "DiagTest")
                .input("email", sql.VarChar, "diag_" + Date.now() + "@test.com")
                .input("password", sql.VarChar, "$2a$10$fakehashfordiagnosticpurposes1234567890")
                .query("INSERT INTO Users (name, email, password, fecha_registro) VALUES (@name, @email, @password, GETDATE()); SELECT SCOPE_IDENTITY() AS newId;");
            console.log("   ✅ INSERT successful! New ID:", result.recordset[0]?.newId);

            // Clean up test row
            await pool.request()
                .input("email2", sql.VarChar, result.recordset[0]?.newId ? "cleanup" : "")
                .query(`DELETE FROM Users WHERE name='DiagTest'`);
            console.log("   🧹 Cleaned up test row.");
        } catch (insertErr) {
            console.error("   ❌ INSERT failed:", insertErr.message);
            console.error("   Full error:", insertErr);
        }

        // Count existing users
        console.log("\n5. Existing users:");
        const users = await pool.request().query("SELECT id, name, email, role FROM Users");
        users.recordset.forEach(u => console.log(`   - [${u.id}] ${u.name} (${u.email}) role=${u.role}`));

        await pool.close();
    } catch (err) {
        console.error("❌ Diagnostic failed:", err.message);
        console.error("Full error:", err);
    }
}

diagnose();
