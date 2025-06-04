import { CircleHelp } from "lucide-react";

import AppButton, { AppButtonLogout } from "@/components/AppButton";
import Header from "@/components/layout/Header";
import TurbidityDisplay from "@/components/TurbidityDisplay";
import { getQualityColor } from "@/utils/turbidity-util";

import { getSessionData } from "./api/auth/[...nextauth]/options";

const TURBIDITY_VALUE = 140;

const Home = async () => {
  const session = await getSessionData();
  console.log("Sessão:", session);
  return (
    <>
      <Header />

      <main className="p-5 space-y-5">
        <div className="flex-col">
          <h1 className="text-xl font-semibold">Turbidez em tempo real</h1>
          <p className="text-muted-foreground">Atualizado há 8s</p>
        </div>

        <TurbidityDisplay turbidityValue={TURBIDITY_VALUE} />

        <div className="mt-10">
          <h1>Olá, {session?.user.nome}</h1>
          <h1>Email: {session?.user?.email}</h1>
          <AppButtonLogout />
        </div>
      </main>
    </>
  );
};
export default Home;
