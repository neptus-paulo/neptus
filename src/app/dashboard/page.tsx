import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession();

  if (!session) redirect("/");

  return (
    <div>
      <h1>Olá, {session.user?.name}</h1>
      <h1>Email: {session.user?.email}</h1>
      <h1>Image url: {session.user?.image}</h1>
    </div>
  );
};
export default DashboardPage;
