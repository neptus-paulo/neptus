"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useState } from "react";

import AppButton from "./AppButton";

const LoginWithGoogleButton = (
  props: React.ComponentProps<typeof AppButton>,
) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setIsGoogleLoading(false);
  };

  return (
    <AppButton {...props} onClick={handleLogin} disabled={isGoogleLoading}>
      <div className="flex items-center gap-2">
        {isGoogleLoading ? (
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
