// Kanban de Pedidos — drag-and-drop com @hello-pangea/dnd, interface em português
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
  RefreshCw,
} from "lucide-react";

// Colunas do Kanban baseadas em status_producao
const COLUNAS = [
  {
    id: "aguardando",
    titulo: "🕐 Aguardando",
    cor: "#A29BFE",
    bgCor: "rgba(162, 155, 254, 0.08)",
  },
  {
    id: "em_producao",
    titulo: "👩‍🍳 Em Produção",
    cor: "#FDCB6E",
    bgCor: "rgba(253, 203, 110, 0.08)",
  },
  {
    id: "pronto",
    titulo: "✅ Pronto",
    cor: "#55EFC4",
    bgCor: "rgba(85, 239, 196, 0.08)",
  },
  {
    id: "entregue",
    titulo: "📦 Entregue",
    cor: "#F8A5C2",
    bgCor: "rgba(248, 165, 194, 0.08)",
  },
];

interface Item {
  nome: string;
  quantidade: number;
  preco: number;
}

interface Pedido {
  id: number;
  nome_cliente: string | null;
  telefone: string | null;
  cidade: string | null;
  tipo_entrega: string | null;
  itens: Item[] | null;
  total: string | null;
  status_producao: string | null;
  data_entrega: string | null;
  horario_entrega: string | null;
  criado_em: string | null;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarPedidos = useCallback(async () => {
    try {
      const res = await fetch("/api/pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (err) {
      console.error("Erro ao buscar pedidos:", err);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarPedidos();
  }, [buscarPedidos]);

  // Pedidos agrupados por coluna
  function pedidosPorColuna(colunaId: string) {
    return pedidos.filter((p) => (p.status_producao || "aguardando") === colunaId);
  }

  // Ao soltar um card — atualiza status_producao
  async function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const pedidoId = parseInt(draggableId);
    const novoStatus = destination.droppableId;

    // Atualização otimista na UI
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId ? { ...p, status_producao: novoStatus } : p
      )
    );

    // Salvar no banco
    try {
      await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_producao: novoStatus }),
      });
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      buscarPedidos(); // Reverter em caso de erro
    }
  }

  // Formatar data
  function formatarData(data: string | null) {
    if (!data) return null;
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  // Formatar reais
  function formatarReais(valor: string | null) {
    if (!valor) return "R$ 0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(valor));
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full mx-auto mb-3" />
          Carregando pedidos...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-7 h-7" style={{ color: "#F8A5C2" }} />
            Pedidos
          </h1>
          <p className="text-gray-500 mt-1">
            Arraste os cards para atualizar o status de produção
          </p>
        </div>
        <button
          onClick={() => {
            setCarregando(true);
            buscarPedidos();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {COLUNAS.map((coluna) => {
            const pedidosColuna = pedidosPorColuna(coluna.id);
            return (
              <div key={coluna.id} className="flex flex-col">
                {/* Cabeçalho da coluna */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-t-xl"
                  style={{ background: coluna.bgCor }}
                >
                  <h2 className="font-semibold text-sm">{coluna.titulo}</h2>
                  <Badge
                    variant="secondary"
                    className="text-white text-xs"
                    style={{ background: coluna.cor }}
                  >
                    {pedidosColuna.length}
                  </Badge>
                </div>

                {/* Área de drop */}
                <Droppable droppableId={coluna.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[200px] p-2 rounded-b-xl space-y-2 transition-colors ${
                        snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50/50"
                      }`}
                    >
                      {pedidosColuna.map((pedido, index) => (
                        <Draggable
                          key={pedido.id}
                          draggableId={String(pedido.id)}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-shadow ${
                                snapshot.isDragging ? "shadow-xl" : ""
                              }`}
                            >
                              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
                                <CardContent className="p-3">
                                  {/* Nome e total */}
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <p className="font-semibold text-sm text-gray-800">
                                        {pedido.nome_cliente || "Sem nome"}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        Pedido #{pedido.id}
                                      </p>
                                    </div>
                                    <span
                                      className="text-sm font-bold"
                                      style={{ color: "#00B894" }}
                                    >
                                      {formatarReais(pedido.total)}
                                    </span>
                                  </div>

                                  {/* Itens */}
                                  {pedido.itens && Array.isArray(pedido.itens) && (
                                    <div className="mb-2">
                                      {(pedido.itens as Item[]).slice(0, 3).map((item, i) => (
                                        <p key={i} className="text-xs text-gray-500">
                                          {item.quantidade}× {item.nome}
                                        </p>
                                      ))}
                                      {(pedido.itens as Item[]).length > 3 && (
                                        <p className="text-xs text-gray-400 italic">
                                          +{(pedido.itens as Item[]).length - 3} item(ns)
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {/* Detalhes */}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {pedido.telefone && (
                                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                        <Phone className="w-3 h-3" />
                                        {pedido.telefone}
                                      </span>
                                    )}
                                    {pedido.data_entrega && (
                                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        {formatarData(pedido.data_entrega)}
                                      </span>
                                    )}
                                    {pedido.horario_entrega && (
                                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {pedido.horario_entrega}
                                      </span>
                                    )}
                                    {pedido.tipo_entrega && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                        style={{
                                          background:
                                            pedido.tipo_entrega === "entrega"
                                              ? "rgba(248, 165, 194, 0.2)"
                                              : "rgba(162, 155, 254, 0.2)",
                                          color:
                                            pedido.tipo_entrega === "entrega"
                                              ? "#FD79A8"
                                              : "#6C5CE7",
                                        }}
                                      >
                                        {pedido.tipo_entrega === "entrega" ? (
                                          <><MapPin className="w-3 h-3 mr-1" />Entrega</>
                                        ) : (
                                          <><Package className="w-3 h-3 mr-1" />Retirada</>
                                        )}
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
