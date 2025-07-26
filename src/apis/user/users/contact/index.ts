import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (contactData) => ({
        url: "/user/contact",
        method: "POST",
        body: contactData,
      }),
    }),
  }),
});

export const {
  useSubmitContactMutation,
} = contactApi; 