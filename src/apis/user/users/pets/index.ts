import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  Pet,
  PetResponse,
  PetsResponse,
  UpdatePetRequest,
} from "./types";

export const petsApi = createApi({
  reducerPath: "petsApi",
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
  tagTypes: ['Pet'],
  endpoints: (builder) => ({
    // Get all pets for the user
    getUserPets: builder.query<PetsResponse, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "/pet",
        method: "GET",
        params,
      }),
      providesTags: ['Pet'],
    }),

    // Get a single pet by ID
    getPet: builder.query<PetResponse, string>({
      query: (petId) => ({
        url: `/pet/${petId}`,
        method: "GET",
      }),
      providesTags: (result, error, petId) => [{ type: 'Pet', id: petId }],
    }),

    // Update a pet
    updatePet: builder.mutation<PetResponse, { petId: string; petData: UpdatePetRequest }>({
      query: ({ petId, petData }) => ({
        url: `/pet/${petId}`,
        method: "PUT",
        body: petData,
      }),
      invalidatesTags: (result, error, { petId }) => [
        { type: 'Pet', id: petId },
        'Pet'
      ],
    }),
  }),
});

export const {
  useGetUserPetsQuery,
  useGetPetQuery,
  useUpdatePetMutation,
} = petsApi;
