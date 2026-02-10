'use client';

// WithAuth is a higher-order component (HOC) that restricts access to a component to authenticated users only.
// If the user is not authenticated, it redirects to the login page.

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';

// Generic HOC that wraps a component and checks authentication
const WithAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function AuthComponent(props: P) {
    const router = useRouter();
    // Get user from Redux store
    const user = useSelector((state: RootState) => state.auth.user);
    // State to ensure component is mounted (avoids hydration issues)
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
      // If user is not authenticated, redirect to login page
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    // Render nothing until mounted and user is authenticated
    if (!isMounted || !user) return null;

    // Render the wrapped component with original props if authenticated
    return <WrappedComponent {...props} />;
  };
};

export default WithAuth;
