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

// Dados mock para exemplo
const historyData = [
  {
    id: "1",
    time: "10:30",
    date: "18/03/2025",
    tankName: "Tanque de Tilápia 1",
    turbidity: 38,
    temperature: 28.2,
    quality: "Bom" as const,
    oxygen: 6.7,
    ph: 7.1,
    ammonia: 0.03,
    waterColor: colorRangeData[1].color,
  },
  {
    id: "2",
    time: "14:15",
    date: "17/03/2025",
    tankName: "Tanque de Tambaqui 2",
    turbidity: 45,
    temperature: 26.8,
    quality: "Regular" as const,
    oxygen: 5.9,
    ph: 6.8,
    ammonia: 0.05,
    waterColor: colorRangeData[3].color,
  },
  {
    id: "3",
    time: "09:00",
    date: "16/03/2025",
    tankName: "Tanque de Carpa 3",
    turbidity: 80,
    temperature: 27.5,
    quality: "Ruim" as const,
    oxygen: 4.5,
    ph: 6.5,
    ammonia: 0.1,
    waterColor: colorRangeData[4].color,
  },
];

const History = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<
    (typeof historyData)[0] | null
  >(null);

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
    console.log("Deletando item:", selectedItemId);
    setIsDeleteDialogOpen(false);
    setSelectedItemId("");
  };

  const handleEditSubmit = (data: TurbidityFormSchema) => {
    console.log("Editando item:", selectedItem?.id, data);
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
                      waterColor: parseInt(
                        selectedItem.waterColor.replace("#", ""),
                        16
                      ),
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
