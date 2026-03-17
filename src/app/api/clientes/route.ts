// API de clientes — listar com busca por nome ou telefone
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get("busca") || "";

    const clientes = await prisma.clientes.findMany({
      where: busca
        ? {
            OR: [
              { nome: { contains: busca, mode: "insensitive" } },
              { telefone: { contains: busca } },
            ],
          }
        : {},
      include: {
        _count: {
          select: { pedidos: true },
        },
      },
      orderBy: { criado_em: "desc" },
    });

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json([]);
  }
}
