"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRegister } from "@/hooks/useRegister";
import {
  DeviceConfigSchema,
  deviceConfigSchema,
} from "@/schemas/deviceConfig-schema";
import { parseErrorMessage } from "@/utils/error-util";

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

const DeviceConfigForm = () => {
  const { mutate: register, isError, error, isPending } = useRegister();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deviceConfig = useForm<DeviceConfigSchema>({
    resolver: zodResolver(deviceConfigSchema),
    defaultValues: {
      ipAddress: "",
      refreshRate: 4,
      lastMaintenance: undefined,
    },
  });
  const { control, formState, reset, handleSubmit } = deviceConfig;

  const handleRegister = (data: DeviceConfigSchema) => {
    console.log("Registering device with data:", data);
    // register(data, { onError: () => reset() });
  };

  const handleRefresh = (onChange: (value: number) => void) => {
    setIsRefreshing(true);
    onChange(Date.now());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <Form {...deviceConfig}>
      <form
        className="space-y-4 w-full"
        onSubmit={handleSubmit(handleRegister)}
      >
        <FormField
          control={control}
          name="ipAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço IP do ESP32</FormLabel>
              <FormControl>
                <Input placeholder="192.168.0.50" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="refreshRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taxa de atualização em segundos</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  max={59}
                  // min={3}
                  placeholder="4"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lastMaintenance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data da última manutenção</FormLabel>
              <FormControl>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <AppButton
                    variant="outline"
                    type="button"
                    data-empty={!field.value}
                    className="data-[empty=true]:text-muted-foreground justify-start text-left"
                  >
                    <History className="text-muted-foreground" />
                    {field.value ? (
                      format(field.value, "HH:mm - dd/MM/yyyy", {
                        locale: ptBR,
                      })
                    ) : (
                      <span>Sem manutenção</span>
                    )}
                  </AppButton>
                  <AppButton
                    variant="outline"
                    type="button"
                    onClick={() => handleRefresh(field.onChange)}
                  >
                    <RefreshCw
                      className={`transition-transform duration-500 ${
                        isRefreshing ? "animate-spin text-primary" : ""
                      }`}
                    />
                    Atualizar
                  </AppButton>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <AppButton
          type="submit"
          className="w-full"
          size="lg"
          isLoading={formState.isSubmitting || isPending}
        >
          Salvar
        </AppButton>
        {isError && (
          <p className="text-error text-sm text-center">
            {parseErrorMessage(error)}
          </p>
        )}
      </form>
    </Form>
  );
};

export default DeviceConfigForm;
