import { query } from "../config/db.js";

const mapUserRow = (row, { includePassword = false } = {}) => {
  if (!row) return null;

  const mapped = {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
  };

  if (includePassword) {
    mapped.passwordHash = row.password_hash;
  }

  return mapped;
};

export const findUserByEmail = async (email) => {
  const { rows } = await query("SELECT * FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);
  return mapUserRow(rows[0], { includePassword: true });
};

export const findUserById = async (id) => {
  const { rows } = await query(
    "SELECT id, full_name, email FROM users WHERE id = $1",
    [id],
  );
  return mapUserRow(rows[0]);
};

export const createUser = async ({ fullName, email, passwordHash }) => {
  const { rows } = await query(
    `INSERT INTO users (full_name, email, password_hash, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, full_name, email`,
    [fullName, email.toLowerCase(), passwordHash],
  );

  return mapUserRow(rows[0]);
};
