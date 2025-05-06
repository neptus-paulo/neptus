"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

import AppButton from "@/components/AppButton";
import useUserStore from "@/stores/user-store";

const Home = () => {
  const session = useSession();
  useEffect(() => {
    console.log("Sessão:", session);
  }, [session]);

  return (
    <div className="p-10">
      <h1>Olá, {session.data?.user?.nome}</h1>
      <h1>Email: {session.data?.user?.email}</h1>
      <AppButton onClick={() => signOut({ callbackUrl: "/login" })}>
        Sair da conta
      </AppButton>
    </div>
  );
};
export default Home;
