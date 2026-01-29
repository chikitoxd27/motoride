import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "motoride",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

export const query = (text, params) => pool.query(text, params);

const ensureSchema = async () => {
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const createDriverApplicationsTableQuery = `
    CREATE TABLE IF NOT EXISTS driver_applications (
      id SERIAL PRIMARY KEY,
      account_info JSONB NOT NULL,
      personal_info JSONB NOT NULL,
      drivers_license JSONB NOT NULL,
      emergency_contact JSONB NOT NULL,
      vehicle_info JSONB NOT NULL,
      vehicle_documents JSONB NOT NULL,
      vehicle_photos JSONB NOT NULL,
      vehicle_ownership JSONB NOT NULL,
      government_ids JSONB NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  await pool.query(createUsersTableQuery);
  await pool.query(createDriverApplicationsTableQuery);
};

const connectDB = async () => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await ensureSchema();
    console.log("✅ Connected to PostgreSQL");
    return pool;
  } catch (error) {
    console.error("❌ PostgreSQL connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
