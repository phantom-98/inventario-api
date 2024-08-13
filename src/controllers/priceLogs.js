import JSONbig from "json-bigint";
import CppLogsRepository from "../repositories/CppLogsRepository.js";
import ProductRepository from "../repositories/ProductRepository.js";
import PriceLogsRepository from "../repositories/PriceLogsRepository.js";
import logUserAction from '../helpers/logger.js'

const getAll = async (req, res) => {
  const resp = await CppLogsRepository.getAll();
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};
const deleteOne = async (req, res) => {
  const resp = await PriceLogsRepository.deleteById(req.params.id);
  const latest = await PriceLogsRepository.getLatestPriceByProductId(
    resp.product_id
  );
  const prod = await ProductRepository.findOneById(resp.product_id);
  if (prod) {
    if (!latest) {
      await ProductRepository.updateOneById(resp.product_id, {
        cpp: 0,
        stock: prod.stock - resp.qty,
      });
     
      await logUserAction(`${req.uid}`, `Borrado cpp para producto ${resp.product_id}`, JSON.stringify(prod.stock), JSON.stringify(resp.qty));

    } else {
      await ProductRepository.updateOneById(resp.product_id, {
        cpp: latest.cpp_logs[0].cpp,
        stock: prod.stock - resp.qty,
      });
      await logUserAction(`${req.uid}`, `Borrado cpp para producto ${resp.product_id}`, JSON.stringify(prod.stock), JSON.stringify(resp.qty));
    }
  }

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
  const prevProduct = await ProductRepository.findOneById(req.body.product_id);

  if (!findCpp || findCpp.products.stock === 0) {
    await ProductRepository.updateOneById(req.body.product_id, {
      cpp: Math.round(req.body.price),
      stock: req.body.qty,
      is_requested: false,
    });
    const { created, pricesList } = await PriceLogsRepository.createPriceLog(
      req.body
    );
    await CppLogsRepository.createCppLog({
      price_log_id: created.id,
      cpp: Math.round(req.body.price),
    }); 
    await logUserAction(`${req.uid}`, `Creado cpp para producto ${req.body.product_id}`,{},  JSON.stringify({cpp:created}));


    const fixJson = JSONbig.stringify(pricesList);
    res.setHeader("Content-Type", "application/json");
    res.send(fixJson);
    return;
  } else {
    const product = findCpp.products;
    let totalUnidades = 0;
    let totalCostoPonderado = 0;

    totalUnidades = product.stock + req.body.qty;
    totalCostoPonderado =
      Number(req.body.qty) * Number(req.body.price) +
      Number(product.stock) * Number(product.cpp);
    const newCpp = totalCostoPonderado / totalUnidades;
    await ProductRepository.updateOneById(req.body.product_id, {
      cpp: Math.round(newCpp),
      stock: totalUnidades,
      is_requested: false,
    });
    const { created, pricesList } = await PriceLogsRepository.createPriceLog(
      req.body
    );
    await CppLogsRepository.createCppLog({
      price_log_id: created.id,
      cpp: newCpp,
    });
    await logUserAction(`${req.uid}`, `Creado cpp para producto ${req.body.product_id}`,{},  JSON.stringify({cpp:created}));


    const fixJson = JSONbig.stringify(pricesList);
    res.setHeader("Content-Type", "application/json");
    res.send(fixJson);
  }
};
export { getAll, findByProductId, createOne, findLatestByProductId, deleteOne };
