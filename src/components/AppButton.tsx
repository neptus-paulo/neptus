"use client";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AppButton = ({
  isLoading,
  ...props
}: React.ComponentProps<typeof Button> & { isLoading?: boolean }) => {
  return (
    <Button
      {...props}
      disabled={isLoading || props.disabled}
      className={cn("rounded-md cursor-pointer", props.className)}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {props.children}
    </Button>
  );
};

export default AppButton;
