import { Bolt, ChartPie, History, MenuIcon, Waves } from "lucide-react";
import Link from "next/link";

import AppButton from "./AppButton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const Header = () => {
  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <AppButton variant="outline" size="icon">
            <MenuIcon className="h-6 w-6" />
          </AppButton>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px]" aria-describedby="menu">
          <SheetHeader>
            <SheetTitle className="py-4 text-xl">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 w-full hover:bg-accent py-2 px-4"
            >
              <ChartPie />
              <span className="text-lg">Dashboard</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 w-full hover:bg-accent py-2 px-4"
            >
              <History />
              <span className="text-lg">Histórico</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 w-full hover:bg-accent py-2 px-4"
            >
              <Bolt />
              <span className="text-lg">Configurações</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 w-full hover:bg-accent py-2 px-4"
            >
              <Waves />
              <span className="text-lg">Tanques</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
export default Header;
