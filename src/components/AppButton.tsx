"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AppButton = (props: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      {...props}
      className={cn("rounded-md cursor-pointer", props.className)}
    />
  );
};

export default AppButton;
