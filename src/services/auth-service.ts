import { ApiError } from "next/dist/server/api-utils";

import api from "@/lib/axios";
import { LoginResponse } from "@/types/user-type";

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
    if (error instanceof ApiError) {
      throw new ApiError(error.statusCode, error.message);
    }
    throw error;
  }
};
