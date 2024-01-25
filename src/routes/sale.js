import express from "express";
const router = express.Router();
import {
	getAll,
	getOne,
	register,
	update,
	deleteData,
    getAll2,
    salePerMonth,
    saveVoucher,
    saleAfter,
    exportFromExcel,
    salePerDay,
    getAll3,
    exportFromExcel2,
    getPos,
    getContribution
} from "../controllers/sale.js";

import checkAuth from "../middleware/checkAuth.js";
router.get("/getContribution",  getContribution)
router.get("/excelPos/:startAt/:endAt",  exportFromExcel)
router.get("/excelWeb/:startAt/:endAt",  exportFromExcel2)
router.get("/", checkAuth, getAll);
router.get("/getPos", checkAuth, getPos);
router.get("/all", checkAuth, getAll2);
router.get("/all3", checkAuth, getAll3);
router.get("/salePerMonth", salePerMonth);
router.get("/saleAfter/:after", checkAuth, saleAfter);
router.put("/sale/voucher/:id", saveVoucher);
router.get("/:id", checkAuth, getOne);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);
router.get("/salePerDay", checkAuth, salePerDay)

export default router;