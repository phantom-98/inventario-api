import prisma from '../db/index.js'

class SubCategoryRepository {

    getAll = async () => {
        const products = prisma.subcategories.findMany()
        return products
    
    }
    findOne = async (id) => {
        const product = prisma.products.findUnique({where:{id:id}})
        return product
    
    }
}


export default new SubCategoryRepository()