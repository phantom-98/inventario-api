import express from "express";
import {
  createOne,
  deleteOne,
  findByProductId,
  findLatestByProductId,
  getAll,
} from "../controllers/priceLogs.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", findByProductId);
router.get("/latest/:id", findLatestByProductId);
router.post("/",checkAuth, createOne);
router.delete("/:id",checkAuth, deleteOne);

export default router;
