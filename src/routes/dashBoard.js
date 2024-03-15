import express from "express";
const router = express.Router();

import checkAuth from "../middleware/checkAuth.js";
import { getAll, updateDash } from "../controllers/dashBoard.js";

router.get("/", getAll);
router.get("/update", updateDash);

export default router;
