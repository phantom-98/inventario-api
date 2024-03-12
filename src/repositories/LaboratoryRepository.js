import prisma from "../db/index.js";

class LaboratoryRepository {
  getAll = async () => {
    const labs = await prisma.laboratories.findMany();
    return labs;
  };
  findOne = async (id) => {
    const labs = await prisma.laboratories.findUnique({ where: { id: id } });
    return labs;
  };
}

export default new LaboratoryRepository();
