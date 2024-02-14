import prisma from "../db/index.js";

class ProductImageRepository {
  /* getAll = async () => {
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
  }; */
  createOne = async (productId, file) => {
    //console.log(data);
    const createdImage = await prisma.product_images.create({
      data: {
        file: `https://s3.amazonaws.com/oxfar.cl/${file}`,
        position: 1,
        product_id: productId,
      },
    });
    return createdImage;
  };
  createWithIndex = async (productId, file, index) => {
    //console.log(data);
    const createdImage = await prisma.product_images.create({
      data: {
        file: `https://s3.amazonaws.com/oxfar.cl/${file}`,
        position: index + 1,
        product_id: productId,
      },
    });
    return createdImage;
  };
  UpdateImage = async (imageId, position) => {
    //console.log(data);
    try {
      const updatedImage = await prisma.product_images.update({
        where: { id: imageId },
        data: { position: position },
      });

      return updatedImage;
    } catch (error) {
      console.log(error.message);
    }
    return createdImage;
  };
  getAllImages = async (itemId) => {
    //console.log(data);
    try {
      const images = await prisma.product_images.findMany({
        where: {
          product_id: itemId,
        },
        orderBy: {
          position: "asc", // Use 'desc' for descending order
        },
      });

      return images;
    } catch (error) {
      console.log(error.message);
    }
  };
  /* findOneById = async (id) => {
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
  }; */
}

export default new ProductImageRepository();
