import express from "express";
const router = express.Router();
import {
	getAll,
	getOne,
	register,
	update,
	deleteData,
	download,
	createforWeb
} from "../controllers/factura.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/download/:name", download);

router.get("/", checkAuth, getAll);
router.get("/:id", checkAuth, getOne);
//TODO auth token for web
router.post("/createforWeb", createforWeb);

router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);

export default router;
