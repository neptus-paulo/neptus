import { v4 as uuidv4 } from "uuid";

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
import { getQualityColor } from "@/utils/turbidity-util";

import TurbidityHeader from "../../../../components/TurbidityHeader";

interface AdditionalParametersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storedData: {
    turbidityValue: number;
    timestamp: string;
  } | null;
}

const AdditionalParameters = ({
  isOpen,
  onOpenChange,
  storedData,
}: AdditionalParametersProps) => {
  const { text } = getQualityColor(storedData?.turbidityValue || 0);

  const hourAndMinute = storedData
    ? new Date(storedData.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const dayMonthYear = storedData
    ? new Date(storedData.timestamp).toLocaleDateString([], {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    : "--/--/--";

  // TODO: Substituir por dados reais ou props/context
  const turbidityData = {
    value: storedData?.turbidityValue || 0,
    quality: text,
    timestamp: { time: hourAndMinute, date: dayMonthYear },
  };

  const handleSubmit = (data: TurbidityFormSchema) => {
    const prev = localStorage.getItem("storagedTurbidityData");
    const prevArray = prev ? JSON.parse(prev) : [];

    const newEntry = { id: uuidv4(), turbidityData, ...data };
    const updatedArray = [...prevArray, newEntry];

    localStorage.setItem("storagedTurbidityData", JSON.stringify(updatedArray));
    localStorage.removeItem("turbidityData");
    console.log("Dados de turbidez registrados", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parâmetros adicionais</DialogTitle>
          <DialogDescription>
            Revise e adicione informações complementares
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <TurbidityHeader
            turbidityValue={turbidityData.value}
            quality={turbidityData.quality as "Bom" | "Regular" | "Ruim"}
            timestamp={turbidityData.timestamp}
          />

          <TurbidityForm onSubmit={handleSubmit} id="turbidity-form" />
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
