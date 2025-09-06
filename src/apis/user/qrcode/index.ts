import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qrcodeApi = createApi({
  reducerPath: "qrcodeApi",
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
  tagTypes: ['QRCode', 'Subscription'],
  endpoints: (builder) => ({
    // Get QR verification details (public endpoint)
    getQRVerificationDetails: builder.query<any, string>({
      query: (code) => ({
        url: `/qr/verify-details/${code}`,
        method: "GET",
      }),
    }),

    // Verify QR code with subscription (authenticated)
    verifyQRWithSubscription: builder.mutation<any, {
      qrCodeId: string;
      subscriptionType: 'monthly' | 'yearly';
      petId?: string;
    }>({
      query: (data) => ({
        url: "/qr/verify-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['QRCode', 'Subscription'],
    }),

    // Confirm subscription payment
    confirmSubscriptionPayment: builder.mutation<any, {
      qrCodeId: string;
      paymentIntentId: string;
      subscriptionType: 'monthly' | 'yearly';
      petId?: string;
    }>({
      query: (data) => ({
        url: "/qr/confirm-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['QRCode', 'Subscription'],
    }),

    // Get user's subscriptions
    getUserSubscriptions: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/user/subscriptions",
        method: "GET",
        params,
      }),
      providesTags: ['Subscription'],
    }),

    // Get subscription by QR code
    getSubscriptionByQR: builder.query<any, string>({
      query: (qrCodeId) => ({
        url: `/user/subscription/qr/${qrCodeId}`,
        method: "GET",
      }),
      providesTags: (result, error, qrCodeId) => [{ type: 'Subscription', id: qrCodeId }],
    }),
  }),
});

export const {
  useGetQRVerificationDetailsQuery,
  useVerifyQRWithSubscriptionMutation,
  useConfirmSubscriptionPaymentMutation,
  useGetUserSubscriptionsQuery,
  useGetSubscriptionByQRQuery,
} = qrcodeApi;

