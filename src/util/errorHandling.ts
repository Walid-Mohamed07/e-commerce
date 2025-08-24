import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const handleError = (
  response: FetchBaseQueryError,
  fallBackError: string,
) => {
  const data = response.data as Error;
  if (response.status) {
    if (data && data.message) {
      return data.message;
    }
    return fallBackError;
  }
  return "An unexpected error occurred";
};
