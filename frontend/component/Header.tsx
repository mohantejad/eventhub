'use client';

// Header component displays the main navigation bar, logo, and user/account controls

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/authSlice';
import { toast } from 'react-toastify';
import SearchBar from './utils/SearchBar';
import { NavItems, authNavItems } from '@/data/navData';

const Header = () => {
  // State for mobile menu and client-side rendering
  const [menuOpen, setMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Redux: get user and authentication status
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Next.js router and pathname
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Only run on client (for SSR compatibility)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize authentication-related pages
  const authPages = useMemo(
    () => [
      '/login',
      '/signup',
      '/activate',
      '/forgot-password',
      '/reset-password',
    ],
    []
  );
  const isAuthPage = authPages.includes(pathname);

  // Handle logout securely
  const handleLogout = useCallback(async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
      setMenuOpen(false);
      router.push('/');
      toast.success('Logged out successfully! 👋');
    } catch (error) {
      toast.error('Logout failed! Please try again.');
    }
  }, [dispatch, router]);

  return (
    <header className='flex items-center justify-between px-14 shadow-[0_2px_2px_rgba(129,167,227,1)] py-2 bg-[#81a7e3]/10'>
      {/* Logo and Search Bar */}
      <div className='flex md:items-center justify-center flex-col md:flex-row items-start space-x-2'>
        <Link href='/' prefetch={false}>
          {/* Use priority for faster logo loading */}
          <Image
            src='/main_logo.png'
            alt='Logo'
            width={74}
            height={74}
            priority
          />
        </Link>
        {/* Hide search bar on auth pages */}
        {!isAuthPage && (
          <div>
            <SearchBar />
          </div>
        )}
      </div>

      {/* Navigation and Auth Buttons */}
      {!isAuthPage && isClient && (
        <div className='flex items-center space-x-6 uppercase text-[#004aad] -mt-12 md:mt-0'>
          {/* Main navigation items */}
          {NavItems.map((item) => (
            <Link
              key={item.text}
              href={item.link}
              className={`${item.desktopStyles} cursor-pointer`}
              onClick={() => setMenuOpen(false)}
              prefetch={false}
            >
              {item.text}
            </Link>
          ))}

          {/* Show auth navigation if not authenticated */}
          {!isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className={`${item.desktopStyles} cursor-pointer`}
                onClick={() => setMenuOpen(false)}
                prefetch={false}
              >
                {item.text}
              </Link>
            ))}

          {/* Authenticated user menu */}
          {isAuthenticated && user ? (
            <div className='relative'>
              {/* Hamburger menu icon */}
              <div
                className='cursor-pointer'
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') setMenuOpen(!menuOpen);
                }}
              >
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </div>

              {/* Dropdown menu for authenticated user */}
              {menuOpen && (
                <div className='absolute top-12 right-0 z-50 bg-white shadow-lg rounded-lg flex flex-col items-start text-[#004aad] uppercase'>
                  {NavItems.map((item) => (
                    <Link
                      key={item.text}
                      href={item.link}
                      className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
                      onClick={() => setMenuOpen(false)}
                      prefetch={false}
                    >
                      {item.text}
                    </Link>
                  ))}

                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className='text-red-500 hover:text-red-700 cursor-pointer py-2 px-8 hover:bg-[#004aad]/10 w-full flex-start flex'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Hamburger menu for unauthenticated users
            <div
              className='cursor-pointer text-[#004aad]'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') setMenuOpen(!menuOpen);
              }}
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </div>
          )}
        </div>
      )}

      {/* Mobile menu for unauthenticated users */}
      {menuOpen && isClient && !isAuthPage && !user ? (
        <div className='absolute top-18 right-2 z-50 bg-white shadow-lg rounded-lg flex flex-col items-center text-[#004aad] uppercase '>
          {NavItems.map((item) => (
            <Link
              key={item.text}
              href={item.link}
              className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
              onClick={() => setMenuOpen(false)}
              prefetch={false}
            >
              {item.text}
            </Link>
          ))}

          {!isAuthenticated &&
            authNavItems.map((item) => (
              <Link
                key={item.text}
                href={item.link}
                className={`${item.mobileStyles} cursor-pointer py-2 px-8 whitespace-nowrap w-full hover:bg-[#004aad]/10`}
                onClick={() => setMenuOpen(false)}
                prefetch={false}
              >
                {item.text}
              </Link>
            ))}
        </div>
      ) : null}
    </header>
  );
};

export default Header;
