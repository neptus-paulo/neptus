"use client";

import LoginForm from "@/components/forms/LoginForm";
import LoginWithGoogleButton from "@/components/LoginWithGoogleButton";
import Image from "next/image";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center p-5 gap-6">
      <div className="flex flex-col items-center px-10">
        <Image
          src="/images/logo-vertical-light.svg"
          alt="Logo Neptus"
          className="py-6"
          width={120}
          height={120}
        />
        <h1 className="font-semibold text-2xl">Entre em sua conta</h1>
        <p className="text-center text-muted-foreground text-sm">
          Insira seu email e senha abaixo para entrar em sua conta, ou
          cadastre-se
        </p>
      </div>

      <LoginForm />

      <div className="flex items-center gap-2 w-full">
        <div className="h-[1px] bg-muted-foreground w-full" />
        <p className="text-muted-foreground text-sm w-full text-center">
          ou entre com
        </p>
        <div className="h-[1px] bg-muted-foreground w-full" />
      </div>

      <LoginWithGoogleButton className="w-full" variant="outline">
        Entrar com Google
      </LoginWithGoogleButton>

      <p className="text-muted-foreground text-sm">
        Não tem uma conta?{" "}
        <Link
          href="/cadastro"
          className="text-primary hover:text-foreground underline"
        >
          Crie uma agora
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
