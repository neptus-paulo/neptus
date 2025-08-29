import { ReactNode } from "react";

import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/layout/Header";

const LayoutAuthenticated = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  return (
    <AuthGuard>
      <Header />
      <div className="p-5">{children}</div>
    </AuthGuard>
  );
};

export default LayoutAuthenticated;
