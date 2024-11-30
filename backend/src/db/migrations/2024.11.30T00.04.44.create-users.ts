import { Migration } from "../scripts/dbMigrate";

export const up: Migration = async (params) => {
  await params.context.query(` 
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      age INT,
      CHECK (age > 0),
      role VARCHAR(6) NOT NULL DEFAULT user,
      password VARCHAR(100) NOT NULL DEFAULT 123456
    );
  `);
};
export const down: Migration = async (params) => {
  await params.context.query(`DROP TABLE IF EXISTS users;`);
};
