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
	updateStock,
    deletePrices,
    importRopFromExcel,
    changeRop,
    changeNll,
    syncProductsStock,
    downloadRop
} from "../controllers/products.js";

import checkAuth from "../middleware/checkAuth.js";

router.get("/", checkAuth, getAll);
router.get("/syncProductsStock", syncProductsStock);
//TODO auth token for web
router.get("/downloadRop",  downloadRop)
router.get("/stockByCode/:barCode", stockByCode);
router.put("/changeRop/:id", changeRop);
router.put("/changeNll/:id", changeNll);

router.put("/prices/:sku",  updatePrices);
router.put("/deletePrices/:sku",  deletePrices);
router.get("/sku/:sku",  getSku);
router.put("/sku/:sku",  updateSku);
router.put("/updateStock",  updateStock);
router.get("/:id", checkAuth, getOne);
router.post("/import", checkAuth, importFromExcel);
router.post("/importRop", checkAuth, importRopFromExcel);
router.post("/", checkAuth, register);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);






export default router;
