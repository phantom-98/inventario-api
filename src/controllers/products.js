import Product from "../models/Product.js";
import { response } from "../helpers/response.js";
import XLSX from "xlsx";
import {
  productMapping,
  productMappingRop,
  productMappingSync,
} from "../helpers/mapping.js";
import fetch from "node-fetch";
import moment from "moment";
import {
  getCpp,
  changeObjectKeyLowerCase,
  validarClaves,
} from "../helpers/product.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stockByCode = async (req, res) => {
  try {
    let response = {
      error: {
        code: 0,
        description: "OK",
      },
    };
    const products = await Product.find({ codigoBarra: req.params.barCode });

    if (products.length > 0) {
      response.inventoryItems = products.map((data) => {
        return {
          inventoryItemId: data._id,
          productId: data.sku,
          productItemId: data._id,
          barCode: data.codigoBarra,
          sku: data.sku,
          quantity: data.stock,
          productName: data.nombre,
          facilityName: "Web",
          price: data.price,
          categories: ["Medicamento"],
        };
      });
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({
      error: {
        code: 1,
        description: "Api Error",
      },
    });
  }
};

const getSku = async (req, res) => {
  const data = await Product.findOne({ sku: req.params.sku });
  res.json(data);
};

const getOne = async (req, res) => {
  const data = await Product.findOne({ _id: req.params.id });
  res.json(data);
};

const syncProductsStock = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT * FROM products`;
    console.log(result.length);
    for (let e of result) {
      const data = await Product.findOneAndUpdate(
        { sku: e.sku },
        { stock: e.stock }
      );
      if (!data) {
        let map = productMappingSync(e);
        const product = new Product(map);
        await product.save();
      }
    }
    res.json({ msg: "Sincronizacion exitosa" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error });
  } finally {
    await prisma.$disconnect();
  }
};

const getAll = async (req, res) => {
  const data = await Product.find(
    {},
    "sku nombre laboratorio precio precioOferta stock uid composicion codigoBarra prices cpp2 puntoreorden nivelLlenado"
  ).sort({ stock: -1 });
  data.forEach((d) => {
    d.composicion = d.composicion?.substring(0, 100);
  });
  res.json(data);
};

const importRopFromExcel = async (req, res) => {
  try {
    if (!req.files) {
      res.send("File was not found");
      return;
    }

    const wb = XLSX.read(req.files.file.data);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
      const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
      const minusArray = data.map((objeto) => changeObjectKeyLowerCase(objeto));
      const clavesRequeridas = ["sku", "rop", "nll"];
      let fail = false;

      for (const objeto of minusArray) {
        if (!validarClaves(objeto, clavesRequeridas)) {
          console.log(objeto);
          fail = true;
        }
      }

      if (fail) {
        res.json({
          error: true,
          msg: "Archivo no contiene las columnas necesarias",
        });
      } else {
        const productRows = productMappingRop(data);

        await productRows.forEach(async (p) => {
          await Product.updateOne({ sku: p.sku }, p, { upsert: true });
          let product = await Product.findOne({ sku: p.sku });
          await product.save();
        });
        res.json("carga masiva ok");
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const importFromExcel = async (req, res) => {
  try {
    if (!req.files) {
      res.send("File was not found");
      return;
    }

    const wb = XLSX.read(req.files.file.data);
    const sheets = wb.SheetNames;

    if (sheets.length > 0) {
      const data = XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);

      const productRows = productMapping(data);

      await productRows.forEach(async (p) => {
        await Product.updateOne({ sku: p.sku }, p, { upsert: true });
        let product = await Product.findOne({ sku: p.sku });

        if (p.cantidad_cpp) {
          product.prices.push({
            qty: p.cantidad_cpp,
            price: p.precio_cpp,
            createdAt: moment().toDate(),
          });

          await product.save();
          let product2 = await Product.findOne({ sku: p.sku });
          product2.cpp2.push({
            price: getCpp(product2),
            createdAt: moment().toDate(),
          });
          await product2.save();
        }
      });

      res.json("carga masiva ok");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const register = async (req, res) => {
  const { sku } = req.body;
  const product = await Product.findOne({ sku });

  if (product) return response(res, 400, "producto ya registrado");

  try {
    const product = new Product(req.body);
    await product.save();

    let data = {
      sku: product.sku,
      name: product.nombre,
      price: product.precio,
      offer_price: product.precioOferta,
      is_offer: product.oferta,
      barcode: product.codigoBarra,
      stock: product.stock,
      active: product.activo,
    };

    fetch(process.env.ANTICONCEPTIVO_WEB + "createProduct", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        return response(res, 200, "El producto creado" + product.sku);
      })
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    console.log(error);
    return response(res, 500, error);
  }
};

const updateSku = async (req, res) => {
  try {
    const product = await Product.updateOne({ sku: req.params.sku }, req.body);
    console.log('cayo en el beta' + req.uid);
    const data = await Product.findOne({ sku: req.params.sku });
    console.log(data);

    fetch(process.env.ANTICONCEPTIVO_WEB + "updateStock", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        return response(res, 200, "El producto actualizado" + req.params.sku);
      })
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateStock = async (req, res) => {
  const { method, items } = req.body;
  try {
    await items.forEach(async (e) => {
      const product = await Product.findOne({ sku: e.sku });
      if (product) {
        if (method == "discount") {
          product.stock = product.stock - e.quantity;
        } else {
          product.stock = product.stock + e.quantity;
        }
        product.save();
      }
    });

    res.json("ok");
  } catch (error) {
    return response(res, 500, error);
  }
};

const update = async (req, res) => {
  const product = await Product.updateOne({ _id: req.params.id }, req.body);
  return product
    ? res.json(product)
    : response(res, 404, "El producto no existe");
};

const deleteData = async (req, res) => {
  const product = await Product.deleteOne({ _id: req.params.id });
  return product
    ? res.json(product)
    : response(res, 404, "El producto no existe");
};

const updatePrices = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.uid) {
      await Product.findOneAndUpdate(
        {
          sku: req.params.sku,
          "prices._id": req.body.uid,
        },
        {
          $set: { "prices.$": req.body },
        },
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
    } else {
      let product = await Product.findOne({ sku: req.params.sku });
      product.prices.push({
        ...req.body,
        createdAt: moment().toDate(),
      });
      await product.save();
    }
    const product2 = await Product.findOne({ sku: req.params.sku });
    const cpp = getCpp(product2)
    product2.cpp2.push({
      _id: product2.prices[product2.prices.length - 1]._id,
      price: cpp,
      createdAt: moment().toDate(),
    });
    if(!product2.precioOferta){
      product2.margen_precio =Math.round((((product2.precio / (1+0.19)) - cpp)/(product2.precio / (1+0.19)))*100) 
    }else {
      product2.margen_precio =Math.round((((product2.precio / (1+0.19)) - cpp)/(product2.precio / (1+0.19)))*100) 
      product2.margen_precioOferta =Math.round((((product2.precioOferta / (1+0.19)) - cpp)/(product2.precioOferta / (1+0.19)))*100) 
    }
    
    product2.stock = Number(product2.stock) + Number(req.body.qty);
    
    const savedProduct = await product2.save();
    console.log(savedProduct);
    await fetch(process.env.ANTICONCEPTIVO_WEB + "updateStock", {
      method: "POST",
      body: JSON.stringify(savedProduct),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    res.json(product2);
  } catch (error) {
    console.log(error);
  }
};

const deletePrices = async (req, res) => {
  console.log(req.body);
  try {
    await Product.updateOne(
      { sku: req.params.sku, "prices._id": req.body.uid },
      { $pull: { prices: { _id: req.body.uid } } }
    );
    await Product.updateOne(
      { sku: req.params.sku, "cpp2._id": req.body.uid },
      { $pull: { cpp2: { _id: req.body.uid } } }
    );
    const product2 = await Product.findOne({ sku: req.params.sku });
    const cpp = getCpp(product2);
    
    product2.margen_precio =Math.round((((product2.precio / (1+0.19)) - cpp)/(product2.precio / (1+0.19)))*100)
    if(product2.precioOferta){
      product2.margen_precioOferta =Math.round((((product2.precioOferta / (1+0.19)) - cpp)/(product2.precioOferta / (1+0.19)))*100) 
    }
    product2.stock = Number(product2.stock) - Number(req.body.qty);
    const savedProduct = await product2.save();
    await fetch(process.env.ANTICONCEPTIVO_WEB + "updateStock", {
      method: "POST",
      body: JSON.stringify(savedProduct),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
    res.json(product2);
  } catch (error) {
    res.status(500).json(error);
  }
};

const changeRop = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const product = await Product.findOne({ _id: id });
    product.puntoreorden = data;
    product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const changeNll = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const product = await Product.findOne({ _id: id });
    product.nivelLlenado = data;
    product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json(error);
  }
};

const downloadRop = async (req, res) => {
  try {
    const products = await Product.find();

    let data = [
      {
        sku: "Sku",
        name: "Nombre",
        stock: "Stock",
        rop: "Rop",
        nll: "Nll",
        compra: "Compra",
      },
    ];

    for (let p of products) {
      data.push({
        sku: p.sku,
        name: p.nombre,
        stock: p.stock,
        rop: p.puntoreorden,
        nll: p.nivelLlenado,
        compra: p.stock <= p.puntoreorden ? p.nivelLlenado - p.stock : 0,
      });
    }

    let workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.aoa_to_sheet(data.map((el) => Object.values(el)));
    workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/Rop.xlsx");

    res.download("excel/Rop.xlsx");
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
    deleteData,
	register,
	update,
	getAll,
 	getOne,
	importFromExcel,
    stockByCode,
    updatePrices,
    getSku,
    updateSku,
    updateStock,
    deletePrices,
    importRopFromExcel,
    changeRop,
    changeNll,
    downloadRop,
    syncProductsStock
};
