"use client";

import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import AppButton from "./AppButton";
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

  const handleDelete = () => {
    //TODO: Aqui você implementaria a lógica de deletar o tanque
    console.log(`Deletando tanque: ${name}`);
    setIsDeleteDialogOpen(false);
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
        <AppButton variant="outline" size="icon">
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
    </>
  );
};

export default TankItem;
