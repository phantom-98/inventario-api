import prisma from "../db/index.js";
import DashBoardData from "../models/DashBoardData.js";

class DashBoardDataRepository {
  getAll = async () => {
    const data = await prisma.DashBoardData.findMany();
    return data;
  };

  getMostRecent = async () => {
    const data = await DashBoardData.findOne().sort({ createdAt: -1 });
    return data;
  };

  createDashBoardData = async (data) => {
    const dashData = new DashBoardData(data);
    await dashData.save();

    return dashData;
  };
}

export default new DashBoardDataRepository();
