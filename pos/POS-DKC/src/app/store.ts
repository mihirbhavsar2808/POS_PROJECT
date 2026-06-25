import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../auth/authSlice"
import orderReducer from "../auth/orderSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = (dispatch: AppDispatch, getState: () => RootState) => void;