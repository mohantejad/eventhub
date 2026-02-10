'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ClientProvider wraps the app with Redux store and Toast notifications
export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Provide Redux store to all child components
    <Provider store={store}>
      {/* Render children components */}
      {children}
      {/* ToastContainer for global notifications */}
      <ToastContainer
        position='top-right'
        autoClose={3000}
        theme='colored'
      />
    </Provider>
  );
}