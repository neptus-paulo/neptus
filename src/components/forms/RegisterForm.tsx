"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  RegisterFormSchema,
  registerFormSchema,
} from "@/schemas/register-schema";
import { register } from "@/services/auth-service";

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

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const registerForm = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  const { control, formState, reset, handleSubmit } = registerForm;

  const handleRegister = async (data: RegisterFormSchema) => {
    if (formState.isSubmitting) setError(null);
    try {
      await register(data);
      signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      });
    } catch (error) {
      reset();

      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          setError(errorData.message);
        } catch {
          setError(error.message);
        }
      } else {
        setError("Erro desconhecido ao registrar");
      }
    }
  };

  return (
    <Form {...registerForm}>
      <form
        className="space-y-4 w-full"
        onSubmit={handleSubmit(handleRegister)}
      >
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu nome" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Insira seu email" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
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

        <FormField
          control={control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmação de senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Insira a senha novamente"
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
          isLoading={formState.isSubmitting}
        >
          Criar conta
        </AppButton>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </form>
    </Form>
  );
};

export default RegisterForm;
