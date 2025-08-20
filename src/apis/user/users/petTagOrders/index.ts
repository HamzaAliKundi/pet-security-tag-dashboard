import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PetTagOrderRequest,
  PetTagOrderResponse,
  PetTagOrdersResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from "./types";

export const petTagOrdersApi = createApi({
  reducerPath: "petTagOrdersApi",
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
  tagTypes: ['PetTagOrder'],
  endpoints: (builder) => ({
    // Create a new pet tag order
    createPetTagOrder: builder.mutation<PetTagOrderResponse, PetTagOrderRequest>({
      query: (orderData) => ({
        url: "/user/user-pet-tag-orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ['PetTagOrder'],
    }),

    // Get all pet tag orders for the user
    getPetTagOrders: builder.query<PetTagOrdersResponse, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: "/user/user-pet-tag-orders",
        method: "GET",
        params,
      }),
      providesTags: ['PetTagOrder'],
    }),

    // Get a single pet tag order by ID
    getPetTagOrder: builder.query<{ message: string; status: number; order: any }, string>({
      query: (orderId) => ({
        url: `/user/user-pet-tag-orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, orderId) => [{ type: 'PetTagOrder', id: orderId }],
    }),

    // Update a pet tag order
    updatePetTagOrder: builder.mutation<{ message: string; status: number; order: any }, { orderId: string; orderData: PetTagOrderRequest }>({
      query: ({ orderId, orderData }) => ({
        url: `/user/user-pet-tag-orders/${orderId}`,
        method: "PUT",
        body: orderData,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'PetTagOrder', id: orderId },
        'PetTagOrder'
      ],
    }),

    // Confirm payment for an order
    confirmPayment: builder.mutation<ConfirmPaymentResponse, { orderId: string; paymentData: ConfirmPaymentRequest }>({
      query: ({ orderId, paymentData }) => ({
        url: `/user/user-pet-tag-orders/${orderId}/confirm-payment`,
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'PetTagOrder', id: orderId },
        'PetTagOrder'
      ],
    }),
  }),
});

export const {
  useCreatePetTagOrderMutation,
  useGetPetTagOrdersQuery,
  useGetPetTagOrderQuery,
  useUpdatePetTagOrderMutation,
  useConfirmPaymentMutation,
} = petTagOrdersApi;
