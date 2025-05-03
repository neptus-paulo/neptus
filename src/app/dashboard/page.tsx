import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";

const DashboardPage = async () => {
  const session = await getServerSession(options);

  if (!session) redirect("/");

  return (
    <div className="p-10">
      <h1>Olá, {session.user?.name}</h1>
      <h1>Email: {session.user?.email}</h1>
      <h1>Image url: {session.user?.image}</h1>
      <h1>ID Token: {session.id_token}</h1>
    </div>
  );
};
export default DashboardPage;
