import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/mongoDb.js";
import fs from "fs";
import userRoutes from "./routes/user.js";
import storeRoutes from "./routes/store.js";
import productRoutes from "./routes/product.js";
import clientRoutes from "./routes/clients.js";
import OfRoutes from "./routes/openfactura.js";
import facturaRoutes from "./routes/factura.js";
import emisorRoutes from "./routes/emisor.js";
import cashRoutes from "./routes/cash.js";
import saleRoutes from "./routes/sale.js";
import providerRoutes from "./routes/provider.js";
import settingRoutes from "./routes/settings.js";
import purchaseRoutes from "./routes/purchase.js";
import subCategoryRoutes from "./routes/subCategory.js";
import locationRoutes from "./routes/location.js";
import LaboratoryRoutes from "./routes/laboratory.js";
import PriceLogsRoutes from "./routes/priceLogs.js";
import path from "path";
import { fileURLToPath } from "url";
import { createJwtWeb } from "./helpers/auth.js";

import { writeStockDataToKafka } from "./kafka/stock.kafka.js";

import "./db/index.js";

const app = express();
app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.urlencoded(/* { limit: "50mb", extended: true } */));

//app.use(fileUpload());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dte/"));

dotenv.config();

conectarDB();

app.use(cors());

app.get("/setToken", async (req, res) => {
  let jwt = createJwtWeb();
  res.json(jwt);
});

app.get("/send-message", async (req, res) => {
  writeStockDataToKafka({ sku: 45336, stock: 5, calc: "+" });
  res.json("check");
});

//readMessages()
// Routing
app.use("/v1/users", userRoutes);
app.use("/v1/openfactura", OfRoutes);
app.use("/v1/stores", storeRoutes);
app.use("/v1/product", productRoutes);
app.use("/v1/subcategory", subCategoryRoutes);
app.use("/v1/location", locationRoutes);
app.use("/v1/laboratory", LaboratoryRoutes);
app.use("/v1/priceLogs", PriceLogsRoutes);
app.use("/v1/client", clientRoutes);
app.use("/v1/factura", facturaRoutes);
app.use("/v1/emisor", emisorRoutes);
app.use("/v1/cash", cashRoutes);
app.use("/v1/sale", saleRoutes);
app.use("/v1/provider", providerRoutes);
app.use("/v1/setting", settingRoutes);
app.use("/v1/purchase", purchaseRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
