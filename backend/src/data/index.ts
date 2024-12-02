import { query } from "../db";
import { DataFromDb } from "../models/data.schema";

export class UserData  {
    static async verifyData({ email }: {  email: string }) : Promise<DataFromDb | undefined> {
   return (await query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
  }

  static async insertData(data: DataFromDb ): Promise<DataFromDb> {
    if( data.age ) {
      return (await query('INSERT INTO users (name, email, password, age, role) VALUES ($1, $2, $3, $4, $5) RETURNING name, email,age', [data.name, data.email, data.password, data.age, data.role])).rows[0];
       
    } 

  return (await query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING name, email', [data.name, data.email, data.password, data.role])).rows[0];
   
  }
}