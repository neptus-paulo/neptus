import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// Função para verificar se existe sessão offline válida
function hasValidOfflineSession(req: NextRequest): boolean {
  try {
    // Verifica se existe o cookie do localStorage/sessionStorage
    const offlineAuth = req.cookies.get('offline-auth-storage');
    
    if (!offlineAuth) return false;
    
    const parsedAuth = JSON.parse(decodeURIComponent(offlineAuth.value));
    const state = parsedAuth?.state;
    
    if (!state?.cachedUser || !state?.lastLoginTime) return false;
    
    // Verifica se a sessão ainda é válida (24 horas)
    const OFFLINE_SESSION_DURATION = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const isValid = now - state.lastLoginTime < OFFLINE_SESSION_DURATION;
    
    return isValid;
  } catch {
    return false;
  }
}

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

        // Se não tem token mas tem sessão offline válida, permite acesso
        if (hasValidOfflineSession(req)) {
          return true;
        }

        return false;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)"],
};
