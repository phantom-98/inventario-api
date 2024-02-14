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
  createSlug,
} from "../helpers/product.js";
import { PrismaClient } from "@prisma/client";
import ProductRepository from "../repositories/ProductRepository.js";
import JSONbig from "json-bigint";
import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../helpers/s3Client.js";
import parseStringToBoolean from "../helpers/booleanParser.js";
import ProductImageRepository from "../repositories/ProductImageRepository.js";
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
const getSku2 = async (req, res) => {
  const data = await ProductRepository.findOneById(req.params.sku);
  const fixJson = JSONbig.stringify(data);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
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
const getAll2 = async (req, res) => {
  const data2 = await ProductRepository.getAll();
  const fixJson = JSONbig.stringify(data2);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
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
const updateProdImages = async (req, res) => {
  console.log("entro");
  const images = req.body;
  for (let index = 0; index < images.length; index++) {
    const element = images[index];
    await ProductImageRepository.UpdateImage(element.id, index + 1);
  }
  res.send("success");
};
const getProdImages = async (req, res) => {
  const images = await ProductImageRepository.getAllImages(req.params.id);
  const fixJson = JSONbig.stringify(images);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
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

const register2 = async (req, res) => {
  const { product: productAux, uploadedFiles } = req.body;
  console.log(req.files);
  productAux.slug = createSlug(productAux.name);
  productAux.position = 999;
  productAux.cpp = productAux.cpp ?? 0;
  if (productAux.offer_price <= 0 || !productAux.offer_price) {
    productAux.is_offer = false;
  }
  const product = await ProductRepository.createOne(productAux);
  const fixJson = JSONbig.stringify(product);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
const register3 = async (req, res) => {
  const prod = req.body;
  const files = req.files;

  const auxProd = {
    sku: prod.sku ?? null,
    name: prod.name ?? null,
    slug: createSlug(prod.name),
    barcode: prod.barcode ?? null,
    days_protection: parseInt(prod.days_protection) ?? null,
    subcategory_id: parseInt(prod.subcategory_id),
    laboratory_id: parseInt(prod.laboratory_id),
    consumption_typology: prod.consumption_typology ?? null,
    recipe_type: prod.recipe_type ?? null,
    state_of_matter: prod.state_of_matter ?? null,
    stock: parseInt(prod.stock) ?? null,
    format: prod.format ?? null,
    unit_format: prod.unit_format ?? null,
    price: parseInt(prod.price) ?? null,
    offer_price: parseInt(prod.offer_price) ?? null,
    cpp: prod.cpp ? parseInt(prod.cpp) : null,
    description: prod.description ?? null,
    data_sheet: prod.data_sheet ?? null,
    compound: prod.compound ?? null,
    benefits: prod.benefits ?? null,
    is_generic: parseStringToBoolean(prod.is_generic ?? "0"),
    active: parseStringToBoolean(prod.active ?? "0"),
    is_offer: !prod.offer_price || prod.offer_price <= 0 ? false : true,
    is_indexable: parseStringToBoolean(prod.is_indexable ?? "0"),
    is_medicine: parseStringToBoolean(prod.is_medicine ?? "0"),
    is_bioequivalent: parseStringToBoolean(prod.is_bioequivalent ?? "0"),
    outstanding: parseStringToBoolean(prod.outstanding ?? "0"),
    is_immediate: parseStringToBoolean(prod.is_immediate ?? "0"),
  };
  const product = await ProductRepository.createOne(auxProd);

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const fileContent = fs.readFileSync(file.path);
    const createKey = `anticonceptivo/public/products/${product.id}/${file.filename}`;
    const command = new PutObjectCommand({
      Bucket: "oxfar.cl",
      Key: createKey,
      Body: fileContent,
      ContentDisposition: "inline",
      ContentType: "image/webp",
    });
    try {
      const response = await s3Client.send(command);
      await ProductImageRepository.createWithIndex(
        product.id,
        createKey,
        index
      );
    } catch (err) {
      console.error(err);
    }
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting the temporary file", err);
        const fixJson = JSONbig.stringify(product);
        res.setHeader("Content-Type", "application/json");
        return res.send(fixJson);
      }
    });
  }

  res.send("File uploaded successfully");
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
const updateSku2 = async (req, res) => {
  try {
    const product = await ProductRepository.updateOneById(
      req.params.sku,
      req.body
    );
    const fixJson = JSONbig.stringify(product);
    res.setHeader("Content-Type", "application/json");
    res.send(fixJson);
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
    const cpp = getCpp(product2);
    product2.cpp2.push({
      _id: product2.prices[product2.prices.length - 1]._id,
      price: cpp,
      createdAt: moment().toDate(),
    });
    if (!product2.precioOferta) {
      product2.margen_precio = Math.round(
        ((product2.precio / (1 + 0.19) - cpp) /
          (product2.precio / (1 + 0.19))) *
          100
      );
    } else {
      product2.margen_precio = Math.round(
        ((product2.precio / (1 + 0.19) - cpp) /
          (product2.precio / (1 + 0.19))) *
          100
      );
      product2.margen_precioOferta = Math.round(
        ((product2.precioOferta / (1 + 0.19) - cpp) /
          (product2.precioOferta / (1 + 0.19))) *
          100
      );
    }

    product2.stock = Number(product2.stock) + Number(req.body.qty);

    const savedProduct = await product2.save();
    console.log(savedProduct);
    await fetch(process.env.ANTICONCEPTIVO_WEB + "updateStock", {
      method: "POST",
      body: JSON.stringify(savedProduct),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
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

    product2.margen_precio = Math.round(
      ((product2.precio / (1 + 0.19) - cpp) / (product2.precio / (1 + 0.19))) *
        100
    );
    if (product2.precioOferta) {
      product2.margen_precioOferta = Math.round(
        ((product2.precioOferta / (1 + 0.19) - cpp) /
          (product2.precioOferta / (1 + 0.19))) *
          100
      );
    }
    product2.stock = Number(product2.stock) - Number(req.body.qty);
    const savedProduct = await product2.save();
    await fetch(process.env.ANTICONCEPTIVO_WEB + "updateStock", {
      method: "POST",
      body: JSON.stringify(savedProduct),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    });
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
  getAll2,
  getOne,
  importFromExcel,
  stockByCode,
  updatePrices,
  getSku,
  getSku2,
  updateSku,
  updateSku2,
  updateStock,
  deletePrices,
  importRopFromExcel,
  changeRop,
  changeNll,
  downloadRop,
  syncProductsStock,
  register2,
  register3,
  updateProdImages,
  getProdImages,
};
