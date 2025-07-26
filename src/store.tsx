import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './apis/auth';
import { userApi } from './apis/user/users';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(userApi.middleware)
});