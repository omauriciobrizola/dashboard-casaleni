// Middleware para proteger rotas do dashboard
// Redireciona para /login se o usuário não estiver autenticado
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Proteger apenas as rotas do dashboard e da API (exceto auth)
export const config = {
  matcher: ["/dashboard/:path*", "/api/clientes/:path*", "/api/pedidos/:path*", "/api/financeiro/:path*"],
};
