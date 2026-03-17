// API para atualizar status de um pedido individual (usado pelo Kanban)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH — atualizar status de produção ou outros campos do pedido
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const pedido = await prisma.pedidos.update({
      where: { id: parseInt(id) },
      data: {
        ...body,
        atualizado_em: new Date(),
      },
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
