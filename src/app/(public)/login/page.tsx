import Image from "next/image";

import LoginForm from "@/components/forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center p-5 gap-6">
      <div className="flex flex-col items-center px-10">
        <Image
          src="/images/logo-vertical-light.svg"
          alt="Logo Neptus"
          className="w-[120px] h-auto py-6"
          width="0"
          height="0"
          priority
        />
        <h1 className="font-semibold text-2xl">Entre em sua conta</h1>
        <p className="text-center text-muted-foreground text-sm">
          Insira seu email e senha abaixo para entrar em sua conta, ou
          cadastre-se
        </p>
      </div>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
