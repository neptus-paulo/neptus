import { z } from "zod";

export const turbidityFormSchema = z.object({
  tank: z
    .string({ required_error: "Selecione um tanque" })
    .min(1, "Tanque é obrigatório"),
  waterColor: z.coerce.number().min(0, "Selecione uma cor da água"),
  oxygen: z.coerce.number().min(0.1, "Oxigênio deve ser maior que 0"),
  temperature: z.coerce.number().min(0.1, "Temperatura deve ser maior que 0"),
  ph: z.coerce.number().min(0.1, "pH deve ser maior que 0"),
  ammonia: z.coerce.number().min(0.1, "Amônia deve ser maior que 0"),
});

export type TurbidityFormSchema = z.infer<typeof turbidityFormSchema>;
