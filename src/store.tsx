import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth';
import { userApi } from './apis/user/users';
import { contactApi }from "./apis/user/users/contact"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware).concat(contactApi.middleware)
});