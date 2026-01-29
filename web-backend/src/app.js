import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import driverApplicationRoutes from "./routes/driverApplicationRoutes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/driver-applications", driverApplicationRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

export default app;
