import express from "express";
const router = express.Router();
import {
  	getData
} from "../controllers/logs.js";

import checkAuth from "../middleware/checkAuth.js";


router.get('/', checkAuth, getData)

export default router;
