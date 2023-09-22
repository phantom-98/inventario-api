import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
      const result = await prisma.$queryRaw`SELECT * FROM products`;
      console.log("asdads---------------------z");
      console.log(result.length);
    } catch (error) {
      console.error(error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  main();