import { zodResolver } from "@hookform/resolvers/zod";
import { ControllerRenderProps, useForm } from "react-hook-form";

import ColorRangeSelector from "@/components/ColorRangeSelector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  TurbidityFormSchema,
  turbidityFormSchema,
} from "@/schemas/turbidity-schema";

interface TurbidityFormProps {
  onSubmit: (data: TurbidityFormSchema) => void;
  id?: string;
  initialValues?: Partial<TurbidityFormSchema>;
}

const TurbidityForm = ({ onSubmit, id, initialValues }: TurbidityFormProps) => {
  const form = useForm<TurbidityFormSchema>({
    resolver: zodResolver(turbidityFormSchema),
    defaultValues: {
      tank: initialValues?.tank || "",
      waterColor: initialValues?.waterColor || 0,
      oxygen: initialValues?.oxygen || 0,
      temperature: initialValues?.temperature || 0,
      ph: initialValues?.ph || 0,
      ammonia: initialValues?.ammonia || 0,
    },
  });

  const { handleSubmit, reset, control } = form;

  const CustomInputNumber = (field: ControllerRenderProps) => (
    <Input
      type="number"
      placeholder="0,0"
      step="0.1"
      {...field}
      onFocus={(e) => {
        if (e.target.value === "0") {
          e.target.value = "";
        }
      }}
      onChange={(e) => {
        field.onChange(parseFloat(e.target.value));
      }}
    />
  );

  const handleFormSubmit = (data: TurbidityFormSchema) => {
    onSubmit(data);
    reset();
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
          name="waterColor"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ColorRangeSelector
                  value={field.value}
                  onChange={(value, colorData) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tank"
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
                    <SelectValue placeholder="Selecione um tanque" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Inserir a lista real de tanques */}
                    <SelectItem value="Tanque 1">Tanque 1</SelectItem>
                    <SelectItem value="Tanque 2">Tanque 2</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4 items-start">
          <FormField
            control={control}
            name="oxygen"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Oxigênio (mg/L)</FormLabel>
                <FormControl>
                  <CustomInputNumber {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="temperature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temperatura °C</FormLabel>
                <FormControl>
                  <CustomInputNumber {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ph"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PH da água</FormLabel>
                <FormControl>
                  <CustomInputNumber {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="ammonia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amônia</FormLabel>
                <FormControl>
                  <CustomInputNumber {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default TurbidityForm;
