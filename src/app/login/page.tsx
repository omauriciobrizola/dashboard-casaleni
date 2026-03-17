// Página de login — interface em português com cores de Páscoa
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    const result = await signIn("credentials", {
      email,
      password: senha,
      redirect: false,
    });

    if (result?.error) {
      setErro("Email ou senha incorretos. Tente novamente.");
      setCarregando(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F8A5C2 0%, #A29BFE 50%, #FDCB6E 100%)",
      }}
    >
      {/* Elementos decorativos de Páscoa */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20"
        style={{ background: "#55EFC4" }}
      />
      <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full opacity-15"
        style={{ background: "#F8A5C2" }}
      />
      <div className="absolute top-1/3 right-10 w-16 h-16 rounded-full opacity-20"
        style={{ background: "#FDCB6E" }}
      />
      <div className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full opacity-15"
        style={{ background: "#A29BFE" }}
      />

      <div className="w-full max-w-md mx-4 relative z-10">
        {/* Card de login */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
          {/* Logo / Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl"
              style={{ background: "linear-gradient(135deg, #F8A5C2, #A29BFE)" }}
            >
              🐣
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Casa Lení
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Painel de Gestão da Confeitaria
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                style={{ focusRingColor: "#A29BFE" }}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1.5">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Mensagem de erro */}
            {erro && (
              <div className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                {erro}
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #A29BFE 0%, #F8A5C2 100%)",
              }}
            >
              {carregando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Rodapé */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © 2026 Casa Lení — Confeitaria Artesanal
          </p>
        </div>
      </div>
    </div>
  );
}
