import express from "express";
import { createDriverApplication } from "../controllers/driverApplicationController.js";

const router = express.Router();

router.post("/", createDriverApplication);

export default router;
