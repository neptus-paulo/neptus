"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}

const NavLink = ({ href, icon, children }: NavLinkProps) => {
  const currentPath = usePathname();
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      data-currentpath={isActive ? "active" : ""}
      className="flex items-center gap-2 w-full hover:bg-accent focus:bg-accent py-2 px-4 data-[currentpath=active]:font-bold"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default NavLink;
