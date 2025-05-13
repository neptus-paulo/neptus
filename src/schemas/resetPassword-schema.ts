import { z } from "zod";

import { passwordSchema } from "./register-schema";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z
      .string()
      .nonempty("Confirmação de senha é obrigatória"),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    { message: "As senhas não são iguais", path: ["passwordConfirmation"] },
  );

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
