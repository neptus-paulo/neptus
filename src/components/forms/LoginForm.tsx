"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  const loginForm = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginFormSchema) => {
    // TODO: Implementar a lógica de login
    console.log(data);
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
        <AppButton type="submit" className="w-full">
          Entrar
        </AppButton>
      </form>
    </Form>
  );
};

export default LoginForm;
