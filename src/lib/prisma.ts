import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const dbPath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/^file:/, '')
  : './dev.db';

function criarClientePrisma() {
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

// Em desenvolvimento, garante a recriação do cliente para atualizar a definição dos campos gerados
export const prisma =
  process.env.NODE_ENV === 'production'
    ? (globalForPrisma.prisma ||= criarClientePrisma())
    : criarClientePrisma();

if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma;
}
