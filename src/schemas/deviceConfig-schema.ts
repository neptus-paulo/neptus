import { z } from "zod";

export const deviceConfigSchema = z.object({
  ipAddress: z.string().nonempty("Endereço IP é obrigatório"),
  refreshRate: z.coerce
    .number()
    .min(3, "Taxa de atualização deve ser maior que 2 segundos"),
  lastMaintenance: z.number().optional(),
});

export type DeviceConfigSchema = z.infer<typeof deviceConfigSchema>;
