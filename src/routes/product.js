import express from "express";
const router = express.Router();
import {
	register,
	update,
	getAll,
 	getOne,
	importFromExcel,
	deleteData,
	stockByCode,
	getSku,
	updateSku,
    updatePrices,
	updateStock
} from "../controllers/products.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
//TODO auth token for web
router.get("/stockByCode/:barCode", stockByCode);

router.put("/prices/:sku",  updatePrices);
router.get("/sku/:sku",  getSku);
router.put("/sku/:sku",  updateSku);
router.put("/updateStock",  updateStock);
router.get("/:id", checkAuth, getOne);
router.post("/import", checkAuth, importFromExcel);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);



export default router;
