import axios from "axios";
import { ApiError } from "next/dist/server/api-utils";

const api = axios.create({
  baseURL: "https://neptus.publicvm.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data || {
        code: "api_error",
        message: "Erro desconhecido na API",
        status: 500,
      };

      return Promise.reject(
        new ApiError(
          apiError.status || error.response?.status,
          `${apiError.code}: ${apiError.message}`,
        ),
      );
    }

    return Promise.reject(new ApiError(500, "UnknownError: Erro desconhecido"));
  },
);

export default api;
