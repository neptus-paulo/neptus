import { z } from "zod";

const passwordSchema = z
  .string()
  .nonempty("Senha é obrigatória")
  .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "A senha deve conter pelo menos uma letra minúscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "A senha deve conter pelo menos um número",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    message: "A senha deve conter pelo menos um caractere especial",
  });

export const registerFormSchema = z
  .object({
    name: z.string().nonempty("Nome é obrigatório"),
    email: z.string().nonempty("Email é obrigatório").email("Email inválido"),
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .nonempty("Confirmação de senha é obrigatória"),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    { message: "As senhas não são iguais", path: ["passwordConfirmation"] },
  );

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
