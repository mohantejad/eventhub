'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define the structure of the reset password form inputs
interface ResetPasswordInputs {
  new_password: string;
  re_new_password: string;
}

const ResetPasswordConfirmPage = () => {
  // Get uid and token from URL params
  const { uid, token } = useParams();
  const router = useRouter();

  // Initialize react-hook-form for form handling and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInputs>();

  // Handle form submission for password reset confirmation
  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    try {
      // Send POST request to backend to confirm password reset
      const response = await fetch(
        '/auth/users/reset_password_confirm/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid,
            token,
            new_password: data.new_password,
            re_new_password: data.re_new_password,
          }),
        }
      );

      // If response is not OK, show error
      if (!response.ok) {
        throw new Error('Password reset failed. Try again.');
      }

      // Show success toast and redirect to login page
      toast.success('Password reset successful! 🎉');
      router.push('/login');
    } catch (error: unknown) {
      // Show error toast if something goes wrong
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong. Try again.');
      }
    }
  };

  return (
    <div className='flex items-center justify-center py-16'>
      <div className='bg-white border border-[#81a7e3] rounded-lg p-8 w-full max-w-md'>
        {/* Logo at the top */}
        <div className='flex justify-center'>
          <Link href='/'>
            <Image
              src='/main_logo.png'
              alt='Sai Events'
              width={100}
              height={100}
              className='w-20 h-20'
            />
          </Link>
        </div>

        {/* Page title and instructions */}
        <h2 className='text-2xl font-semibold text-center text-[#004aad] uppercase'>
          Reset Password
        </h2>
        <p className='text-center text-[#004aad]/90'>
          Enter your new password below
        </p>

        {/* Password reset form */}
        <form className='mt-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* New password input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='new_password' className='text-[#004aad]/90'>
              New Password
            </label>
            <input
              id='new_password'
              type='password'
              {...register('new_password', {
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.new_password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Enter new password'
            />
            {/* Show validation error if new password is missing or too short */}
            {errors.new_password && (
              <p className='text-red-500 text-sm'>
                {errors.new_password.message}
              </p>
            )}
          </div>

          {/* Confirm new password input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='re_new_password' className='text-[#004aad]/90'>
              Confirm Password
            </label>
            <input
              id='re_new_password'
              type='password'
              {...register('re_new_password', {
                required: 'Please confirm your new password',
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.re_new_password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Confirm new password'
            />
            {/* Show validation error if confirmation is missing */}
            {errors.re_new_password && (
              <p className='text-red-500 text-sm'>
                {errors.re_new_password.message}
              </p>
            )}
          </div>

          {/* Submit button with animation and loading state */}
          <div className='flex justify-center mt-6 pb-8'>
            <motion.button
              type='submit'
              className='px-8 py-2 text-white bg-[#004aad] border border-[#004aad] font-extrabold uppercase tracking-widest rounded-md cursor-pointer transition-colors duration-300 ease-in-out'
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              disabled={isSubmitting}
            >
              Reset Password
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmPage;
