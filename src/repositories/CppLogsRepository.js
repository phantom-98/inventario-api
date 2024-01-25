import prisma from "../db/index.js";

class CppLogsRepository {
  getAll = async () => {
    const cpps = prisma.cpp_logs.findMany();
    return cpps;
  };
  findOneByPriceLogId = async (id) => {
    const cpp = prisma.cpp_logs.findMany({
      where: { price_log_id: id },
    });
    return cpp;
  };
  deleteById = async (id) => {
    const cpp = prisma.cpp_logs.delete({
      where: { id: id },
    });
    return cpp;
  };
  createCppLog = async (data) => {
    const cpp = await prisma.cpp_logs.create({ data: data });

    return cpp;
  };
}

export default new CppLogsRepository();
