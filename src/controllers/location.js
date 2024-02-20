import JSONbig from "json-bigint";
import ProductLocationRepository from "../repositories/ProductLocationRepository.js";
const getAll = async (req, res) => {
  const resp = await ProductLocationRepository.getAll();
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};

export { getAll };
