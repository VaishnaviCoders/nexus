import { PrismaClient } from './generated/prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// ! Use This commit code to debug the issue with prisma
// {
//   log: ['query', 'info', 'warn', 'error'],
// }
// console.log = console.info;

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
