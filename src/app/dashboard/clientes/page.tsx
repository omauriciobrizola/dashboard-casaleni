// Página de Clientes — tabela com busca, interface em português
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Search } from "lucide-react";

interface Cliente {
  id: number;
  telefone: string;
  nome: string | null;
  criado_em: string | null;
  ultimo_contato: string | null;
  _count: { pedidos: number };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);

  const buscarClientes = useCallback(async () => {
    setCarregando(true);
    try {
      const params = busca ? `?busca=${encodeURIComponent(busca)}` : "";
      const res = await fetch(`/api/clientes${params}`);
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
    } finally {
      setCarregando(false);
    }
  }, [busca]);

  useEffect(() => {
    const timer = setTimeout(buscarClientes, 300);
    return () => clearTimeout(timer);
  }, [buscarClientes]);

  // Formatar data para padrão brasileiro
  function formatarData(data: string | null) {
    if (!data) return "—";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-7 h-7" style={{ color: "#A29BFE" }} />
          Clientes
        </h1>
        <p className="text-gray-500 mt-1">
          Gerencie seus clientes e veja o histórico de pedidos
        </p>
      </div>

      {/* Card de busca e tabela */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Lista de Clientes</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {carregando ? (
            <div className="text-center py-12 text-gray-400">
              <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-purple-500 rounded-full mx-auto mb-3" />
              Carregando clientes...
            </div>
          ) : clientes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              {busca ? "Nenhum cliente encontrado para essa busca." : "Nenhum cliente cadastrado ainda."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Pedidos</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead>Último Contato</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        {cliente.nome || "Sem nome"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {cliente.telefone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="text-white text-xs"
                          style={{ background: "#A29BFE" }}
                        >
                          {cliente._count.pedidos}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {formatarData(cliente.criado_em)}
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {formatarData(cliente.ultimo_contato)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
