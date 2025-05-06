"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import AppButton from "@/components/AppButton";

export default function AuthErrorPage() {
  const error = useSearchParams().get("error");
  const decodedError = error ? decodeURIComponent(error) : "";
  const [status, message] = decodedError?.split(":") || [];

  return (
    <div className="flex flex-col gap-5 mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold">Ocorreu um erro</h1>
      <div>
        {status && <p className="text-error">Erro: {status?.trim()}</p>}
        <p className="text-error">{message?.trim() || "Erro desconhecido"}</p>
      </div>
      <Link href="/login" className="w-min">
        <AppButton>Tentar novamente</AppButton>
      </Link>
    </div>
  );
}
