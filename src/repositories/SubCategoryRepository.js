import prisma from "../db/index.js";

class SubCategoryRepository {
  getAll = async () => {
    const products = await prisma.subcategories.findMany();
    return products;
  };
  findOne = async (id) => {
    const product = await prisma.products.findUnique({ where: { id: id } });
    return product;
  };
}

export default new SubCategoryRepository();
