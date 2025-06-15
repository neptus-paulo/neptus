import { ReactNode } from "react";

import Header from "@/components/layout/Header";

const LayoutAuthenticated = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  return (
    <>
      <Header />
      <div className="p-5">{children}</div>
    </>
  );
};

export default LayoutAuthenticated;
