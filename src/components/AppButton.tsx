"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppButtonProps extends React.ComponentProps<typeof Button> {
  isLoading?: boolean;
}

const AppButton = ({
  isLoading,
  className,
  variant,
  ...props
}: AppButtonProps) => {
  const variantModifications = {
    default: "",
    destructive: "",
    outline:
      "shadow-none border-foreground/15 focus:border-foreground/30 bg-transparent",
    secondary: "",
    ghost: "",
    link: "",
  };

  return (
    <Button
      {...props}
      variant={variant}
      disabled={isLoading || props.disabled}
      className={cn(
        "cursor-pointer transition-all duration-200",
        variant && variantModifications[variant],
        className
      )}
    >
      {isLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
      {props.children}
    </Button>
  );
};

export const AppButtonLogout = () => {
  return (
    <AppButton
      variant="outline"
      className="w-full border-destructive text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:border-destructive"
      size="lg"
      tabIndex={-1}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut />
      <span className="text-base">Sair da conta</span>
    </AppButton>
  );
};

export default AppButton;
