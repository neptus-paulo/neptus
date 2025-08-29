import { NextResponse } from "next/server";
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
          // "/",
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

        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        if (
          staticFiles.some((file) => pathname.startsWith(file)) ||
          pathname.includes(".")
        ) {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)"],
};
