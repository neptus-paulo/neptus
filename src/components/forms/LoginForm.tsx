"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { LoginFormSchema, loginFormSchema } from "@/schemas/login-schema";

import AppButton from "../AppButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loginForm = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormSchema) => {
    if (loginForm.formState.isSubmitting) setError(null);
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (result?.error) {
      loginForm.reset();
      try {
        const errorData = JSON.parse(result.error);
        setError(errorData.message);
      } catch {
        setError("Credenciais inválidas");
      }
    } else if (result?.ok) {
      router.push("/");
    }
  };

  return (
    <Form {...loginForm}>
      <form
        className="space-y-4 w-full"
        onSubmit={loginForm.handleSubmit(handleLogin)}
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="exemplo@gmail.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between">
                <span>Senha</span>
                <Link
                  className="text-muted-foreground hover:text-foreground underline"
                  href="/recuperar-senha"
                >
                  Esqueci minha senha
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Insira sua senha"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <AppButton
          type="submit"
          className="w-full"
          isLoading={loginForm.formState.isSubmitting}
        >
          Entrar
        </AppButton>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </form>
    </Form>
  );
};

export default LoginForm;
