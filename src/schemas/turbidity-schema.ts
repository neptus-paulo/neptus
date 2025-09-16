import { z } from "zod";

export const turbidityFormSchema = z.object({
  tank: z
    .string({ required_error: "Selecione um tanque" })
    .min(1, "Tanque é obrigatório"),
  waterColor: z.coerce.number().min(0, "Selecione uma cor da água"),
  oxygen: z.coerce
    .number()
    .min(0, "Oxigênio deve ser maior ou igual a 0")
    .optional(),
  temperature: z.coerce
    .number()
    .min(0, "Temperatura deve ser maior ou igual a 0")
    .optional(),
  ph: z.coerce.number().min(0, "pH deve ser maior ou igual a 0").optional(),
  ammonia: z.coerce
    .number()
    .min(0, "Amônia deve ser maior ou igual a 0")
    .optional(),
});

export type TurbidityFormSchema = z.infer<typeof turbidityFormSchema>;
