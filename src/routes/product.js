import express from "express";
const router = express.Router();
import {
	register,
	update,
	getAll,
 	getOne,
	importFromExcel,
	deleteData,
	stockByCode
} from "../controllers/products.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
router.get("/:id", checkAuth, getOne);
router.post("/import", checkAuth, importFromExcel);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);

//TODO auth token for web
router.get("/stockByCode/:barCode", stockByCode);


export default router;
