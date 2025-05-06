import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { DefaultSession, NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { login, loginWithGoogle } from "@/services/auth-service";
import { UserSession } from "@/types/user-type";
import {
  ErrorApiType,
  formatAndThrowError,
  getFriendlyMessage,
} from "@/utils/error-util";
declare module "next-auth/jwt" {
  interface JWT extends UserSession {
    sub: string;
    access_token: string;
    refresh_token: string;
  }
}

declare module "next-auth" {
  interface User extends UserSession {
    access_token: string;
    refresh_token: string;
  }

  interface Session extends DefaultSession {
    user: UserSession;
    access_token?: string;
  }
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await login(credentials);
          return {
            ...response.usuario,
            access_token: response.access_token,
            refresh_token: response.refresh_token,
          };
        } catch (error) {
          formatAndThrowError(error, "Erro ao fazer login");
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email",
        },
      },
      profile(profile) {
        return {
          ...profile,
          id: profile.sub,
          image: profile.picture,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ account }) {
      if (
        account?.provider === "credentials" ||
        account?.provider === "google"
      ) {
        return true;
      }
      return false;
    },
    async jwt({ token, account, user, profile }) {
      if (account?.provider === "google" && account.id_token) {
        if (account.id_token) {
          try {
            const response = await loginWithGoogle(account.id_token);
            if (response) {
              return {
                ...token,
                access_token: response.access_token,
                refresh_token: response.refresh_token,
                sub: response.usuario.id,
                roles: response.usuario.permissoes,
                is_admin: response.usuario.is_admin,
                name: response.usuario.nome || profile?.name,
                email: response.usuario.email || profile?.email,
                profile: response.usuario.perfil,
              };
            }
          } catch (error) {
            formatAndThrowError(error, "Erro ao fazer login com o Google");
          }
        }
      }

      if (user) {
        const userReponse = user as UserSession & {
          access_token: string;
          refresh_token: string;
        };
        return {
          ...token,
          access_token: userReponse.access_token,
          refresh_token: userReponse.refresh_token,
          sub: userReponse.id,
          profile: userReponse.perfil,
          roles: userReponse.permissoes,
          is_admin: userReponse.is_admin,
          name: userReponse.nome,
          email: userReponse.email,
        } as JWT;
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.sub,
          nome: token.name,
          email: token.email,
          is_admin: token.is_admin,
          perfil: token.profile,
          permissoes: token.roles,
        },
        access_token: token.access_token,
      };
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};
