import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loyaltyApi = createApi({
  reducerPath: "loyaltyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Loyalty'],
  endpoints: (builder) => ({
    getLoyaltyInfo: builder.query<any, void>({
      query: () => ({
        url: "/user/loyalty",
        method: "GET",
      }),
      providesTags: ['Loyalty'],
    }),
    getReferralLink: builder.query<any, void>({
      query: () => ({
        url: "/user/loyalty/referral-link",
        method: "GET",
      }),
      providesTags: ['Loyalty'],
    }),
  }),
});

export const {
  useGetLoyaltyInfoQuery,
  useGetReferralLinkQuery,
} = loyaltyApi;

