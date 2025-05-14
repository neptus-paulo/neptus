import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useLoginWithGoogle = () =>
  useMutation({
    mutationKey: ["loginWithGoogle"],
    mutationFn: async () => {
      await signIn("google", { callbackUrl: "/" });
    },
  });
