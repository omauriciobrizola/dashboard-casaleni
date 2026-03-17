// Formulário de Novo Pedido — cardápio predefinido, cálculo automático, interface em português
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  Minus,
  Plus,
  ShoppingCart,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  FileText,
  Check,
} from "lucide-react";

// Cardápio predefinido da confeitaria
const CARDAPIO = [
  { id: 1, nome: "Ovo de Páscoa 250g", preco: 45.0, categoria: "Ovos" },
  { id: 2, nome: "Ovo de Páscoa 500g", preco: 75.0, categoria: "Ovos" },
  { id: 3, nome: "Ovo de Páscoa 1kg", preco: 130.0, categoria: "Ovos" },
  { id: 4, nome: "Ovo Trufado 250g", preco: 60.0, categoria: "Ovos" },
  { id: 5, nome: "Ovo Trufado 500g", preco: 95.0, categoria: "Ovos" },
  { id: 6, nome: "Caixa de Bombons (12un)", preco: 35.0, categoria: "Bombons" },
  { id: 7, nome: "Caixa de Trufas (8un)", preco: 40.0, categoria: "Trufas" },
  { id: 8, nome: "Barra de Chocolate 200g", preco: 25.0, categoria: "Barras" },
  { id: 9, nome: "Kit Páscoa Infantil", preco: 55.0, categoria: "Kits" },
  { id: 10, nome: "Kit Páscoa Premium", preco: 120.0, categoria: "Kits" },
  { id: 11, nome: "Coelho de Chocolate", preco: 30.0, categoria: "Especiais" },
  { id: 12, nome: "Cesta de Páscoa", preco: 150.0, categoria: "Cestas" },
];

interface ItemPedido {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

export default function NovoPedidoPage() {
  const router = useRouter();
  const [telefone, setTelefone] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [cidade, setCidade] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("retirada");
  const [taxaEntrega, setTaxaEntrega] = useState(0);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [dataEntrega, setDataEntrega] = useState("");
  const [horarioEntrega, setHorarioEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Adicionar item ao pedido
  function adicionarItem(item: (typeof CARDAPIO)[0]) {
    setItens((prev) => {
      const existente = prev.find((i) => i.id === item.id);
      if (existente) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantidade: i.quantidade + 1 } : i
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  }

  // Alterar quantidade
  function alterarQuantidade(id: number, delta: number) {
    setItens((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, quantidade: Math.max(0, i.quantidade + delta) } : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }

  // Cálculos
  const subtotal = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const total = subtotal + (tipoEntrega === "entrega" ? taxaEntrega : 0);

  // Formatar reais
  function formatarReais(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  }

  // Enviar pedido
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (itens.length === 0) return;

    setEnviando(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telefone,
          nome_cliente: nomeCliente,
          cidade,
          tipo_entrega: tipoEntrega,
          taxa_entrega: tipoEntrega === "entrega" ? taxaEntrega : 0,
          itens: itens.map((i) => ({
            nome: i.nome,
            preco: i.preco,
            quantidade: i.quantidade,
          })),
          subtotal,
          total,
          data_entrega: dataEntrega || null,
          horario_entrega: horarioEntrega || null,
          observacoes: observacoes || null,
        }),
      });

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => router.push("/dashboard/pedidos"), 2000);
      }
    } catch (err) {
      console.error("Erro ao criar pedido:", err);
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #55EFC4, #00B894)" }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Pedido Criado! 🎉
          </h2>
          <p className="text-gray-500">
            Redirecionando para o painel de pedidos...
          </p>
        </div>
      </div>
    );
  }

  // Agrupar cardápio por categoria
  const categorias = [...new Set(CARDAPIO.map((i) => i.categoria))];

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <PlusCircle className="w-7 h-7" style={{ color: "#55EFC4" }} />
          Novo Pedido
        </h1>
        <p className="text-gray-500 mt-1">
          Preencha os dados do cliente e selecione os itens do cardápio
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna esquerda — dados do cliente */}
          <div className="lg:col-span-1 space-y-6">
            {/* Dados do cliente */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" style={{ color: "#A29BFE" }} />
                  Dados do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="telefone" className="flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5" /> Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div>
                  <Label htmlFor="nome" className="flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5" /> Nome
                  </Label>
                  <Input
                    id="nome"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Nome do cliente"
                  />
                </div>
                <div>
                  <Label htmlFor="cidade" className="flex items-center gap-1.5 mb-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Cidade
                  </Label>
                  <Input
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Entrega */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Tipo de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoEntrega("retirada")}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      tipoEntrega === "retirada"
                        ? "text-white border-transparent shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                    style={
                      tipoEntrega === "retirada"
                        ? { background: "linear-gradient(135deg, #A29BFE, #6C5CE7)" }
                        : {}
                    }
                  >
                    Retirada
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoEntrega("entrega")}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer border ${
                      tipoEntrega === "entrega"
                        ? "text-white border-transparent shadow-md"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                    style={
                      tipoEntrega === "entrega"
                        ? { background: "linear-gradient(135deg, #F8A5C2, #FD79A8)" }
                        : {}
                    }
                  >
                    Entrega
                  </button>
                </div>
                {tipoEntrega === "entrega" && (
                  <div>
                    <Label htmlFor="taxa" className="mb-1.5 block">
                      Taxa de Entrega (R$)
                    </Label>
                    <Input
                      id="taxa"
                      type="number"
                      step="0.01"
                      min="0"
                      value={taxaEntrega}
                      onChange={(e) => setTaxaEntrega(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="data-entrega" className="flex items-center gap-1.5 mb-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Data de Entrega
                  </Label>
                  <Input
                    id="data-entrega"
                    type="date"
                    value={dataEntrega}
                    onChange={(e) => setDataEntrega(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="horario" className="flex items-center gap-1.5 mb-1.5">
                    <Clock className="w-3.5 h-3.5" /> Horário
                  </Label>
                  <Input
                    id="horario"
                    value={horarioEntrega}
                    onChange={(e) => setHorarioEntrega(e.target.value)}
                    placeholder="Ex: 14:00 - 16:00"
                  />
                </div>
                <div>
                  <Label htmlFor="obs" className="flex items-center gap-1.5 mb-1.5">
                    <FileText className="w-3.5 h-3.5" /> Observações
                  </Label>
                  <textarea
                    id="obs"
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Alguma observação sobre o pedido..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna central — cardápio */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" style={{ color: "#FDCB6E" }} />
                  Cardápio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categorias.map((cat) => (
                  <div key={cat} className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {cat}
                    </h3>
                    <div className="space-y-2">
                      {CARDAPIO.filter((i) => i.categoria === cat).map((item) => {
                        const noCarrinho = itens.find((i) => i.id === item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => adicionarItem(item)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer border ${
                              noCarrinho
                                ? "border-purple-200 bg-purple-50"
                                : "border-gray-100 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <span className="font-medium text-gray-700">{item.nome}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">{formatarReais(item.preco)}</span>
                              {noCarrinho && (
                                <Badge variant="secondary" className="text-white text-xs" style={{ background: "#A29BFE" }}>
                                  {noCarrinho.quantidade}
                                </Badge>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Coluna direita — resumo do pedido */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                {itens.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Nenhum item selecionado</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {itens.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700">{item.nome}</p>
                            <p className="text-xs text-gray-400">
                              {formatarReais(item.preco)} × {item.quantidade}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {formatarReais(item.preco * item.quantidade)}
                            </span>
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                type="button"
                                onClick={() => alterarQuantidade(item.id, -1)}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => alterarQuantidade(item.id, 1)}
                                className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Totais */}
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{formatarReais(subtotal)}</span>
                      </div>
                      {tipoEntrega === "entrega" && taxaEntrega > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Taxa de Entrega</span>
                          <span>{formatarReais(taxaEntrega)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total</span>
                        <span style={{ color: "#00B894" }}>{formatarReais(total)}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Botão criar pedido */}
                <button
                  type="submit"
                  disabled={itens.length === 0 || enviando}
                  className="w-full mt-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #55EFC4, #00B894)",
                  }}
                >
                  {enviando ? "Criando pedido..." : "Criar Pedido"}
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
