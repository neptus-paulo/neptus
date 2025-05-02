import { z } from "zod";

export const registerFormSchema = z
  .object({
    name: z.string().nonempty("Nome é obrigatório"),
    email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .nonempty("Senha é obrigatória")
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres" }),
    passwordConfirmation: z
      .string()
      .nonempty("Confirmação de senha é obrigatória"),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    { message: "As senhas não são iguais", path: ["passwordConfirmation"] },
  );

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
