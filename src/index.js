import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/mongoDb.js";

import userRoutes from "./routes/user.js";
import storeRoutes from "./routes/store.js";
import productRoutes from "./routes/product.js"
import OfRoutes from "./routes/openfactura.js";


import fileUpload from'express-fileupload'


const app = express();
app.use(express.json());

app.use(fileUpload());
app.use(express.urlencoded());
dotenv.config();

conectarDB();

app.use(cors());

// Routing
app.use("/v1/users", userRoutes);
app.use("/v1/openfactura", OfRoutes);
app.use("/v1/stores", storeRoutes);
app.use("/v1/product", productRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

