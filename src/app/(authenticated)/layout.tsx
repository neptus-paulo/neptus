import { ReactNode } from "react";

import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/layout/Header";

const LayoutAuthenticated = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col max-w-[430px] mx-auto">
        <Header />
        <main className="flex-1 p-5 w-full">{children}</main>
      </div>
    </AuthGuard>
  );
};

export default LayoutAuthenticated;
