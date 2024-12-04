export const getApiUrl = (): string => {
  const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;
  return API_URL ?? "";
};

export const APPLICATION_VERSION_INFO_URL =
  "https://0i33jtc7f4.execute-api.us-east-2.amazonaws.com";
