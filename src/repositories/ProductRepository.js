import prisma from "../db/index.js";

class ProductRepository {
  getAll = async () => {
    const products = await prisma.products.findMany({
      include: {
        laboratories: true,
        subcategories: true,
      },
      orderBy: {
        stock: "desc", // Use 'desc' for descending order
      },
    });
    //console.log(products);
    return products;
  };
  createOne = async (data) => {
    const createdProduct = await prisma.products.create({ data: data });
    return createdProduct;
  };
  findOneById = async (id) => {
    const product = prisma.products.findUnique({
      where: { id: id },
    });

    return product;
  };
  findOneBySku = async (sku) => {
    const product = prisma.products.findFirst({
      where: { sku: sku },
    });

    return product;
  };
  updateOneById = async (id, data) => {
    try {
      const updatedProduct = await prisma.products.update({
        where: { id: id },
        data: { ...data },
      });

      return updatedProduct;
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default new ProductRepository();
