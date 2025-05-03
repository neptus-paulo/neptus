import axios from "@/lib/axios";
import { User } from "@/types/user-type";

type LoginResponse = User;

export const loginWithGoogle = async (
  id_token: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await axios.post("/login/google", {
      token_google: id_token,
    });
    return data;
  } catch (error) {
    console.error("Erro no login com Google:", error);
    throw error;
  }
};
