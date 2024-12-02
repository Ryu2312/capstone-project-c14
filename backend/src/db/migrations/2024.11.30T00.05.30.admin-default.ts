import { Migration } from "../scripts/dbMigrate";
import bcrypt from "bcrypt";

export const up: Migration = async (params) => {
  const name = "Alexis Lazo";
  const email =  "alex23@gmail.com"
  const password = await bcrypt.hash("123456", 10);
  const age = 27;
  const role = "admin";
  
  await params.context.query(` 
      INSERT INTO users (name, email, age, role, password) 
      VALUES ($1, $2, $3, $4, $5)
    `, [name, email, age, role, password]);
};
export const down: Migration = async (params) => {
  await params.context.query(`DELETE FROM users;`);
};
