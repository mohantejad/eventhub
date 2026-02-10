import type { Metadata } from 'next';
import './globals.css';

import ClientProvider from '@/component/ClientProvider';
import ClientHeader from '@/component/ClientHeader';
import Footer from '@/component/Footer';
import Head from 'next/head';
import TopLoader from '@/component/utils/TopLoader';

// Define site-wide metadata for SEO and browser tab info
export const metadata: Metadata = {
  title: 'Events Hub',
  description: 'A Personal Project for IT project subject',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Set language and HTML structure
    <html lang='en'>
      {/* Add favicon using next/head for browser tab icon */}
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* Main body with flex layout for sticky footer */}
      <body className='flex flex-col min-h-screen'>
        <TopLoader />
        {/* Provide Redux/Context and other client-side providers */}
        <ClientProvider>
          {/* Site header/navigation */}
          <ClientHeader />
          {/* Main content area, grows to fill available space */}
          <main className='flex-grow'>{children}</main>
          {/* Site footer */}
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
