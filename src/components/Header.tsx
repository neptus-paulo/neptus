import {
  Bolt,
  ChartPie,
  History,
  LayoutDashboard,
  MenuIcon,
  Waves,
} from "lucide-react";
import Image from "next/image";
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
            <Link href="/" className="flex items-center gap-2 w-full">
              <AppButton
                variant="ghost"
                className="w-full justify-start rounded-none"
              >
                <ChartPie className="w-10" />
                <span className="text-lg">Dashboard</span>
              </AppButton>
            </Link>
            <Link href="/" className="flex items-center gap-2 w-full">
              <AppButton
                variant="ghost"
                className="w-full justify-start py-6 rounded-none"
              >
                <History />
                <span className="text-lg">Histórico</span>
              </AppButton>
            </Link>
            <Link href="/" className="flex items-center gap-2 w-full">
              <AppButton
                variant="ghost"
                className="w-full justify-start py-6 rounded-none"
              >
                <Bolt />
                <span className="text-lg">Configurações</span>
              </AppButton>
            </Link>
            <Link href="/" className="flex items-center gap-2 w-full">
              <AppButton
                variant="ghost"
                className="w-full justify-start py-6 rounded-none"
              >
                <Waves />
                <span className="text-lg">Tanques</span>
              </AppButton>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};
export default Header;
