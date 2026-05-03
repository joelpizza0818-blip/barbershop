require("dotenv").config();
const { createUser } = require("./proyect/models/userModel");

async function test() {
    try {
        const id = await createUser("Test User", "test" + Date.now() + "@test.com", "password");
        console.log("Created user ID:", id);
        process.exit(0);
    } catch (err) {
        console.error("Crash:", err);
        process.exit(1);
    }
}
test();
