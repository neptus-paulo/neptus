import { ApiError } from "next/dist/server/api-utils";

import api from "@/lib/axios";
import { LoginResponse, RegisterResponse } from "@/types/user-type";
import { formatAndThrowError } from "@/utils/error-util";

export const loginWithGoogle = async (
  id_token: string,
): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/login/google", {
      token_google: id_token,
    });
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new ApiError(error.statusCode, error.message);
    }
    throw error;
  }
};

export const login = async (loginData: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const { data } = await api.post("/login", {
      email: loginData.email,
      senha: loginData.password,
    });
    return data;
  } catch (error) {
    throw formatAndThrowError(error, "Erro ao fazer login");
  }
};

export const register = async (registerData: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const { data } = await api.post("/register", {
      email: registerData.email,
      nome: registerData.name,
      senha: registerData.password,
    });

    return data;
  } catch (error) {
    throw formatAndThrowError(error, "Erro ao registrar usuário");
  }
};
