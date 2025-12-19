import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth';
import { userApi } from './apis/user/users';
import { contactApi }from "./apis/user/users/contact"
import { petTagOrdersApi } from './apis/user/users/petTagOrders';
import { petsApi } from './apis/user/users/pets';
import { qrcodeApi } from './apis/user/qrcode';
import { loyaltyApi } from './apis/user/loyalty';
import { reviewsApi } from './apis/reviews';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [petTagOrdersApi.reducerPath]: petTagOrdersApi.reducer,
    [petsApi.reducerPath]: petsApi.reducer,
    [qrcodeApi.reducerPath]: qrcodeApi.reducer,
    [loyaltyApi.reducerPath]: loyaltyApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(contactApi.middleware)
      .concat(petTagOrdersApi.middleware)
      .concat(petsApi.middleware)
      .concat(qrcodeApi.middleware)
      .concat(loyaltyApi.middleware)
      .concat(reviewsApi.middleware)
});