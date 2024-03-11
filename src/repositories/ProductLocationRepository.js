import prisma from "../db/index.js";

class ProductLocationRepository {
  getProdLocation = async (id) => {
    const locations = await prisma.location_product.findMany({
      where: { product_id: id },
      include: { locations: true },
    });
    return locations;
  };
  getAll = async () => {
    const locations = await prisma.locations.findMany();
    return locations;
  };
  createProdLocation = async (productId, locationId) => {
    const productLocation = await prisma.location_product.create({
      data: { product_id: productId, location_id: locationId },
    });
    return productLocation;
  };
  deleteById = async (id) => {
    const removeLoc = await prisma.location_product.delete({
      where: { id: id },
    });
    return removeLoc;
  };
}

export default new ProductLocationRepository();
