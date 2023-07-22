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
    exportFromExcel2
} from "../controllers/sale.js";

import checkAuth from "../middleware/checkAuth.js";
exportFromExcel2
router.get("/excelPos",  exportFromExcel)
router.get("/excelWeb",  exportFromExcel2)
router.get("/", checkAuth, getAll);
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