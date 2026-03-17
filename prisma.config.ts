// Configuração do Prisma CLI (Prisma v7)
// O campo "url" não é mais permitido no schema.prisma — precisa estar aqui
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
});
