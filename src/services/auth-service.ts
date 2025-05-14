import { ApiError } from "next/dist/server/api-utils";

import api from "@/lib/axios";
import { LoginResponse, RegisterResponse } from "@/types/user-type";
import { formatAndThrowError } from "@/utils/error-util";

export const loginWithGoogle = async (
  id_token: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/auth/login/google", {
      token_google: id_token,
    });
    return data;
  } catch (error) {
    throw formatAndThrowError(
      error,
      "Erro ao fazer login com Google, tente novamente",
    );
  }
};

export const login = async (loginData: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/auth/login", {
      email: loginData.email,
      senha: loginData.password,
    });
    return data;
  } catch (error) {
    throw formatAndThrowError(error, "Erro ao fazer login, tente novamente");
  }
};

export const register = async (registerData: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const { data } = await api.post("/auth/register", {
      email: registerData.email,
      nome: registerData.name,
      senha: registerData.password,
    });

    return data;
  } catch (error) {
    throw formatAndThrowError(
      error,
      "Erro ao registrar usuário, tente novamente",
    );
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post("/auth/forgot-password", {
      email,
    });
  } catch (error) {
    throw formatAndThrowError(
      error,
      "Erro ao recuperar senha, tente novamente",
    );
  }
};

export const resetPassword = async (
  password: string,
  token: string,
): Promise<void> => {
  try {
    await api.post("/auth/reset-password", {
      senha: password,
      token,
    });
  } catch (error) {
    throw formatAndThrowError(
      error,
      "Erro ao redefinir senha, tente novamente",
    );
  }
};
