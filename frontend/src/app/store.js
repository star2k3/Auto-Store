import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice.js';
import authReducer from '../features/auth/authSlice.js';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer
  }
});
