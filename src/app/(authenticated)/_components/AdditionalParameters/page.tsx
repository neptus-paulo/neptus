import AppButton from "@/components/AppButton";
import TurbidityForm from "@/components/forms/TurbidityForm";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TurbidityFormSchema } from "@/schemas/turbidity-schema";

import TurbidityHeader from "../../../../components/TurbidityHeader";

interface AdditionalParametersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdditionalParameters = ({
  isOpen,
  onOpenChange,
}: AdditionalParametersProps) => {
  const handleSubmit = (data: TurbidityFormSchema) => {
    console.log("Dados de turbidez registrados", console.log(data));
  };

  // TODO: Substituir por dados reais ou props/context
  const turbidityData = {
    value: 38,
    quality: "Bom" as const,
    timestamp: {
      time: "10:30",
      date: "18/03/2025",
    },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Parâmetros adicionais</DialogTitle>
          <DialogDescription>
            Revise e adicione informações complementares
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <TurbidityHeader
            turbidityValue={turbidityData.value}
            quality={turbidityData.quality}
            timestamp={turbidityData.timestamp}
          />

          <TurbidityForm onSubmit={handleSubmit} />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <AppButton variant="outline" size="lg">
              Cancelar
            </AppButton>
          </DialogClose>
          <AppButton size="lg" type="submit" form="turbidity-form">
            Salvar amostra
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalParameters;
