import { z } from "zod";

export const addTankSchema = z.object({
  name: z.string().nonempty("Nome do tanque é obrigatório"),
  type: z
    .string({ required_error: "Selecione um tipo de tanque" })
    .min(1, "Tipo de tanque é obrigatório"),
  fish: z
    .string({ required_error: "Selecione a espécie do peixe" })
    .min(1, "Espécies do peixe é obrigatório"),
});

export type AddTankSchema = z.infer<typeof addTankSchema>;
