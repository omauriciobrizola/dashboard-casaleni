// API financeiro — dados agregados de faturamento
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get("periodo") || "mes"; // dia, semana, mes

    const agora = new Date();
    let dataInicio: Date;

    switch (periodo) {
      case "semana":
        dataInicio = new Date(agora);
        dataInicio.setDate(agora.getDate() - 7);
        break;
      case "mes":
        dataInicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
        break;
      case "ano":
        dataInicio = new Date(agora.getFullYear(), 0, 1);
        break;
      default:
        dataInicio = new Date(agora);
        dataInicio.setHours(0, 0, 0, 0);
    }

    // Buscar pedidos do período
    const pedidos = await prisma.pedidos.findMany({
      where: {
        criado_em: { gte: dataInicio },
      },
      select: {
        id: true,
        total: true,
        criado_em: true,
        status: true,
        status_pix: true,
        tipo_entrega: true,
      },
      orderBy: { criado_em: "asc" },
    });

    // Agrupar por dia para o gráfico
    const porDia: Record<string, { data: string; total: number; quantidade: number }> = {};

    pedidos.forEach((pedido: any) => {
      const dia = pedido.criado_em
        ? new Date(pedido.criado_em).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        : "Sem data";

      if (!porDia[dia]) {
        porDia[dia] = { data: dia, total: 0, quantidade: 0 };
      }
      porDia[dia].total += Number(pedido.total || 0);
      porDia[dia].quantidade += 1;
    });

    const dadosGrafico = Object.values(porDia);

    // Totais gerais
    const totalFaturamento = pedidos.reduce((acc: number, p: any) => acc + Number(p.total || 0), 0);
    const totalPedidos = pedidos.length;
    const ticketMedio = totalPedidos > 0 ? totalFaturamento / totalPedidos : 0;

    // Contagens por tipo de entrega
    const entregas = pedidos.filter((p: any) => p.tipo_entrega === "entrega").length;
    const retiradas = pedidos.filter((p: any) => p.tipo_entrega === "retirada").length;

    return NextResponse.json({
      dadosGrafico,
      resumo: {
        totalFaturamento,
        totalPedidos,
        ticketMedio,
        entregas,
        retiradas,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados financeiros:", error);
    return NextResponse.json({
      dadosGrafico: [],
      resumo: {
        totalFaturamento: 0,
        totalPedidos: 0,
        ticketMedio: 0,
        entregas: 0,
        retiradas: 0,
      },
    });
  }
}
