import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getSingleUser: builder.query({
      query: () => ({
        url: "/user/get-single-user",
        method: "GET",
      }),
      providesTags: ['User'],
    }),
    updateSingleUser: builder.mutation({
      query: (userData: { firstName: string; lastName: string; email: string }) => ({
        url: "/user/update-single-user",
        method: "PATCH",
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetSingleUserQuery,
  useUpdateSingleUserMutation
} = userApi;

// Export pet tag orders API
export { petTagOrdersApi } from './petTagOrders';
export {
  useCreatePetTagOrderMutation,
  useGetPetTagOrdersQuery,
  useGetPetTagOrderQuery,
  useUpdatePetTagOrderMutation,
  useConfirmPaymentMutation,
} from './petTagOrders';

// Export pets API
export { petsApi } from './pets';
export {
  useGetUserPetsQuery,
  useGetPetQuery,
  useUpdatePetMutation,
} from './pets';