"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

import LoadingSpinner from "@/components/LoadingSpinner";
import { loginWithGoogle } from "@/services/auth-service";
import useUserStore from "@/stores/user-store";

const CallbackPage = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleAuth = async () => {
      if (status !== "authenticated" || !session?.id_token) {
        console.log("Sessão não autenticada ou sem ID token");
        router.push("/login");
        return;
      }

      try {
        const userData = await loginWithGoogle(session.id_token);
        if (userData?.access_token) {
          secureLocalStorage.setItem("access_token", userData.access_token);
          secureLocalStorage.setItem("refresh_token", userData.refresh_token);

          setUser(userData);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        router.push("/login");
      }
    };

    if (status !== "loading") {
      handleAuth();
    }
  }, [session, router, setUser, status]);

  return (
    <div className="w-full h-screen">
      <LoadingSpinner />
    </div>
  );
};

export default CallbackPage;
