import HomeClient from "@/components/HomeClient";

import { getSessionData } from "./api/auth/[...nextauth]/options";

const Home = async () => {
  const session = await getSessionData();
  console.log("Sessão:", session);

  // Redirect to login if not authenticated and online
  if (!session) {
    // The client component will handle offline authentication
  }

  return <HomeClient />;
};

export default Home;
