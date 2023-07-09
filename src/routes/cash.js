import express from "express";
const router = express.Router();
import {
	getAll,
	getOne,
	register,
	update,
    registerBox,
	deleteData,
    movement
} from "../controllers/cash.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
router.patch("/movement/:id", checkAuth, movement);
router.put("/registerBox/:id", checkAuth, registerBox);
router.get("/:id", checkAuth, getOne);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);

export default router;
