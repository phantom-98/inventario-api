import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import { response } from "../helpers/response.js";
import { getCpp } from "../helpers/sale.js";
import { dteBoletaPosMapping } from "../helpers/mapping.js";
import Emisor from "./../models/Emisor.js";
import { createDte } from "./factura.js";
import Factura from "../models/Factura.js";
import { crearArrayVentasPorMes, getFechaMes } from "../helpers/sale.js";
import { writeFile, utils } from "xlsx";
import XLSX from "xlsx";
import moment from "moment";
import ProductRepository from "../repositories/ProductRepository.js";

const getOne = async (req, res) => {
  const data = await Sale.findOne({ _id: req.params.id }).populate(
    "items.product"
  );
  res.json(data);
};

const getAll = async (req, res) => {
  //TODO order and get data fromfactura
  const data = await Sale.find().sort({ createdAt: "desc" });
  res.json(data);
};
const getPos = async (req, res) => {
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - 1);
  //console.log(fechaInicio);
  fechaInicio.setHours(0, 0, 0, 0); // Establece la hora a las 00:00:00.000
  const fechaFin = new Date();
  fechaFin.setHours(23, 59, 59, 999);
  const data = await Sale.find({
    createdAt: { $gte: fechaInicio, $lte: fechaFin },
  }).sort({ createdAt: "desc" });
  res.json(data);
};

const getAll2 = async (req, res) => {
  const sales = await Sale.find().sort({ createdAt: "desc" }).limit(10);
  const boletas = await Factura.find({ typeId: 39 })
    .sort({ createdAt: "desc" })
    .limit(10);

  res.json({ sales, boletas });
};
const getAll3 = async (req, res) => {
  const now = moment.now();

  const sales = await Sale.find().sort({ createdAt: "desc" });
  const boletas = await Factura.find({ typeId: 39 }).sort({
    createdAt: "desc",
  });

  res.json({ sales, boletas });
};

const salePerMonth = async (req, res) => {
  const today = moment().startOf("day");

  const sales = await Sale.find();
  const boletas = await Factura.find({ typeId: 39 });

  let daySales = sales.filter((s) => {
    const saleDate = moment(s.createdAt);
    return saleDate.isSame(today, "day");
  });

  let totalDay = daySales.reduce((acc, p) => acc + p.total, 0);

  let daySalesB = boletas.filter((s) => {
    const saleDate = moment(s.createdAt);
    return saleDate.isSame(today, "day");
  });

  let totalDayB = daySalesB.reduce((acc, p) => acc + p.totals.MntTotal, 0);

  let pos = crearArrayVentasPorMes(sales);
  pos = pos.map((p) => {
    let total = 0;
    let qty = 0;
    p.ventas.forEach((v) => {
      let temp = v.items.reduce((acc, v) => acc + v.total, 0);
      //  .filter((v) => v.NmbItem != "DESPACHO")
      total = total + temp;
      let temp2 = v.items.reduce((acc, v) => acc + v.qty, 0);
      //  .filter((v) => v.NmbItem != "DESPACHO")
      qty = qty + 1;
    });

    return {
      totalDay,
      mes: p.mes,
      year: p.year,
      total,
      qty,
    };
  });
  let web = crearArrayVentasPorMes(boletas);

  web = web.map((p) => {
    let total = 0;
    let qty = 0;
    p.ventas.forEach((v) => {
      let temp = v.items.reduce((acc, v) => acc + v.MontoItem, 0);

      total = total + temp;

      qty = qty + 1;
    });

    return {
      totalDayB,
      mes: p.mes,
      year: p.year,
      total,
      qty,
    };
  });
  return { pos, web };
};

const register = async (req, res) => {
  try {
    const sale = req.body;

    if (
      sale.payType == "Efectivo" ||
      sale.payType == "Cheque" ||
      sale.payType == "Transferencia"
    ) {
      const emisor = await Emisor.findById(process.env.EMISOR_UID);

      let data = dteBoletaPosMapping(sale.items, sale.clientRut, true, emisor);
      let file = await createDte(data);
      if (!file) throw new Error("error processing sale");

      sale.boletaUrl = "https://s3.amazonaws.com/oxfar.cl/" + file;
    }
    sale.counter = await Sale.count();
    const createdSale = new Sale(sale);
    await createdSale.save();
    sale.items.forEach(async (element) => {
      let product = await ProductRepository.findOneBySku(element.product);
      if (product) {
        await ProductRepository.updateOneById(product.id, {
          stock: product.stock - element.qty,
        });
      }
    });

    res.json(sale);
  } catch (error) {
    return response(res, 500, error.message);
  }
};

const saveVoucher = async (req, res) => {
  const sale = await Sale.updateOne({ _id: req.params.id }, req.body);
  return sale ? res.json(sale) : response(res, 404, "Sale no existe");
};

const update = async (req, res) => {
  const sale = await Sale.updateOne({ _id: req.params.id }, req.body);
  return sale ? res.json(sale) : response(res, 404, "Sale no existe");
};

const deleteData = async (req, res) => {
  const sale = await Sale.deleteOne({ _id: req.params.id });
  return sale ? res.json(sale) : response(res, 404, "Sale no existe");
};

const saleAfter = async (req, res) => {
  const { after } = req.params;

  const sale = await Sale.find({
    payType: "Efectivo",
    createdAt: { $gte: after },
  });

  return sale ? res.json(sale) : response(res, 404, "Sale no existe");
};

const salePerDay = async (req, res) => {
  const sales = Sale.find().sort({ createdAt: -1 }).limit(10);
  let web = crearArrayVentasPorMes(sales);
  web = web.map((p) => {
    p.ventas.forEach((v) => {
      total = total + v.totals.MntTotal;
    });
  });
  res.json(sales);
};

const exportFromExcel = async (req, res) => {
  const { startAt, endAt } = req.params;

  const startDate = new Date(startAt);
  startDate.setUTCHours(0, 0, 0, 0);
  //console.log(startDate);
  const endDate = moment(endAt).endOf("day").toISOString();

  const sale = await Sale.find({
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate("items.product");

  let data = [
    {
      fecha: "Fecha",
      numero: "Numero",
      tipo_pago: "Tipo de Pago",
      codigo_producto: "Codigo Producto",
      nombre_producto: "Nombre Producto",
      cantidad: "Cantidad",
      precio: "Precio",
      total: "Total",
      cpp: "CPP",
      impuesto: "Impuesto",
      margen: "Margen de Contribucion",
    },
  ];

  for (let s of sale) {
    for (let i of s.items) {
      if (!i.productName.includes("DESPACHO") && i.product) {
        let product = await ProductRepository.findOneBySku(i.product);
        if (!product) continue;
        let impuesto = product?.impuestoExtra
          ? 19 + parseInt(product.impuestoExtra)
          : 19;
        let cpp = product?.cpp > 0 ? product.cpp : 0;
        let impuesto2 = parseFloat(`1.${impuesto}`);
        let margen =
          product?.cpp > 0
            ? (parseInt(i.total / i.qty) - cpp * impuesto2) /
              parseInt(i.total / i.qty)
            : 0;

        let fechaItem = moment(s.createdAt)
          .utcOffset(-240)
          .format("YYYY-MM-DD");

        if (fechaItem >= startAt && fechaItem <= endAt) {
          data.push({
            fecha: moment(s.createdAt)
              .utcOffset(-240)
              .format("DD-MM-YYYY H:mm"),
            numero: s.counter,
            tipo_pago: s.payType ?? "",
            codigo_producto: product?.sku ? product.sku : "",
            nombre_producto: product.name,
            cantidad: i.qty,
            precio: parseInt(i.total / i.qty),
            total: i.total,
            cpp: cpp ? Math.round(cpp) : "",
            impuesto: impuesto,
            margen: margen.toFixed(4),
          });
        }
      }
    }
  }
  var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(data.map((el) => Object.values(el)));
  workbook.SheetNames.push("First");
  workbook.Sheets["First"] = worksheet;
  XLSX.writeFile(workbook, "excel/VentasPos.xlsx");

  res.download("excel/VentasPos.xlsx");
};

const exportFromExcel2 = async (req, res) => {
  const { startAt, endAt } = req.params;
  let sale = [];
  const startDate = new Date(startAt);
  const endDate = moment(endAt).endOf("day").toISOString();

  sale = await Factura.find({
    createdAt: { $gte: startDate, $lte: endDate },
    typeId: 39,
  });

  //console.log(sale.length);
  let data = [
    {
      fecha: "Fecha",
      numero: "Numero",
      codigo_producto: "Codigo Producto",
      nombre_producto: "Nombre Producto",
      cantidad: "Cantidad",
      precio: "Precio",
      total: "Total",
      cpp: "CPP",
      impuesto: "Impuesto",
      margen: "Margen de Contribucion",
    },
  ];

  for (let s of sale) {
    for (let i of s.items) {
      if (i.NmbItem !== "Despacho" && i.SkuItem) {
        let product = await ProductRepository.findOneBySku(i.SkuItem); // Busca el producto por su nombre
        let impuesto = product?.impuestoExtra
          ? 19 + parseInt(product.impuestoExtra)
          : 19;
        let cpp = product?.cpp > 0 ? product.cpp : 0;
        let impuesto2 = parseFloat(`1.${impuesto}`);
        let margen =
          product?.cpp > 0
            ? (parseInt(i.PrcItem) - cpp * impuesto2) / parseInt(i.PrcItem)
            : 0;

        //                let fechaItem = moment(s.createdAt).utcOffset(-240)
        let fechaItem = moment(s.createdAt)
          .utcOffset(-240)
          .format("YYYY-MM-DD");

        if (fechaItem >= startAt && fechaItem <= endAt) {
          data.push({
            fecha: moment(s.createdAt)
              .utcOffset(-240)
              .format("DD-MM-YYYY H:mm"),
            numero: s.counter,
            codigo_producto: product?.sku ? product.sku : "",
            nombre_producto: i.NmbItem,
            cantidad: i.QtyItem,
            precio: i.PrcItem,
            total: i.MontoItem,
            cpp: cpp ? Math.round(cpp) : "",
            impuesto: impuesto,
            margen: margen.toFixed(4),
          });
        }
      }
    }
  }

  var workbook = XLSX.utils.book_new(),
    worksheet = XLSX.utils.aoa_to_sheet(data.map((el) => Object.values(el)));
  workbook.SheetNames.push("First");
  workbook.Sheets["First"] = worksheet;
  XLSX.writeFile(workbook, "excel/VentasWeb.xlsx");

  res.download("excel/VentasWeb.xlsx");
};

const getInv = async (req, res) => {
  try {
    const products = await Product.find({ nombre: { $ne: "DESPACHO" } });
    const invmoney = products.reduce((acc, p) => {
      let cpp = p.cpp2.length > 0 ? p.cpp2[p.cpp2.length - 1].price : 0;
      return acc + cpp * p.stock;
    }, 0);
    const invqty = products.reduce((acc, p) => acc + p.stock, 0);
    return { invmoney, invqty };
  } catch (error) {
    console.error(error);
    //res.status(500).send("Error en la consulta de items vendidos.");
  }
};

const getContribution = async (req, res) => {
  const datesRange = getFechaMes();
  try {
    // Consulta las ventas y proyecta solo los items para el mes actual
    const monthSales = await Sale.find({
      createdAt: { $gte: datesRange.fechaInicio, $lte: datesRange.fechaFin },
    }).select("items");

    /* console.log("VENTAS MES: " + monthSales.length);
    console.log("last sale: " + monthSales[0]); */
    const items = monthSales.flatMap((venta) => venta.items);
    const auxArr = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index].toObject();
      //console.log(element);
      if (element.product) {
        const found = await ProductRepository.findOneBySku(element.product);
        if (!found) continue;
        element.dbProduct = found;
        //console.log(element);
        auxArr.push(element);
      }
      //console.log(element);
    }
    const itemsMap = auxArr.map((e) => {
      if (!e.productName.includes("DESPACHO") && e.dbProduct) {
        return {
          qty: e.total,
          margen: e.dbProduct.cpp ? e.dbProduct.cpp * e.qty * 1.19 : 0,
        };
      }
      return {
        qty: 0,
        margen: 0,
      };
    });

    const margenes = itemsMap.reduce((acc, e) => {
      return acc + e.margen;
    }, 0);

    const cantidad = itemsMap.reduce((acc, e) => {
      return acc + e.qty;
    }, 0);

    const monthFactura = await Factura.find({
      createdAt: { $gte: datesRange.fechaInicio, $lte: datesRange.fechaFin },
    }).select("items");

    const itemsF = monthFactura.flatMap((venta) => venta.items);
    let itemsFiltered = itemsF.filter(
      (v) => v.NmbItem != "Despacho" && v.SkuItem
    );
    let margeF = 0;
    let qtyF = 0;

    for (let index = 0; index < itemsFiltered.length; index++) {
      const element = itemsFiltered[index];

      let product = await ProductRepository.findOneBySku(element.SkuItem);

      margeF =
        (product.cpp ? product.cpp * element.QtyItem * 1.19 : 0) + margeF;
      qtyF = (product.cpp ? element.MontoItem : 0) + qtyF;
    }

    return {
      contriPos: (1 - margenes / cantidad) * 100,
      contriWeb: (1 - margeF / qtyF) * 100,
    };
  } catch (error) {
    console.error(error);
    //res.status(500).send("Error en la consulta de items vendidos.");
  }
};

export {
  deleteData,
  register,
  update,
  getAll,
  getOne,
  getAll2,
  saleAfter,
  salePerMonth,
  saveVoucher,
  exportFromExcel,
  salePerDay,
  getAll3,
  exportFromExcel2,
  getPos,
  getContribution,
  getInv,
};
