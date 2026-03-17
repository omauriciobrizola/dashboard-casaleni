// API de pedidos — listar e criar pedidos
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — listar todos os pedidos (com filtro opcional de status_producao)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusProducao = searchParams.get("status_producao");

    const pedidos = await prisma.pedidos.findMany({
      where: statusProducao ? { status_producao: statusProducao } : {},
      include: {
        clientes: {
          select: { nome: true, telefone: true },
        },
      },
      orderBy: { criado_em: "desc" },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    return NextResponse.json([]);
  }
}

// POST — criar um novo pedido
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      telefone,
      nome_cliente,
      cidade,
      tipo_entrega,
      taxa_entrega,
      itens,
      subtotal,
      total,
      data_entrega,
      horario_entrega,
      observacoes,
    } = body;

    // Buscar ou criar cliente pelo telefone
    let cliente = null;
    if (telefone) {
      cliente = await prisma.clientes.upsert({
        where: { telefone },
        update: {
          nome: nome_cliente || undefined,
          ultimo_contato: new Date(),
        },
        create: {
          telefone,
          nome: nome_cliente || "Cliente",
        },
      });
    }

    // Criar o pedido
    const pedido = await prisma.pedidos.create({
      data: {
        cliente_id: cliente?.id || null,
        telefone: telefone || null,
        nome_cliente: nome_cliente || null,
        cidade: cidade || null,
        tipo_entrega: tipo_entrega || "retirada",
        taxa_entrega: taxa_entrega || 0,
        itens: itens || [],
        subtotal: subtotal || 0,
        total: total || 0,
        status: "pendente",
        status_pix: "pendente",
        status_producao: "aguardando",
        data_entrega: data_entrega ? new Date(data_entrega) : null,
        horario_entrega: horario_entrega || null,
        observacoes: observacoes || null,
      },
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}
