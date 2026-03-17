// Página Financeiro — gráficos Recharts e exportação CSV, interface em português
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Download,
  Truck,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DadoGrafico {
  data: string;
  total: number;
  quantidade: number;
}

interface Resumo {
  totalFaturamento: number;
  totalPedidos: number;
  ticketMedio: number;
  entregas: number;
  retiradas: number;
}

export default function FinanceiroPage() {
  const [dados, setDados] = useState<DadoGrafico[]>([]);
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [periodo, setPeriodo] = useState("mes");
  const [carregando, setCarregando] = useState(true);

  const buscarDados = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await fetch(`/api/financeiro?periodo=${periodo}`);
      const json = await res.json();
      setDados(json.dadosGrafico);
      setResumo(json.resumo);
    } catch (err) {
      console.error("Erro ao buscar dados financeiros:", err);
    } finally {
      setCarregando(false);
    }
  }, [periodo]);

  useEffect(() => {
    buscarDados();
  }, [buscarDados]);

  // Formatar valor em reais
  function formatarReais(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  // Exportar dados como CSV
  function exportarCSV() {
    if (!dados.length) return;

    const headers = "Data,Faturamento (R$),Quantidade de Pedidos\n";
    const linhas = dados
      .map((d) => `${d.data},${d.total.toFixed(2)},${d.quantidade}`)
      .join("\n");

    const csv = headers + linhas;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `financeiro-${periodo}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const periodos = [
    { valor: "dia", label: "Hoje" },
    { valor: "semana", label: "Semana" },
    { valor: "mes", label: "Mês" },
    { valor: "ano", label: "Ano" },
  ];

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <DollarSign className="w-7 h-7" style={{ color: "#FDCB6E" }} />
            Financeiro
          </h1>
          <p className="text-gray-500 mt-1">
            Acompanhe o faturamento e desempenho da confeitaria
          </p>
        </div>
        <div className="flex gap-2">
          {/* Filtros de período */}
          {periodos.map((p) => (
            <button
              key={p.valor}
              onClick={() => setPeriodo(p.valor)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                periodo === p.valor
                  ? "text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
              style={
                periodo === p.valor
                  ? { background: "linear-gradient(135deg, #FDCB6E, #E17055)" }
                  : {}
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {carregando ? (
        <div className="text-center py-20 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-yellow-500 rounded-full mx-auto mb-3" />
          Carregando dados...
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FDCB6E, #E17055)" }}>
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Faturamento</p>
                    <p className="text-lg font-bold text-gray-800">{formatarReais(resumo?.totalFaturamento || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A29BFE, #6C5CE7)" }}>
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Pedidos</p>
                    <p className="text-lg font-bold text-gray-800">{resumo?.totalPedidos || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #55EFC4, #00B894)" }}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ticket Médio</p>
                    <p className="text-lg font-bold text-gray-800">{formatarReais(resumo?.ticketMedio || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F8A5C2, #FD79A8)" }}>
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Entregas</p>
                    <p className="text-lg font-bold text-gray-800">{resumo?.entregas || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #DFE6E9, #B2BEC3)" }}>
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Retiradas</p>
                    <p className="text-lg font-bold text-gray-800">{resumo?.retiradas || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Gráfico de barras — faturamento por dia */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Faturamento por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {dados.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Sem dados para o período selecionado.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dados}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [formatarReais(value), "Faturamento"]}
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Bar dataKey="total" fill="#A29BFE" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Gráfico de linhas — quantidade de pedidos */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Pedidos por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {dados.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Sem dados para o período selecionado.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dados}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="data" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [value, "Pedidos"]}
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="quantidade"
                        stroke="#F8A5C2"
                        strokeWidth={3}
                        dot={{ fill: "#F8A5C2", r: 5 }}
                        name="Qtd. Pedidos"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Botão exportar CSV */}
          <div className="flex justify-end">
            <button
              onClick={exportarCSV}
              disabled={dados.length === 0}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ background: "linear-gradient(135deg, #55EFC4, #00B894)" }}
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </>
      )}
    </div>
  );
}
