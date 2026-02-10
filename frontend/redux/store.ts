import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginSuccess } from './authSlice';

// Configure the Redux store with the authentication reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Async function to fetch the current user using the access token
// If successful, updates the Redux store with the user data
export const fetchUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  try {
    const response = await fetch('/auth/users/me/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${accessToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      // Dispatch loginSuccess to update user in Redux store
      store.dispatch(loginSuccess({ user: userData }));
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

// Types for Redux state and dispatch, for use with hooks and TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
