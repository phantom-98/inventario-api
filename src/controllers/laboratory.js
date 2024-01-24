import LaboratoryRepository from "../repositories/LaboratoryRepository.js";
import JSONbig from "json-bigint";
const getAll = async (req, res) => {
  const resp = await LaboratoryRepository.getAll();
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};

export { getAll };
