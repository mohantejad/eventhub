'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ActivateAccountPage() {
  // Extract uid and token from URL params
  const { uid, token } = useParams<{ uid: string; token: string }>();
  // Track activation status: loading, success, or error
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  // Store error message if activation fails
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Function to call backend API for account activation
    const activateAccount = async () => {
      try {
        const res = await fetch('/auth/users/activation/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid, token }),
        });

        if (res.ok) {
          // Activation successful
          setStatus('success');
        } else {
          // Activation failed, show error message from API
          const data = await res.json();
          setErrorMsg(data?.detail || 'Activation failed.');
          setStatus('error');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMsg(error.message || 'Something went wrong.');
        } else {
          setErrorMsg('Something went wrong.');
        }
        setStatus('error');
      }
    };

    // Only attempt activation if both uid and token are present
    if (uid && token) activateAccount();
  }, [uid, token]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {/* Show loading message while activating */}
      {status === 'loading' && (
        <p className='text-lg'>Activating your account...</p>
      )}
      {/* Show success message if activation succeeded */}
      {status === 'success' && (
        <div className='text-green-600 text-xl font-semibold'>
          ✅ Account activated successfully!
        </div>
      )}
      {/* Show error message if activation failed */}
      {status === 'error' && (
        <div className='text-red-600'>
          ❌ Account activation failed: {errorMsg}
        </div>
      )}
    </div>
  );
}
