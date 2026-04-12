import { query } from '../utils/db';
import { RegisterInput } from '../validators/auth.validator';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at?: Date;
}

export const findUserByEmail = async (email: string): Promise<UserRow | null> => {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows.length ? result.rows[0] : null;
};

export const createUser = async (user: RegisterInput): Promise<UserRow> => {
  const result = await query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
    [user.name, user.email, user.password]
  );
  return result.rows[0];
};
