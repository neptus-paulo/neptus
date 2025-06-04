import {
  Bolt,
  ChartPie,
  History,
  MenuIcon,
  RefreshCcw,
  Waves,
} from "lucide-react";

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
  return (
    <nav>
      <Sheet>
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
              <NavLink href="/" icon={<ChartPie />}>
                Dashboard
              </NavLink>
              <NavLink href="/historico" icon={<History />}>
                Histórico
              </NavLink>
              <NavLink href="/configuracoes" icon={<Bolt />}>
                Configurações
              </NavLink>
              <NavLink href="/tanques" icon={<Waves />}>
                Tanques
              </NavLink>
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
