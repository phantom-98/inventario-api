import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/mongoDb.js";

import userRoutes from "./routes/user.js";
import OfRoutes from "./routes/openfactura.js";



const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

app.use(cors());

// Routing
app.use("/v1/users", userRoutes);
app.use("/v1/openfactura", OfRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

