// Página inicial do dashboard — cards de resumo
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

// Desabilita cache para dados sempre atualizados
export const dynamic = "force-dynamic";

async function getDashboardData() {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

    const [totalClientes, pedidosHoje, pedidosMes, faturamentoMes] =
      await Promise.all([
        prisma.clientes.count(),
        prisma.pedidos.count({
          where: { criado_em: { gte: hoje, lt: amanha } },
        }),
        prisma.pedidos.count({
          where: { criado_em: { gte: inicioMes } },
        }),
        prisma.pedidos.aggregate({
          _sum: { total: true },
          where: { criado_em: { gte: inicioMes } },
        }),
      ]);

    return {
      totalClientes,
      pedidosHoje,
      pedidosMes,
      faturamentoMes: Number(faturamentoMes._sum.total || 0),
      erro: false,
    };
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
    return {
      totalClientes: 0,
      pedidosHoje: 0,
      pedidosMes: 0,
      faturamentoMes: 0,
      erro: true,
    };
  }
}

// Card de resumo individual
function SummaryCard({
  title,
  value,
  icon: Icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: gradient }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Formata o valor em reais
  const faturamentoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(data.faturamentoMes);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Bem-vinda ao Dashboard 🐣
        </h1>
        <p className="text-gray-500 mt-1">
          Acompanhe os números da sua confeitaria
        </p>
      </div>

      {/* Aviso de conexão */}
      {data.erro && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
          ⚠️ Não foi possível conectar ao banco de dados. Os valores abaixo estão zerados. Verifique se o PostgreSQL está acessível.
        </div>
      )}

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total de Clientes"
          value={data.totalClientes}
          icon={Users}
          gradient="linear-gradient(135deg, #A29BFE, #6C5CE7)"
        />
        <SummaryCard
          title="Pedidos Hoje"
          value={data.pedidosHoje}
          icon={ShoppingBag}
          gradient="linear-gradient(135deg, #F8A5C2, #FD79A8)"
        />
        <SummaryCard
          title="Pedidos no Mês"
          value={data.pedidosMes}
          icon={TrendingUp}
          gradient="linear-gradient(135deg, #55EFC4, #00B894)"
        />
        <SummaryCard
          title="Faturamento do Mês"
          value={faturamentoFormatado}
          icon={DollarSign}
          gradient="linear-gradient(135deg, #FDCB6E, #E17055)"
        />
      </div>
    </div>
  );
}
