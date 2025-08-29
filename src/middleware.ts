import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (
      token &&
      (pathname.startsWith("/login") ||
        pathname.startsWith("/cadastro") ||
        pathname.startsWith("/recuperar-senha") ||
        pathname.startsWith("/redefinir-senha"))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        const publicRoutes = [
          "/login",
          "/cadastro",
          "/recuperar-senha",
          "/redefinir-senha",
          "/api/auth",
        ];

        const staticFiles = [
          "/_next",
          "/images",
          "/assets",
          "/manifest.json",
          "/sw.js",
          "/workbox-",
          "/android-chrome-",
          "/favicon.ico",
        ];

        // Permite acesso a rotas públicas
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Permite acesso a arquivos estáticos
        if (
          staticFiles.some((file) => pathname.startsWith(file)) ||
          pathname.includes(".")
        ) {
          return true;
        }

        // Se tem token válido, permite acesso
        if (token) {
          return true;
        }

        // TEMPORÁRIO: Sempre permite acesso para testar funcionalidade offline
        // TODO: Implementar validação de sessão offline quando funcionar
        console.log("🔓 Permitindo acesso sem token para teste offline");
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)"],
};
