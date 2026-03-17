// Sidebar de navegação do dashboard — interface em português, cores de Páscoa
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  Home,
  Users,
  DollarSign,
  PlusCircle,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ChefHat,
} from "lucide-react";

// Links de navegação
const navLinks = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/novo-pedido", label: "Novo Pedido", icon: PlusCircle },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: "linear-gradient(135deg, #F8A5C2, #A29BFE)" }}
          >
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">Casa Lení</h1>
            <p className="text-xs text-white/50">Confeitaria</p>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={
                active
                  ? { background: "linear-gradient(135deg, #A29BFE, #F8A5C2)" }
                  : {}
              }
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Botão sair */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-gray-900/90 text-white backdrop-blur-sm cursor-pointer"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:block w-64 min-h-screen bg-gray-900 border-r border-white/5 fixed left-0 top-0 z-40">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile (drawer) */}
      <aside
        className={`lg:hidden fixed left-0 top-0 w-72 min-h-screen bg-gray-900 z-40 transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
