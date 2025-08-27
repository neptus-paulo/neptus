"use client";

import { Clock, Edit, Trash2 } from "lucide-react";

import { getQualityColor } from "@/utils/turbidity-util";

import AppButton from "./AppButton";
import Box from "./Box";

interface HistoryItemProps {
  id: string;
  time: string;
  date: string;
  tankName: string;
  turbidity: number;
  temperature: number;
  quality: "Bom" | "Regular" | "Ruim";
  oxygen: number;
  ph: number;
  ammonia: number;
  waterColor: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const HistoryItem = ({
  id,
  time,
  date,
  tankName,
  turbidity,
  temperature,
  quality,
  oxygen,
  ph,
  ammonia,
  waterColor,
  onEdit,
  onDelete,
}: HistoryItemProps) => {
  const { color, text } = getQualityColor(turbidity);

  return (
    <Box>
      <div className="flex items-center">
        <div className="flex gap-2 flex-1 items-center">
          <Clock size={18} />
          <p className="text-sm">
            {time} - {date}
          </p>
        </div>
        <div className="flex gap-2">
          <AppButton size="sm" variant="outline" onClick={() => onEdit?.(id)}>
            <Edit />
          </AppButton>
          <AppButton
            size="sm"
            variant="outline"
            className="focus:border-destructive focus:text-destructive hover:border-destructive hover:text-destructive"
            onClick={() => onDelete?.(id)}
          >
            <Trash2 />
          </AppButton>
        </div>
      </div>

      <p className="font-bold mb-2">{tankName}</p>

      <div className="grid grid-cols-2 gap-y-1 gap-x-4">
        <div className="flex gap-1">
          <p className="text-sm">Turbidez:</p>
          <p className="text-sm font-bold">{turbidity} NTU</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm">Temperatura:</p>
          <p className="text-sm font-bold">{temperature}ºC</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm">Qualidade:</p>
          <p className={`text-sm font-bold ${color}`}>{text}</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm">Oxigênio:</p>
          <p className="text-sm font-bold">{oxygen} mg/L</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm">pH:</p>
          <p className="text-sm font-bold">{ph}</p>
        </div>
        <div className="flex gap-1">
          <p className="text-sm">Amônia:</p>
          <p className="text-sm font-bold">{ammonia} mg/L</p>
        </div>
        <div className="flex gap-2 col-span-2">
          <div className="flex gap-1 items-center">
            <p className="text-sm underline">Cor da água:</p>
            <div
              className="w-5 h-5 rounded-sm border border-border"
              style={{ backgroundColor: waterColor }}
            />
          </div>
        </div>
      </div>
    </Box>
  );
};

export default HistoryItem;
