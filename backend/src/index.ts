import {app} from "./app";
import { pool } from "./db";

const PORT = process.env.PORT || 3000;

const gracefulShutdown = async () => {
    try {
        await pool.end()
    } catch (error) {
        console.error("\nError during shutdown:", error);
        process.exit(1);    
    } finally {
        console.log("\nApplication ended gracefully");
        process.exit(0);
    }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})