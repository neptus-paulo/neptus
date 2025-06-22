"use client";

import { Plus } from "lucide-react";
import React, { useState } from "react";

import AppButton from "@/components/AppButton";
import AddTankForm from "@/components/forms/AddTankForm";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddTankSchema } from "@/schemas/addTank-schema";

const ModalAddTank = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTank = (data: AddTankSchema) => {
    console.log("Adicionando tanque...", data);
    setIsModalOpen(false);
  };

  return (
    <div>
      <AppButton
        className="w-full"
        size="lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus /> Adicionar tanque
      </AppButton>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar tanque</DialogTitle>
          </DialogHeader>

          <div className="my-2">
            <AddTankForm onSubmit={handleAddTank} id="add-tank-form" />
          </div>

          <DialogFooter>
            <div className="grid grid-cols-2 gap-2">
              <AppButton
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </AppButton>
              <AppButton type="submit" form="add-tank-form">
                Adicionar
              </AppButton>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalAddTank;
