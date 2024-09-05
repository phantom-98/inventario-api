import Product from "../models/Product.js";
import Stock from "../models/Stock.js";
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
  getDatesBetween
} from "../helpers/product.js";
import { PrismaClient } from "@prisma/client";
import ProductRepository from "../repositories/ProductRepository.js";
import JSONbig from "json-bigint";
import fs from "fs";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../helpers/s3Client.js";
import parseStringToBoolean from "../helpers/booleanParser.js";
import ProductImageRepository from "../repositories/ProductImageRepository.js";
import ProductLocationRepository from "../repositories/ProductLocationRepository.js";
import Sale from "../models/Sale.js";
import Factura from "../models/Factura.js";
import logUserAction from '../helpers/logger.js'

const prisma = new PrismaClient();


const saveStock = async()=> {
  try {
      const products = await ProductRepository.getAll();
      const today = moment.now()
      //console.log(products)
      
      const data = products.map(p => ({
        productId: `${p.id}`,
        stock:p.stock,
        stock_at: today
      }));

      await Stock.insertMany(data);

      console.log('Stock guardado con éxito');
    
  } catch (error) {
      console.error('Error al guardar el stock:', error);
     
  }
}

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
  
  const result = await prisma.$queryRaw`
  SELECT "meta_title", "meta_description"
  FROM "products"
  WHERE "id" = ${data.id};
  `;
  console.log(result)
  data.meta_title = result[0]?.meta_title
  data.meta_description = result[0]?.meta_description

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
const requestProduct = async (req, res) => {
  try {
    const { sku } = req.params;
    const findProd = await ProductRepository.findOneBySku(sku);
    const prod = await ProductRepository.updateOneById(findProd.id, {
      is_requested: !findProd.is_requested,
    });
    const fixJson = JSONbig.stringify(prod);
    res.setHeader("Content-Type", "application/json");
    res.send(fixJson);
  } catch (error) {
    res.status(500).json(error);
  }
};
const requestProductInBulk = async (req, res) => {
  try {
    const { products } = req.body;
    for (let index = 0; index < products.length; index++) {
      const element = products[index];

      const findProd = await ProductRepository.findOneBySku(element[0]);
      await ProductRepository.updateOneById(findProd.id, {
        is_requested: !findProd.is_requested,
      });
    }
    return res.send("products required successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
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
const getRopSales = async (req, res) => {
  // Subtract 14 days from the current date and time
  const twoWeeksAgo = moment().subtract(14, "days");

  // Format it as an ISO 8601 string
  const isoString = twoWeeksAgo.toISOString();
  const prods = await ProductRepository.getAll();
  const sales = await Sale.find({
    createdAt: {
      $gte: isoString,
    },
  });
  const flattened = sales.flatMap((item) =>
    item.items.map((i) => ({
      qty: i.qty,
      prod: i.product,
    }))
  );

  const salesPerProd = {};
  flattened.forEach((item) => {
    if (salesPerProd[item.prod]) {
      salesPerProd[item.prod] += item.qty;
    } else {
      salesPerProd[item.prod] = item.qty;
    }
  });

  const salesWeb = await Factura.find({
    createdAt: {
      $gte: isoString,
    },
  });
  const flattenedWeb = salesWeb.flatMap((item) =>
    item.items.map((i) => ({
      qty: i.QtyItem,
      prod: i.SkuItem,
    }))
  );

  const salesWebPerProd = {};
  flattenedWeb.forEach((item) => {
    if (salesWebPerProd[item.prod]) {
      salesWebPerProd[item.prod] += item.qty;
    } else {
      salesWebPerProd[item.prod] = item.qty;
    }
  });
  const summedObject = {};

  for (const [key, qty] of Object.entries(salesPerProd)) {
    summedObject[key] = qty;
  }

  // Add or sum quantities from the second object
  for (const [key, qty] of Object.entries(salesWebPerProd)) {
    if (summedObject[key]) {
      summedObject[key] += qty; // Sum if the key already exists
    } else {
      summedObject[key] = qty; // Add the key if it doesn't exist
    }
  }

  prods.forEach((obj) => {
    if (summedObject.hasOwnProperty(obj.sku)) {
      // If the id exists in idQtyMap, add a new property to the object
      obj.qty = summedObject[obj.sku];
      const rec = obj.stock - obj.qty;
      if (rec < 0) {
        obj.rec = rec * -1;
      } else {
        obj.rec = 0;
      }
    }
  });
  prods.sort((a, b) => (b.qty ?? 0) - (a.qty ?? 0));

  const fixJson = JSONbig.stringify(prods);
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
      await logUserAction(`${req.uid}`, 'carga masiva ok', {  }, {});

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
  console.log(req.uid )
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
    is_cenabast: parseStringToBoolean(prod.is_cenabast ?? "0"),
    is_bioequivalent: parseStringToBoolean(prod.is_bioequivalent ?? "0"),
    outstanding: parseStringToBoolean(prod.outstanding ?? "0"),
    is_immediate: parseStringToBoolean(prod.is_immediate ?? "0"),
  };
  const product = await ProductRepository.createOne(auxProd);

  await logUserAction(`${req.uid}`, 'Producto Creado',{} ,JSONbig.stringify(product) );

  const auxLocations = prod.location_product ?? [];
  for (let index = 0; index < auxLocations.length; index++) {
    const element = auxLocations[index];
    await ProductLocationRepository.createProdLocation(
      product.id,
      parseInt(element)
    );
  }
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
const updateImages = async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  const prodImages = await ProductImageRepository.getAllImages(id);

  //prodImages.reverse();
  let position;
  if (prodImages.length === 0) {
    position = 0;
  } else {
    position = prodImages.length;
  }

  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const fileContent = fs.readFileSync(file.path);
    const createKey = `anticonceptivo/public/products/${id}/${file.filename}`;
    const command = new PutObjectCommand({
      Bucket: "oxfar.cl",
      Key: createKey,
      Body: fileContent,
      ContentDisposition: "inline",
      ContentType: "image/webp",
    });
    try {
      const response = await s3Client.send(command);
      const newImage = await ProductImageRepository.createWithIndex(
        id,
        createKey,
        position
      );
      prodImages.push(newImage);
      position = position + 1;
    } catch (err) {
      console.error(err);
    }
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting the temporary file", err);

        return res.send("error");
      }
    });
  }
  const fixJson = JSONbig.stringify(prodImages);
  res.setHeader("Content-Type", "application/json");
  return res.send(fixJson);
};
const deleteImage = async (req, res) => {
  const { id } = req.params;

  const deletedImage = await ProductImageRepository.removeImage(id);
  const url = deletedImage.file;
  const parts = url.split("/"); // Split the URL by '/'
  const startIndex = parts.indexOf("anticonceptivo");

  const key = parts.slice(startIndex).join("/");

  const deleteCommand = new DeleteObjectCommand({
    Bucket: "oxfar.cl", // The name of the bucket
    Key: key, // The key of the object you want to delete
  });

  try {
    await s3Client.send(deleteCommand);
  } catch (error) {
    console.error("Error deleting object", error);
  }

  const { product_id } = deletedImage;
  const prodImages = await ProductImageRepository.getAllImages(product_id);

  if (prodImages.length === 0) return res.json([]);
  const auxImages = [];
  for (let index = 0; index < prodImages.length; index++) {
    const file = prodImages[index];

    try {
      const img = await ProductImageRepository.updateImage(file.id, {
        position: index + 1,
      });
      auxImages.push(img);
    } catch (err) {
      console.error(err);
    }
  }

  const fixJson = JSONbig.stringify(auxImages);
  console.log(auxImages);
  res.setHeader("Content-Type", "application/json");
  return res.send(fixJson);
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
    const prevProduct = await ProductRepository.findOneById(req.params.sku);
    const { location_product, ...prod } = req.body;
    delete prod["laboratory_id"]
    delete prod["subcategory_id"]
    delete prod["laboratories"]
    
	if(prod["meta_title"]){
		const result = await prisma.$executeRaw`
  			UPDATE "products" 
  			SET "meta_title" = ${prod["meta_title"]}, "meta_description" = ${prod["meta_description"]}
  			WHERE "id" = ${req.params.sku};
		`;
	}
    delete prod["meta_title"]
    delete prod["meta_description"]
    const product = await ProductRepository.updateOneById(req.params.sku, prod);
    const prodLocations = await ProductLocationRepository.getProdLocation(
      product.id
    );

    console.log(req.uid)
    await logUserAction(`${req.uid}`, 'Producto Actualizado', JSONbig.stringify(prevProduct), JSONbig.stringify(product));


    for (let index = 0; index < location_product.length; index++) {
      const element = location_product[index];
      if (!prodLocations.some((e) => e.id === element))
        await ProductLocationRepository.createProdLocation(product.id, element);
    }
    for (let index = 0; index < prodLocations.length; index++) {
      const element = prodLocations[index];
      if (!location_product.includes(element.id))
        await ProductLocationRepository.deleteById(element.id);
    }
    const fixJson = JSONbig.stringify(product);
    res.setHeader("Content-Type", "application/json");
    res.send(fixJson);
  } catch (error) {
    res.status(500).send(error);
    console.log(error.message);
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

//http://localhost:4000/v1/product/downloadStockDate?startAt=2024-08-01&endAt=2024-08-30

const downloadStockDate = async (req, res) => {
  try {
    const { startAt, endAt } = req.query;

    const stocks = await Stock.find({
      stock_at: {
        $gte: new Date(startAt),
        $lte: new Date(endAt),
      },
    });

    const productIds = [...new Set(stocks.map((p) => p.productId))];
    const products = await ProductRepository.findManyByIds(productIds);

    const productMap = products.reduce((map, product) => {
      map[product.id] = product;
      return map;
    }, {});

    // 3. Crear la estructura de la cabecera con las fechas
    const structure = {
      sku: "Sku",
      name: "Nombre",
    
      stock: "Stock",
    };

    const fechas = getDatesBetween(startAt, endAt);
    fechas.forEach((f) => {
      structure[f.toISOString().split("T")[0].replaceAll("-", "")] = f
        .toISOString()
        .split("T")[0];
    });

    // Inicializar el arreglo de datos con la cabecera
    let data = [structure];
    const productRows = {};

    // 4. Construir las filas de datos para cada stock
    for (let p of stocks) {
      const product = productMap[p.productId];
      const productId = p.productId;

      // Si el producto ya ha sido procesado, solo actualizamos la fila existente
      if (!productRows[productId]) {
        productRows[productId] = {
          sku: product?.sku || "Desconocido",
          name: product?.name || "Desconocido",
      
          stock: product.stock || 0,
        };

        // Inicializar todas las fechas con ""
        fechas.forEach((f) => {
          const dateKey = f.toISOString().split("T")[0].replaceAll("-", "");
          productRows[productId][dateKey] = "";
        });

        data.push(productRows[productId]);
      }

      // Colocar el stock en la fecha correspondiente
      const stockDate = p.stock_at.toISOString().split("T")[0].replaceAll("-", "");

      if (productRows[productId].hasOwnProperty(stockDate)) {
        productRows[productId][stockDate] = p.stock;
      }
    }

    // 5. Crear el archivo Excel
    let workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(
      data.map((el) => [
        el.sku,
        el.name,
        el.stock,
        ...Object.keys(el)
          .filter((key) => !["sku", "name", "stock"].includes(key))
          .map((key) => el[key]),
      ])
    );
  workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/Stock.xlsx");

    // 6. Descargar el archivo Excel
    res.download("excel/Stock.xlsx");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const downLoadInventory = async (req, res) => {
  try {
    const products = await ProductRepository.getAll();

    let data = [
      {
        sku: "Sku",
        name: "Nombre",
        laboratory: "Laboratory",
        stock: "Stock",
        ubicacion: "ubicacion",
      },
    ];

    for (let p of products) {
      let found = [];

      found = await ProductLocationRepository.getProdLocation(p.id);

      data.push({
        sku: p.sku,
        name: p.name,
        laboratory: p.laboratories?.name,
        stock: p.stock,
        ubicacion: found.map((e) => e.locations.name).join(", "),
      });
    }

    let workbook = XLSX.utils.book_new(),
      worksheet = XLSX.utils.aoa_to_sheet(data.map((el) => Object.values(el)));
    workbook.SheetNames.push("First");
    workbook.Sheets["First"] = worksheet;
    XLSX.writeFile(workbook, "excel/Inv.xlsx");

    res.download("excel/Inv.xlsx");
  } catch (error) {
    console.log(error.message);
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
  updateImages,
  deleteImage,
  downLoadInventory,
  getRopSales,
  requestProduct,
  requestProductInBulk,
  saveStock,
  downloadStockDate
};
