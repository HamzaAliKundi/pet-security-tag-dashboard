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

    // Auto-verify QR code if user has active subscription
    autoVerifyQRCode: builder.mutation<any, {
      qrCodeId: string;
    }>({
      query: (data) => ({
        url: "/qr/auto-verify",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['QRCode', 'Subscription'],
    }),

    // Verify QR code with subscription (authenticated)
    verifyQRWithSubscription: builder.mutation<any, {
      qrCodeId: string;
      subscriptionType: 'monthly' | 'yearly' | 'lifetime';
      petId?: string;
    }>({
      query: (data) => ({
        url: "/qr/verify-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['QRCode', 'Subscription'],
    }),

    // Confirm QR subscription payment
    confirmQRSubscriptionPayment: builder.mutation<any, {
      qrCodeId: string;
      paymentIntentId: string;
      subscriptionType: 'monthly' | 'yearly' | 'lifetime';
      petId?: string;
      stripeSubscriptionId?: string;
    }>({
      query: (data) => ({
        url: "/qr/confirm-subscription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['QRCode', 'Subscription'],
    }),

    // Get user's subscriptions
    getUserSubscriptions: builder.query<any, { page?: number; limit?: number; includeAll?: string }>({
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

    // Get subscription statistics
    getSubscriptionStats: builder.query<any, void>({
      query: () => ({
        url: "/user/subscriptions/stats",
        method: "GET",
      }),
      providesTags: ['Subscription'],
    }),

    // Renew subscription
    renewSubscription: builder.mutation<any, { subscriptionId: string }>({
      query: (data) => ({
        url: "/user/subscriptions/renew",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Upgrade subscription
    upgradeSubscription: builder.mutation<any, { subscriptionId: string; newType: string }>({
      query: (data) => ({
        url: "/user/subscriptions/upgrade",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    // Confirm subscription payment
    confirmSubscriptionPayment: builder.mutation<any, { 
      subscriptionId: string; 
      paymentIntentId: string; 
      action: string; 
      newType?: string; 
      amount: number;
      paymentMethodId?: string;
    }>({
      query: (data) => ({
        url: "/user/subscriptions/confirm-payment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetQRVerificationDetailsQuery,
  useAutoVerifyQRCodeMutation,
  useVerifyQRWithSubscriptionMutation,
  useConfirmQRSubscriptionPaymentMutation,
  useGetUserSubscriptionsQuery,
  useGetSubscriptionByQRQuery,
  useGetSubscriptionStatsQuery,
  useRenewSubscriptionMutation,
  useUpgradeSubscriptionMutation,
  useConfirmSubscriptionPaymentMutation,
} = qrcodeApi;

