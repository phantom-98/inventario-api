import JSONbig from "json-bigint";
import CppLogsRepository from "../repositories/PriceLogsRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import PriceLogsRepository from "../repositories/PriceLogsRepository.js";
const getAll = async (req, res) => {
  const resp = await CppLogsRepository.getAll();
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
const deleteOne = async (req, res) => {
  const resp = await CppLogsRepository.deleteById(req.params.id);
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
const findByProductId = async (req, res) => {
  const cppLog = await PriceLogsRepository.findOneByProductId(req.params.id);
  const fixJson = JSONbig.stringify(cppLog);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
const findLatestByProductId = async (req, res) => {
  const cppLog = await PriceLogsRepository.getLatestPriceByProductId(
    req.params.id
  );
  const fixJson = JSONbig.stringify(cppLog);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};

const createOne = async (req, res) => {
  const findCpp = await PriceLogsRepository.getLatestPriceByProductId(
    req.body.product_id
  );

  if (findCpp.length === 0 || findCpp[0].products.stock === 0) {
    console.log("cayo");
    await ProductRepository.updateOneById(req.body.product_id, {
      cpp: Math.round(req.body.price),
      stock: req.body.qty,
    });
  } else {
    const product = findCpp[0].products;
    let totalUnidades = 0;
    let totalCostoPonderado = 0;

    totalUnidades = product.stock + req.body.qty;
    totalCostoPonderado =
      Number(req.body.qty) * Number(req.body.price) +
      Number(product.stock) * Number(product.cpp);
    let newCpp = totalCostoPonderado / totalUnidades;
    console.log(newCpp);
    await ProductRepository.updateOneById(req.body.product_id, {
      cpp: Math.round(newCpp),
      stock: totalUnidades,
    });
  }
  const cppList = await PriceLogsRepository.createPriceLog(req.body);
  const fixJson = JSONbig.stringify(cppList);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
export { getAll, findByProductId, createOne, findLatestByProductId, deleteOne };
