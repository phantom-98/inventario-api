import express from "express";
const router = express.Router();
import {
  	register,
	auth,
	checkToken,
	newPassword,
	getData,
	update,
	getOne,
	updated,
	deleteData
} from "../controllers/user.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/", register);
router.put("/", checkAuth, update);
router.put("/:id", checkAuth, updated);

router.post("/login", auth);
router.route("/forgot-password/:token").get(checkToken).post(newPassword);
router.get('/', checkAuth, getData)
router.get("/:id", checkAuth, getOne);
router.delete("/:id", checkAuth, deleteData);
export default router;
