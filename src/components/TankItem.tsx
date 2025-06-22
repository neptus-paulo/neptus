"use client";

import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { AddTankSchema } from "@/schemas/addTank-schema";

import AppButton from "./AppButton";
import AddTankForm from "./forms/AddTankForm";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export interface TankItemProps {
  name: string;
  type: "Elevado" | "Barramento" | "Escavado";
  fish: string;
}

const TankItem = ({ name, type, fish }: TankItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const mapToFormValues = (displayType: string, displayFish: string) => {
    const typeMap: Record<string, string> = {
      Elevado: "elevado",
      Barramento: "barramento",
      Escavado: "escavado",
    };

    const fishMap: Record<string, string> = {
      Tilápia: "tilapia",
      Tambaqui: "tambaqui",
      Carpa: "carpa",
      Pintado: "pintado",
    };

    return {
      type: typeMap[displayType] || displayType.toLowerCase(),
      fish: fishMap[displayFish] || displayFish.toLowerCase(),
    };
  };

  const handleDelete = () => {
    console.log(`Deletando tanque: ${name}`);
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (data: AddTankSchema) => {
    console.log(`Editando tanque: ${name}`, data);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="flex px-4 py-2 items-center gap-2 border bg-muted rounded-md">
        <div className="flex flex-1 flex-col gap-1">
          <p>{name}</p>
          <div className="flex gap-1">
            <Badge>{type}</Badge>
            <Badge className="bg-muted-foreground">{fish}</Badge>
          </div>
        </div>
        <AppButton
          variant="outline"
          size="icon"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit />
        </AppButton>
        <AppButton
          variant="outline"
          size="icon"
          className="focus:border-destructive focus:text-destructive hover:border-destructive hover:text-destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 />
        </AppButton>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir o tanque &ldquo;{name}&rdquo;?
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
              <AppButton variant="destructive" onClick={handleDelete}>
                Excluir
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar tanque</DialogTitle>
          </DialogHeader>

          <div className="my-2">
            <AddTankForm
              onSubmit={handleEdit}
              id="edit-tank-form"
              initialValues={{
                name,
                ...mapToFormValues(type, fish),
              }}
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
              <AppButton type="submit" form="edit-tank-form">
                Salvar alterações
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TankItem;
