import prisma from "../db/index.js";

class PriceLogsRepository {
  getAll = async () => {
    const cpps = await prisma.price_logs.findMany();
    return cpps;
  };
  findOneByProductId = async (id) => {
    const cpp = await prisma.price_logs.findMany({
      where: { product_id: id },
    });
    return cpp;
  };
  deleteById = async (id) => {
    const cpp = await prisma.price_logs.delete({
      where: { id: id },
    });
    return cpp;
  };
  createPriceLog = async (data) => {
    const cpp = await prisma.price_logs.create({ data: data });
    const all = await this.getAll();
    return { created: cpp, pricesList: all };
  };
  getLatestPriceByProductId = async (id) => {
    const latestCpp = await prisma.price_logs.findFirst({
      where: { product_id: id },
      orderBy: {
        createdAt: "desc", // Order by the date column in descending order (latest first)
      },
      take: 1,
      include: { products: true, cpp_logs: true }, // Retrieve only one record (the latest)
    });
    console.log(latestCpp);
    return latestCpp;
  };
}

export default new PriceLogsRepository();
