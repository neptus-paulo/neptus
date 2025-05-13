"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  ResetPasswordSchema,
  resetPasswordSchema,
} from "@/schemas/resetPassword-schema";
import { resetPassword } from "@/services/auth-service";

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

const ResetPasswordForm = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const token = useSearchParams().get("token");

  const resetPasswordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });
  const { handleSubmit, reset, control, formState } = resetPasswordForm;

  const handleClick = async (data: ResetPasswordSchema) => {
    if (formState.isSubmitting) setError(null);

    try {
      if (!token) {
        setError("Token inválido");
        reset();
        return;
      }
      await resetPassword(data.password, token);
      router.push("/login");
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
        setError("Erro desconhecido ao redefinir a senha");
      }
    }
  };

  return (
    <Form {...resetPasswordForm}>
      <form className="space-y-4 w-full" onSubmit={handleSubmit(handleClick)}>
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insira sua nova senha"
                  type="password"
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
          Redefinir senha
        </AppButton>
        {error && <p className="text-error text-sm text-center">{error}</p>}
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
