import express from "express";
const router = express.Router();
import {
	createDte
} from "../controllers/openFactura.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/", checkAuth, createDte);



export default router;
