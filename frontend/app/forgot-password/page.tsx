'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

// Define the structure of the form input
interface ForgotPasswordInputs {
  email: string;
}

const ForgotPassword = () => {
  // Initialize react-hook-form for form handling and validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordInputs>();

  // Handle form submission for password reset
  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    try {
      // Send POST request to backend to trigger password reset email
      const response = await fetch(
        '/auth/users/reset_password/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      // If response is not OK, throw error
      if (!response.ok) {
        throw new Error('Failed to send reset link. Please try again.');
      }

      // Show success toast and reset form
      toast.success('Password reset email sent! 📩');
      reset();
    } catch (error: unknown) {
      // Show error toast if something goes wrong
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong. Please try again.');
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
          Forgot Password?
        </h2>
        <p className='text-center text-[#004aad]/90'>
          Enter your email to receive a reset link
        </p>

        {/* Password reset form */}
        <form className='mt-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col space-y-1'>
            <label htmlFor='email' className='text-[#004aad]/90'>
              Email
            </label>
            <input
              id='email'
              type='email'
              {...register('email', { required: 'Email is required' })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Enter your email'
            />
            {/* Show validation error if email is missing */}
            {errors.email && (
              <p className='text-red-500 text-sm'>{errors.email.message}</p>
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
              Send Reset Link
            </motion.button>
          </div>
        </form>

        {/* Link to login page if user remembers password */}
        <p className='mt-4 text-center text-[#004aad]/90'>
          Remembered your password?{' '}
          <Link href='/login'>
            <span className='text-[#004aad] font-semibold hover:underline cursor-pointer uppercase'>
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
