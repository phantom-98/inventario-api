import express from "express";
import { getAll } from "../controllers/laboratory.js";

const router = express.Router();

router.get("/", getAll);

export default router;
