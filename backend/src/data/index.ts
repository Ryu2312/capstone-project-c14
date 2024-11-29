import { query } from "../db";

export class UsersData {
    static async verifyData({ email }: {  email: string }) {
    return (await query('SELECT * FROM users WHERE email = $1', [email])).rows[0];
  }
}