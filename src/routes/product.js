import express from "express";
import multer from "multer";
import path from "path";
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
  downloadRop,
  getAll2,
  getSku2,
  updateSku2,
  register2,
  register3,
  updateProdImages,
  getProdImages,
  updateImages,
  deleteImage,
  downLoadInventory,
  getRopSales,
  requestProduct,
  requestProductInBulk,
  downloadStockDate,
  saveStock
} from "../controllers/products.js";

import checkAuth from "../middleware/checkAuth.js";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define the directory where the files should be stored
  },
  filename: function (req, file, cb) {
    // Generate the file name with its original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e3);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  storage: storage,
});
router.get("/saveStock",  saveStock);
router.get("/", checkAuth, getAll2);
router.put("/request/:sku", checkAuth, requestProduct);
router.post("/bulkRequest", requestProductInBulk);
router.get("/getForRop", checkAuth, getRopSales);
router.get("/syncProductsStock", syncProductsStock);
//TODO auth token for web

router.get("/downloadStockDate", downloadStockDate);
router.get("/downloadRop", downloadRop);
router.get("/downLoadInventory", downLoadInventory);
router.get("/stockByCode/:barCode", stockByCode);
router.put("/changeRop/:id", changeRop);
router.put("/changeNll/:id", changeNll);

router.put("/prices/:sku", updatePrices);
router.put("/deletePrices/:sku", deletePrices);
//router.get("/sku/:sku",  getSku);
router.get("/sku/:sku", getSku2);
router.get("/images/:id", getProdImages);
router.post("/images/:id", upload.array("files"), updateImages);
router.delete("/image/:id", deleteImage);
//router.put("/sku/:sku",  updateSku);
router.put("/sku/:sku",checkAuth, updateSku2);
router.put("/updateStock", updateStock);
router.get("/:id", checkAuth, getOne);
router.post("/import", checkAuth, importFromExcel);
router.post("/importRop", checkAuth, importRopFromExcel);
router.post("/updateImage", checkAuth, updateProdImages);
//router.post("/", checkAuth, register);
router.post("/", [checkAuth, upload.array("files")], register3);
router.put("/:id", checkAuth, update);
router.delete("/:id", checkAuth, deleteData);

export default router;
