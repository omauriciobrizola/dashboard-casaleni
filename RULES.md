# RULES — Agente de Desenvolvimento | Dashboard Confeitaria

> Estas regras devem ser seguidas em TODAS as interações deste projeto, sem exceção.

---

## 🔒 Regras de Segurança (NUNCA violar)

1. **NUNCA** escreva credenciais, senhas ou connection strings diretamente no código.
2. **SEMPRE** use variáveis de ambiente (`.env`) para: `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_PASSWORD`.
3. **NUNCA** exponha a `DATABASE_URL` em arquivos do frontend ou em chamadas do lado do cliente.
4. **SEMPRE** adicione `.env` e `.env.local` ao `.gitignore` antes de qualquer outro passo.
5. **NUNCA** use `dangerouslyAllowBrowser: true` em qualquer cliente de banco de dados.

---

## 🗃️ Regras de Banco de Dados

6. **SEMPRE** inspecione o schema real do PostgreSQL via MCP antes de escrever qualquer query ou model Prisma.
7. **NUNCA** assuma nomes de colunas — leia o banco primeiro, depois escreva o código.
8. **SEMPRE** use o Prisma Client para queries — não escreva SQL raw a menos que seja absolutamente necessário.
9. Ao rodar `prisma db pull`, revise o schema gerado e confirme com o usuário antes de continuar.
10. **NUNCA** rode `prisma migrate reset` ou qualquer comando destrutivo sem avisar explicitamente o usuário.

---

## 🧱 Regras de Arquitetura

11. Use **Next.js 14 com App Router** — não use Pages Router.
12. Toda lógica de acesso ao banco deve estar em **Server Components** ou **API Routes** — nunca no client.
13. Use **shadcn/ui** para todos os componentes visuais (botões, tabelas, formulários, cards).
14. Use **Tailwind CSS** para estilização — não crie arquivos `.css` customizados desnecessários.
15. Organize os arquivos assim:
    ```
    /app
      /dashboard
        /clientes
        /financeiro
        /pedidos
        /novo-pedido
      /api
        /clientes
        /pedidos
        /financeiro
    /components
      /ui (shadcn)
      /dashboard (componentes específicos do projeto)
    /lib
      /prisma.ts (cliente do banco)
      /auth.ts (configuração NextAuth)
    /prisma
      schema.prisma
    ```

---

## 💬 Regras de Comunicação

16. **SEMPRE** escreva comentários no código em **português**.
17. **SEMPRE** explique o que está fazendo em cada fase, em linguagem simples, como se o usuário fosse iniciante.
18. Antes de iniciar cada fase, liste o que será feito em tópicos curtos.
19. Se encontrar um erro, explique a causa em 1 frase simples e mostre a correção.
20. **NUNCA** use jargão técnico sem explicar o que significa na mesma frase.

---

## 🎨 Regras de Interface

21. A interface deve estar **100% em português**.
22. Use tons de cor da Páscoa: rosa (`#F8A5C2`), lilás (`#A29BFE`), amarelo (`#FDCB6E`), verde menta (`#55EFC4`).
23. Todos os campos de formulário devem ter **labels claras** e **mensagens de erro em português**.
24. Botões de ação destrutiva (deletar, cancelar) devem ter um **modal de confirmação** antes de executar.
25. A interface deve ser **responsiva** — testada em viewport mobile (375px) e desktop (1280px).

---

## ✅ Regras de Qualidade

26. Após cada fase concluída, abra o navegador interno e faça um **screenshot** para validar visualmente.
27. Teste o fluxo completo: login → ver clientes → criar pedido → ver no kanban → ver no financeiro.
28. Antes de finalizar, verifique se o arquivo `README.md` foi criado com instruções de instalação.
29. O arquivo `.env.example` deve estar sempre atualizado com todas as variáveis necessárias.
30. **NUNCA** considere uma fase como concluída sem ter testado no navegador.
