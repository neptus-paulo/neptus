import NextAuth from "next-auth";

import { options } from "./options";

declare module "next-auth" {
  interface Session {
    id_token?: string;
  }
}

const handler = NextAuth(options);

export { handler as GET, handler as POST };
