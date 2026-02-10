// /app/checkout/page.tsx
import CheckoutClient from '@/component/CheckoutClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
