"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./db");
const PORT = process.env.PORT || 3000;
const gracefulShutdown = async () => {
    try {
        await db_1.pool.end();
    }
    catch (error) {
        console.error("\nError during shutdown:", error);
        process.exit(1);
    }
    finally {
        console.log("\nApplication ended gracefully");
        process.exit(0);
    }
};
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
app_1.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
