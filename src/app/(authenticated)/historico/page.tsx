"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Share } from "lucide-react";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

import AppButton from "@/components/AppButton";
import { colorRangeData } from "@/components/ColorRangeSelector";
import DateRangePicker from "@/components/DateRangePicker";
import TurbidityForm from "@/components/forms/TurbidityForm";
import HistoryItem from "@/components/HistoryItem";
import PageHeader from "@/components/PageHeader";
import TurbidityHeader from "@/components/TurbidityHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TurbidityFormSchema } from "@/schemas/turbidity-schema";

// Busca os dados do localStorage
function getHistoryDataFromStorage() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("storagedTurbidityData");
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

const mapStorageToHistoryItem = (item: any) => ({
  id: item.id,
  time: item.turbidityData?.timestamp?.time || "--:--",
  date: item.turbidityData?.timestamp?.date || "--/--/--",
  tankName: item.tank || "-",
  turbidity: item.turbidityData?.value ?? 0,
  temperature: item.temperature ?? 0,
  quality: item.turbidityData?.quality || "-",
  oxygen: item.oxygen ?? 0,
  ph: item.ph ?? 0,
  ammonia: item.ammonia ?? 0,
  waterColor: item.waterColor ?? 0,
});

const History = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  React.useEffect(() => {
    setHistoryData(getHistoryDataFromStorage().map(mapStorageToHistoryItem));
  }, []);

  const handleEdit = (id: string) => {
    const item = historyData.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedItemId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // Remove do localStorage
    const updated = historyData.filter((item) => item.id !== selectedItemId);
    localStorage.setItem("storagedTurbidityData", JSON.stringify(updated));
    setHistoryData(updated);
    setIsDeleteDialogOpen(false);
    setSelectedItemId("");
  };

  const handleEditSubmit = (data: TurbidityFormSchema) => {
    // Atualiza o item editado
    if (!selectedItem) return;
    const updated = historyData.map((item) =>
      item.id === selectedItem.id ? { ...item, ...data } : item
    );
    localStorage.setItem("storagedTurbidityData", JSON.stringify(updated));
    setHistoryData(updated);
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <main className="space-y-5">
      <PageHeader
        title="Histórico de registros"
        description="Filtre pela data"
      />

      <div className="flex justify-between w-full gap-5">
        <DateRangePicker
          dateRange={dateRange}
          setDateRange={setDateRange}
          className="flex-1"
        />
        <AppButton variant={"outline"} size={"lg"} className="">
          <Share />
        </AppButton>
      </div>

      <div className="flex flex-col gap-5">
        {historyData.map((item) => (
          <HistoryItem
            key={item.id}
            id={item.id}
            time={item.time}
            date={item.date}
            tankName={item.tankName}
            turbidity={item.turbidity}
            temperature={item.temperature}
            quality={item.quality}
            oxygen={item.oxygen}
            ph={item.ph}
            ammonia={item.ammonia}
            waterColor={item.waterColor}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal de confirmação de exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este registro?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="grid grid-cols-2 gap-2">
              <AppButton
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancelar
              </AppButton>
              <AppButton variant="destructive" onClick={confirmDelete}>
                Excluir
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar registro</DialogTitle>
            <DialogDescription>
              Revise e edite as informações do registro
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {selectedItem && (
              <TurbidityHeader
                turbidityValue={selectedItem.turbidity}
                quality={selectedItem.quality}
                timestamp={{
                  time: selectedItem.time,
                  date: selectedItem.date,
                }}
              />
            )}

            <TurbidityForm
              onSubmit={handleEditSubmit}
              id="edit-turbidity-form"
              initialValues={
                selectedItem
                  ? {
                      tank: selectedItem.tankName,
                      // waterColor: parseInt(
                      //   selectedItem.waterColor.replace("#", ""),
                      //   16
                      // ),
                      waterColor: selectedItem.waterColor,
                      oxygen: selectedItem.oxygen,
                      temperature: selectedItem.temperature,
                      ph: selectedItem.ph,
                      ammonia: selectedItem.ammonia,
                    }
                  : undefined
              }
            />
          </div>

          <DialogFooter>
            <div className="grid grid-cols-2 gap-2">
              <AppButton
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </AppButton>
              <AppButton type="submit" form="edit-turbidity-form">
                Salvar alterações
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default History;
