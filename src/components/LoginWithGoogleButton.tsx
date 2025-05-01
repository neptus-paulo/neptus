"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

import AppButton from "./AppButton";

const LoginWithGoogleButton = (
  props: React.ComponentProps<typeof AppButton>,
) => {
  const handleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <AppButton {...props} onClick={handleLogin}>
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo-google.png"
          alt="logo-google"
          width={30}
          height={30}
        />
        {props.children}
      </div>
    </AppButton>
  );
};
export default LoginWithGoogleButton;
