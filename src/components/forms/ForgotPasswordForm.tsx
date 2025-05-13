"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  ForgotPasswordSchema,
  forgotPasswordSchema,
} from "@/schemas/forgotPassword-schema";
import { forgotPassword } from "@/services/auth-service";

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

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const forgotPasswordForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { handleSubmit, reset, control, formState } = forgotPasswordForm;

  const handleClick = async (data: ForgotPasswordSchema) => {
    if (formState.isSubmitting) {
      setError(null);
      setMessage(null);
    }

    try {
      await forgotPassword(data.email);
      setMessage(
        "Acesse seu email e clique no link enviado para redefinir sua senha",
      );
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
    <Form {...forgotPasswordForm}>
      <form className="space-y-4 w-full" onSubmit={handleSubmit(handleClick)}>
        <FormField
          control={control}
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

        <AppButton
          type="submit"
          className="w-full"
          isLoading={formState.isSubmitting}
        >
          Continuar
        </AppButton>
        {error && <p className="text-error text-sm text-center">{error}</p>}
        {message && (
          <p className="text-success text-sm text-center">{message}</p>
        )}
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
