import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth';
import { userApi } from './apis/user/users';
import { contactApi }from "./apis/user/users/contact"
import { petTagOrdersApi } from './apis/user/users/petTagOrders';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [petTagOrdersApi.reducerPath]: petTagOrdersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(contactApi.middleware)
      .concat(petTagOrdersApi.middleware)
});