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
  console.log(fechaInicio);
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
    p.ventas.forEach((v) => {
      total = total + v.total;
    });
    return {
      totalDay,
      mes: p.mes,
      year: p.year,
      total,
    };
  });
  let web = crearArrayVentasPorMes(boletas);

  web = web.map((p) => {
    let total = 0;
    p.ventas.forEach((v) => {
      total = total + v.totals.MntTotal;
    });
    return {
      totalDayB,
      mes: p.mes,
      year: p.year,
      total,
    };
  });
  res.json({ pos, web });
};

const register = async (req, res) => {
  try {
    const sale = new Sale(req.body);
    if (
      sale.payType == "Efectivo" ||
      sale.payType == "Cheque" ||
      sale.payType == "Transferencia"
    ) {
      const emisor = await Emisor.findById(process.env.EMISOR_UID);
      let data = dteBoletaPosMapping(sale.items, sale.clientRut, true, emisor);
      let file = await createDte(data);
      sale.boletaUrl = "https://s3.amazonaws.com/oxfar.cl/" + file;
    }
    sale.counter = await Sale.count();
    await sale.save();
    sale.items.forEach(async (element) => {
      let product = await Product.findById(element.product);
      product.stock = product.stock - element.qty;
      product.save();
    });
    let saleResp = await sale.populate("items.product");
    res.json(saleResp);
  } catch (error) {
    console.log(error);
    return response(res, 500, error);
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
  const endDate = moment(endAt).endOf("day").toISOString();

  const sale = await Sale.find({
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate("items.product");

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

  sale.forEach((s, index) => {
    s.items.forEach((i) => {
      if (!i.productName.includes("DESPACHO")) {
        let impuesto = i.product?.impuestoExtra
          ? 19 + parseInt(i.product.impuestoExtra)
          : 19;
        let cpp =
          i.product?.cpp2.length > 0
            ? Number(i.product.cpp2[i.product.cpp2.length - 1].price)
            : 0;
        let impuesto2 = parseFloat(`1.${impuesto}`);
        let margen =
          i.product?.prices.length > 0
            ? (parseInt(i.price) - cpp * impuesto2) / parseInt(i.price)
            : 0;
        let fechaItem = moment(s.createdAt)
          .utcOffset(-240)
          .format("YYYY-MM-DD");

        if (fechaItem >= startAt && fechaItem <= endAt) {
          data.push({
            fecha: moment(s.createdAt)
              .utcOffset(-240)
              .format("DD-MM-YYYY H:mm"),
            numero: index,
            codigo_producto: i.product?.sku ? i.product.sku : "",
            nombre_producto: i.productName,
            cantidad: i.qty,
            precio: i.price,
            total: i.total,
            cpp: cpp ? Math.round(cpp) : "",
            impuesto: impuesto,
            margen: margen.toFixed(4),
          });
        }
      }
    });
  });
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

  console.log(sale.length);
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
      if (i.NmbItem !== "Despacho") {
        let product = await Product.findOne({ nombre: i.NmbItem }); // Busca el producto por su nombre
        let impuesto = product?.impuestoExtra
          ? 19 + parseInt(product.impuestoExtra)
          : 19;
        let cpp =
          product?.cpp2.length > 0
            ? Number(product.cpp2[product.cpp2.length - 1].price)
            : 0;
        let impuesto2 = parseFloat(`1.${impuesto}`);
        let margen =
          product?.prices.length > 0
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

const getContribution = async (req, res) => {
  const datesRange = getFechaMes();
  try {
    // Consulta las ventas y proyecta solo los items para el mes actual
    const monthSales = await Sale.find({
      createdAt: { $gte: datesRange.fechaInicio, $lte: datesRange.fechaFin },
    })
      .select("items")
      .populate("items.product");

    console.log("VENTAS MES: " + monthSales.length);

    const items = monthSales.flatMap((venta) => venta.items);

    console.log("items: " + items.length);
    const itemsMap = items.map((e, index) => {
      if (!e.productName.includes("DESPACHO")) {
        return {
          qty: e.total,
          margen:
            e.product?.cpp2.length > 0
              ? e.product.cpp2[e.product.cpp2.length - 1].price * e.qty * 1.19
              : 0,
        };
        /* return {
          total: e.qty,
          margen:
            e.product?.cpp2.length > 0
              ? ((e.price -
                  e.product.cpp2[e.product.cpp2.length - 1].price * 1.19) /
                  e.price) *
                e.qty
              : 0,
        }; */
      }
      return {
        qty: 0,
        margen: 0,
      };
      /* if (index <= 4) {
        console.log(e);
        console.log("catnidad: " + e.qty);s
        if (e.product) {
          console.log(
            ((e.price -
              e.product.cpp2[e.product.cpp2.length - 1].price * 1.19) /
              e.price) *
              100
          );

          console.log(e.product.cpp2[e.product.cpp2.length - 1].price);
        }
      } */
    });

    /* const itemsMap = items.map((e) => {
      return {
        qty: e.qty,
        margen: e.product?.margen_precio ?? 0,
      };
    }); */

    const margenes = itemsMap.reduce((acc, e) => {
      return acc + e.margen;
    }, 0);

    const cantidad = itemsMap.reduce((acc, e) => {
      return acc + e.qty;
    }, 0);

    console.log("total productos vendidos mes: " + cantidad);
    console.log("total margenes acc mes: " + margenes);
    console.log("margen promedio: " + margenes / cantidad);

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
      let product = await Product.findOne({ sku: element.SkuItem }).select(
        "margen_precioOferta"
      );
      margeF = product.margen_precioOferta + margeF;
      qtyF = element.QtyItem + qtyF;
    }

    res.json({
      contriPos: (1 - margenes / cantidad) * 100,
      contriWeb: margeF / qtyF,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la consulta de items vendidos.");
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
};
