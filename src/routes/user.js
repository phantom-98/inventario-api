import express from "express";
const router = express.Router();
import {
  	register,
	auth,
	checkToken,
	newPassword,
	getData,
	update
} from "../controllers/user.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/", register);
router.put("/", checkAuth, update);
router.post("/login", auth);
router.route("/forgot-password/:token").get(checkToken).post(newPassword);
router.get('/', checkAuth, getData)

export default router;
