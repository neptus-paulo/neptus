import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { AddTankSchema, addTankSchema } from "@/schemas/addTank-schema";

import ColorRangeSelector from "../ColorRangeSelector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddTankFormProps {
  onSubmit: (data: AddTankSchema) => void;
  id?: string;
}

const AddTankForm = ({ onSubmit, id }: AddTankFormProps) => {
  const form = useForm<AddTankSchema>({
    resolver: zodResolver(addTankSchema),
    defaultValues: {
      name: "",
      type: "",
      fish: "",
    },
  });

  const { handleSubmit, reset, control } = form;

  const handleFormSubmit = (data: AddTankSchema) => {
    reset();
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        id={id}
        className="space-y-4"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {/* Seletor de cor da água */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do tanque</FormLabel>
              <FormControl>
                <Input placeholder="Tanque de Tilápia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="type"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tanque de peixe</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldState.error &&
                        "border-error focus:border-error focus:ring-error"
                    )}
                  >
                    <SelectValue placeholder="Selecione o tipo de tanque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elevado">Elevado</SelectItem>
                    <SelectItem value="barramento">Barramento</SelectItem>
                    <SelectItem value="escavado">Escavado</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fish"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Tanque de peixe</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      fieldState.error &&
                        "border-error focus:border-error focus:ring-error"
                    )}
                  >
                    <SelectValue placeholder="Selecione a espécie do peixe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tilapia">Tilápia</SelectItem>
                    <SelectItem value="tambaqui">Tambaqui</SelectItem>
                    <SelectItem value="carpa">Carpa</SelectItem>
                    <SelectItem value="pintado">Pintado</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AddTankForm;
