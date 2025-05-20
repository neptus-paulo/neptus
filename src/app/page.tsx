import { AppButtonLogout } from "@/components/AppButton";
import Header from "@/components/Header";

import { getSessionData } from "./api/auth/[...nextauth]/options";

const Home = async () => {
  const session = await getSessionData();

  return (
    <div>
      <Header />
      <h1>Olá, {session?.user.nome}</h1>
      <h1>Email: {session?.user?.email}</h1>
      <AppButtonLogout />
    </div>
  );
};
export default Home;
