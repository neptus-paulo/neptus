"use client";

import {
  Bolt,
  ChartPie,
  FlaskConical,
  History,
  MenuIcon,
  RefreshCcw,
  Waves,
} from "lucide-react";
import { useState } from "react";

import AppButton, { AppButtonLogout } from "../AppButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import NavLink from "./NavLink";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="hover:cursor-pointer">
          <MenuIcon className="h-6 w-6" />
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[250px] gap-0"
          aria-describedby="menu"
        >
          <SheetHeader>
            <SheetTitle className="py-4 text-xl">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-between h-full pb-10">
            <div className="flex flex-col gap-2">
              <NavLink href="/" icon={<ChartPie />} onClick={handleLinkClick}>
                Dashboard
              </NavLink>
              <NavLink
                href="/historico"
                icon={<History />}
                onClick={handleLinkClick}
              >
                Histórico
              </NavLink>
              <NavLink
                href="/configuracoes"
                icon={<Bolt />}
                onClick={handleLinkClick}
              >
                Configurações
              </NavLink>
              <NavLink
                href="/tanques"
                icon={<Waves />}
                onClick={handleLinkClick}
              >
                Tanques
              </NavLink>
              {/* <NavLink
                href="/teste"
                icon={<FlaskConical />}
                onClick={handleLinkClick}
              >
                Teste
              </NavLink> */}
            </div>
            <div className="px-4 space-y-3">
              <AppButtonLogout />
              <AppButton
                variant="outline"
                className="w-full"
                size="lg"
                tabIndex={-1}
              >
                <RefreshCcw />
                <span className="text-base">Sincronizar</span>
              </AppButton>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavBar;
