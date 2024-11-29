
import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

export const query = async (
  text: string,
  params?: (string | number | boolean)[]
) => {
  const results = await pool.query(text, params);
  return results;
};

