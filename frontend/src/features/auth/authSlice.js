import { createSlice } from '@reduxjs/toolkit';
import { AUTH_TOKEN_KEY, setAuthToken } from '../../api.js';

const USER_KEY = 'auto-store-user';
const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
const storedUser = localStorage.getItem(USER_KEY);

if (storedToken) {
  setAuthToken(storedToken);
}

const initialState = {
  token: storedToken || '',
  user: storedUser ? JSON.parse(storedUser) : null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      setAuthToken(action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    clearAuth(state) {
      state.token = '';
      state.user = null;
      setAuthToken('');
      localStorage.removeItem(USER_KEY);
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    }
  }
});

export const { setCredentials, clearAuth, updateProfile } = authSlice.actions;
export default authSlice.reducer;
