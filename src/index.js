import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/mongoDb.js";

import userRoutes from "./routes/user.js";
import storeRoutes from "./routes/store.js";
import productRoutes from "./routes/product.js"
import clientRoutes from "./routes/clients.js"
import OfRoutes from "./routes/openfactura.js";
import facturaRoutes from "./routes/factura.js";
import emisorRoutes from "./routes/emisor.js"
import cashRoutes from "./routes/cash.js"
import saleRoutes from "./routes/sale.js"
import path from 'path';
import { fileURLToPath } from 'url';
import { createJwtWeb } from './helpers/auth.js'
import fileUpload from'express-fileupload'

import { writeStockDataToKafka, readMessages  } from "./kafka/stock.kafka.js";

const app = express();
app.use(express.json());

app.use(fileUpload());
app.use(express.urlencoded());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dte/"));

dotenv.config();

conectarDB();

app.use(cors());

app.get("/setToken", async(req,res)=>{
  let jwt = createJwtWeb()
  res.json(jwt)
})

app.get("/send-message", async(req,res)=>{
  writeStockDataToKafka({sku: 45336, stock: 5, calc:"+"})
  res.json("asdad")
})

//readMessages()
// Routing
app.use("/v1/users", userRoutes);
app.use("/v1/openfactura", OfRoutes);
app.use("/v1/stores", storeRoutes);
app.use("/v1/product", productRoutes);
app.use("/v1/client", clientRoutes);
app.use("/v1/factura", facturaRoutes);
app.use("/v1/emisor", emisorRoutes);
app.use("/v1/cash", cashRoutes);
app.use("/v1/sale", saleRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

