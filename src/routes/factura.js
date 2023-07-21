import express from "express";
const router = express.Router();
import {
	getAll,
	getOne,
	register,
	update,
	deleteData,
	download,
	createforWeb,
	createforPos,
	test,
	getReceivedDte,
	receivedDetails,
	getReceivedDteforApi,
	getReceivedDteforApi2,
    getReceivedDteforApi3,
    changeStatus
} from "../controllers/factura.js";

import checkAuth from "../middleware/checkAuth.js";
getReceivedDteforApi
router.post("/receivedDte", checkAuth, receivedDetails)
router.get("/getReceivedDteforApi", checkAuth, getReceivedDteforApi)
router.get("/getReceivedDteforApi2", checkAuth, getReceivedDteforApi2)
router.get("/getReceivedDteforApi3", checkAuth, getReceivedDteforApi3)
router.get("/receivedDte", checkAuth, getReceivedDte)
router.get("/test", test);
router.post("/createforPos", checkAuth, createforPos);
router.get("/download/:name", download);
router.put("/changeStatus/:id", changeStatus);

router.get("/", checkAuth, getAll);
router.get("/:id", checkAuth, getOne);
//TODO auth token for web
router.post("/createforWeb", createforWeb);

router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);


export default router;
