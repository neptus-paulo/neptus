import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

import { RegisterFormSchema } from "@/schemas/register-schema";
import { register } from "@/services/auth-service";

export const useRegister = () =>
  useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterFormSchema) => {
      await register(data);
      return data;
    },
    onSuccess: async (data) =>
      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/",
      }),
  });
