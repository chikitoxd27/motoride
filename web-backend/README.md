# MotoRide Backend

Node.js + Express API backed by PostgreSQL that powers the MotoRide mobile app.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and adjust values as needed:
   ```bash
   cp .env.example .env
   ```
3. Create the database (via pgAdmin 4 or psql):
   ```sql
   CREATE DATABASE motoride;
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Key              | Description                                    | Default            |
| ---------------- | ---------------------------------------------- | ------------------ |
| `PORT`           | Port where the API listens                     | `5000`             |
| `DB_HOST`        | PostgreSQL host                                | `127.0.0.1`        |
| `DB_PORT`        | PostgreSQL port                                | `5432`             |
| `DB_NAME`        | Database name                                  | `motoride`         |
| `DB_USER`        | Database user                                  | `postgres`         |
| `DB_PASSWORD`    | Database password                              | `postgres`         |
| `DB_SSL`         | Set to `true` to enable SSL (e.g., hosted DBs) | `false`            |
| `JWT_SECRET`     | Secret key used to sign authentication tokens  | `super-secret-key` |
| `JWT_EXPIRES_IN` | Expiration window for issued JWTs              | `7d`               |

## Available Routes

| Method | Path                 | Description                  | Auth Required      |
| ------ | -------------------- | ---------------------------- | ------------------ |
| POST   | `/api/auth/register` | Register a new user          | No                 |
| POST   | `/api/auth/login`    | Authenticate and receive JWT | No                 |
| GET    | `/api/auth/me`       | Retrieve current user        | Yes (Bearer token) |
| GET    | `/api/health`        | Health check endpoint        | No                 |

Include the `Authorization: Bearer <token>` header when calling authenticated routes.

## Frontend Integration

- Point the mobile app's API calls to `http://localhost:5000` (or the configured `PORT`).
- After successful login, persist the returned `token` and attach it to the `Authorization` header for protected requests.
- Handle HTTP errors surfaced by the API (e.g., 400 validation errors, 401 unauthorized).
