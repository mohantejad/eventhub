import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the authentication state
interface AuthState {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture?: string;
  } | null;
  isAuthenticated: boolean;
}

// Retrieve user from localStorage if available (for client-side hydration)
const storedUser =
  typeof window !== 'undefined' ? localStorage.getItem('user') : null;

// Initial state for authentication
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: storedUser ? true : false,
};

// Create the auth slice with reducers for login and logout
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Handle successful login: set user and authentication state, store in localStorage
    loginSuccess: (state, action: PayloadAction<{ user: any }>) => {
      state.user = {
        id: action.payload.user.id,
        first_name: action.payload.user.first_name,
        last_name: action.payload.user.last_name,
        email: action.payload.user.email,
        profile_picture: action.payload.user.profile_picture || '',
      };
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    // Handle logout: clear user and authentication state, remove from localStorage
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

// Export actions and reducer for use in the Redux store
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
