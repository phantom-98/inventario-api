import express from "express";
import {
  createOne,
  deleteOne,
  findByProductId,
  findLatestByProductId,
  getAll,
} from "../controllers/priceLogs.js";

const router = express.Router();

router.get("/", getAll);
router.get("/:id", findByProductId);
router.get("/latest/:id", findLatestByProductId);
router.post("/", createOne);
router.delete("/:id", deleteOne);

export default router;
