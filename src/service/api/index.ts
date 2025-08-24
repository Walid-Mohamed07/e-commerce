import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "cookies-next";
import { BASE_URL, FETCH_TIMEOUT } from "@/constants/api";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = getCookie("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (csrfToken) {
        headers.set("X-CSRF-TOKEN", csrfToken);
      }
      headers.set("Cookie", `token=${token}; csrfToken=${csrfToken}`);
      return headers;
    },
  }),
  tagTypes: ["user", "product", "products", "category", "categories"],
  endpoints: () => ({}),
});
