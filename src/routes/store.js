import express from "express";
const router = express.Router();
import {
	register,
	update,
	getAll,
 	getOne,
	 deleteData
} from "../controllers/stores.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
router.get("/:id", checkAuth, getOne);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);


export default router;
