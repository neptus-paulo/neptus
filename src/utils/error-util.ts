import { ApiError } from "next/dist/server/api-utils";

export type ErrorApiType = {
  status: number;
  message: string;
  code: ErrorCode;
};

export const errorCodes = {
  INVALID_CREDENTIALS_ERROR: "InvalidCredentialsError",
  NOT_FOUND_REQUEST_ERROR: "NotFoundRequestError",
  TOKEN_EXPIRED: "TokenExpired",
  CONFLICT_REQUEST_ERROR: "ConflictRequestError",
  UNKNOWN_ERROR: "UnknownError",
  GOOGLE_LOGIN_REQUEST_ERROR: "GoogleLoginRequestError",
} as const;

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes];

export const getFriendlyMessage = (error: ApiError): string => {
  const [code, ...messageParts] = error.message.split(":");
  const message = messageParts.join(":").trim();

  const messages: Record<string, string> = {
    [errorCodes.INVALID_CREDENTIALS_ERROR]:
      "Email ou senha inválidos, tente novamente",
    [errorCodes.NOT_FOUND_REQUEST_ERROR]:
      "Usuário ainda não cadastrado, tente novamente",
    [errorCodes.TOKEN_EXPIRED]: "Sessão expirada. Faça login novamente",
    [errorCodes.CONFLICT_REQUEST_ERROR]: "Email já cadastrado, faça o login",
    [errorCodes.GOOGLE_LOGIN_REQUEST_ERROR]:
      "Usuário cadastrado via Google, use o login com Google",
    [errorCodes.UNKNOWN_ERROR]: "Ocorreu um erro inesperado",
  };

  return messages[code] || message || messages[errorCodes.UNKNOWN_ERROR];
};

export const formatAndThrowError = (
  error: unknown,
  defaultMessage = "Ocorreu um erro inesperado",
): never => {
  const apiError =
    error instanceof ApiError ? error : new ApiError(500, defaultMessage);

  console.error(`${defaultMessage}:`, apiError);

  throw new Error(
    JSON.stringify({
      status: apiError.statusCode,
      message: getFriendlyMessage(apiError) || defaultMessage,
    }),
  );
};
