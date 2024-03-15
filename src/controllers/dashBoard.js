import DashBoardDataRepository from "../repositories/DashBoardDataRepository.js";
import { getContribution, getInv, salePerMonth } from "./sale.js";

const getAll = async (req, res) => {
  const data = await DashBoardDataRepository.getMostRecent();
  res.json(data);
};
const updateDash = async (req, res) => {
  let salesM = await salePerMonth();
  let contri = await getContribution();
  let inventory = await getInv();
  let obj = {
    salePerMonth: salesM,
    contribution: contri,
    inventory: inventory,
  };
  const data = await DashBoardDataRepository.createDashBoardData(obj);

  res.json({ message: "succesfully updated dashboard" });
};

export { getAll, updateDash };
