import SubCategoryRepository from "../repositories/SubCategoryRepository.js";
import JSONbig from "json-bigint";
const getAll = async (req, res) => {
  const resp = await SubCategoryRepository.getAll();
  const fixJson = JSONbig.stringify(resp);
  res.setHeader("Content-Type", "application/json");
  res.send(fixJson);
};

export { getAll };
