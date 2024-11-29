import { query } from "../db";
import { DataFromDb, DataRegister } from "../models/data.schema";

export class UserData  {
    static async verifyData({ email }: {  email: string }) : Promise<DataFromDb | undefined> {
    return (await query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
  }

  static async insertData(data: DataRegister ): Promise<number> {
    if( data.age ) {
      return (await query('INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, $5)', [data.name, data.email, data.password, data.age, data.role])).rowCount ?? 0;
    } 

    return (await query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [data.name, data.email, data.password, data.role])).rowCount ?? 0;
  }
}