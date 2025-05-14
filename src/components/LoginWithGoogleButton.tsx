"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";

import { useLoginWithGoogle } from "@/hooks/useLoginWithGoogle";

import AppButton from "./AppButton";

const LoginWithGoogleButton = (
  props: React.ComponentProps<typeof AppButton>,
) => {
  const { mutate: loginWithGoogle, isPending } = useLoginWithGoogle();

  const handleLogin = () => loginWithGoogle();

  return (
    <AppButton {...props} onClick={handleLogin} disabled={isPending}>
      <div className="flex items-center gap-2">
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Image
            src="/images/logo-google.png"
            alt="logo-google"
            width={30}
            height={30}
          />
        )}

        {props.children}
      </div>
    </AppButton>
  );
};
export default LoginWithGoogleButton;
