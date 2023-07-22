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
    getPerMonthandProvider,
	getReceivedDte,
	receivedDetails,
	getReceivedDteforApi,
	getReceivedDteforApi2,
    getReceivedDteforApi3,
    changeStatus,
    exportFromExcel,
    checkProviders
} from "../controllers/factura.js";

import checkAuth from "../middleware/checkAuth.js";

router.post("/receivedDte", checkAuth, receivedDetails)
router.get("/getPerMonthandProvider",  getPerMonthandProvider)
router.get("/exportFromExcel/:status",  exportFromExcel)
router.get("/getReceivedDteforApi", checkAuth, getReceivedDteforApi)
router.get("/getReceivedDteforApi2", checkAuth, getReceivedDteforApi2)
router.get("/getReceivedDteforApi3", checkAuth, getReceivedDteforApi3)
router.get("/receivedDte",  getReceivedDte)
router.get("/checkProviders",  checkProviders)
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
