import PageHeader from "@/components/PageHeader";
import TankItem, { TankItemProps } from "@/components/TankItem";

import ModalAddTank from "./_components/ModalAddTank";

interface TankWithId extends TankItemProps {
  id: string;
}

const tanksMock: TankWithId[] = [
  {
    id: "1",
    name: "Tanque de Tilápia",
    type: "Elevado",
    fish: "Tilápia",
  },
  { id: "2", name: "Tanque de Carpa", type: "Escavado", fish: "Carpa" },
  {
    id: "3",
    name: "Tanque de Tambaqui",
    type: "Barramento",
    fish: "Tambaqui",
  },
];

const Tanks = () => {
  return (
    <main className="space-y-5">
      <PageHeader
        title="Tanques de peixes"
        description="Gerencie os tanques de peixes"
      />

      <ModalAddTank />

      <h2 className="text-lg font-semibold">Tanques salvos</h2>
      {tanksMock.map((tank) => (
        <TankItem
          key={tank.id}
          name={tank.name}
          type={tank.type}
          fish={tank.fish}
        />
      ))}
    </main>
  );
};

export default Tanks;
