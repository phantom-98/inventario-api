import express from "express";
const router = express.Router();
import {
	getAll,
	getOne,
	register,
	update,
	deleteData,
    movement
} from "../controllers/cash.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
router.patch("/movement/:id", checkAuth, movement);
router.get("/:id", checkAuth, getOne);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);

export default router;
