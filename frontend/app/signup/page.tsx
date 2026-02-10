'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Define the structure of the signup form inputs
interface SignupFormInputs {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  re_password: string;
}

const Signup = () => {
  const router = useRouter();

  // Initialize react-hook-form for form handling and validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormInputs>();

  // Handle form submission for signup
  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      // Send signup request to backend API
      const response = await fetch('/auth/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // If signup fails, show error
      if (!response.ok) {
        throw new Error('Signup failed. Please try again.');
      }

      // Show success toast and redirect to login page
      toast.success('Signup successful! 🎉 Please login.');
      reset();
      router.push('/login');
    } catch (error: unknown) {
      // Show error toast if signup fails
      if (error instanceof Error) {
        console.log(error);
        toast.error(error?.message || 'Signup failed! Please try again.');
      } else {
        toast.error('An unknown error occurred');
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
              height={500}
              width={500}
              className='w-20 h-20'
            />
          </Link>
        </div>

        {/* Page title and subtitle */}
        <h2 className='text-2xl font-semibold text-center text-[#004aad] uppercase'>
          Create Your Account
        </h2>
        <p className='text-center text-[#004aad]/90'>Sign up to get started</p>

        {/* Signup form */}
        <form className='mt-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* First name input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='first_name' className='text-[#004aad]/90'>
              First name
            </label>
            <input
              id='first_name'
              type='text'
              {...register('first_name', {
                required: 'first_name is required',
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.first_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Enter your first_name'
            />
            {/* Show validation error if first name is missing */}
            {errors.first_name && (
              <p className='text-red-500 text-sm'>
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last name input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='last_name' className='text-[#004aad]/90'>
              Last name
            </label>
            <input
              id='last_name'
              type='text'
              {...register('last_name', { required: 'last_name is required' })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.last_name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Enter your last_name'
            />
            {/* Show validation error if last name is missing */}
            {errors.last_name && (
              <p className='text-red-500 text-sm'>{errors.last_name.message}</p>
            )}
          </div>

          {/* Email input */}
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

          {/* Password input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='password' className='text-[#004aad]/90'>
              Password
            </label>
            <input
              id='password'
              type='password'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Enter your password'
            />
            {/* Show validation error if password is missing or too short */}
            {errors.password && (
              <p className='text-red-500 text-sm'>{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password input */}
          <div className='flex flex-col space-y-1'>
            <label htmlFor='re_password' className='text-[#004aad]/90'>
              Confirm Password
            </label>
            <input
              id='re_password'
              type='password'
              {...register('re_password', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === watch('password') || 'Passwords do not match',
              })}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.re_password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#004aad]/90 focus:ring-[#004aad]'
              }`}
              placeholder='Confirm your password'
            />
            {/* Show validation error if passwords do not match */}
            {errors.re_password && (
              <p className='text-red-500 text-sm'>
                {errors.re_password.message}
              </p>
            )}
          </div>

          {/* Submit button with animation and loading state */}
          <div className='flex justify-center mt-6 pb-8'>
            <motion.button
              type='submit'
              className='px-10 py-2 text-white bg-[#004aad] border border-[#004aad] font-extrabold uppercase tracking-widest rounded-md cursor-pointer transition-colors duration-300 ease-in-out'
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              disabled={isSubmitting}
            >
              SIGN UP
            </motion.button>
          </div>
        </form>

        {/* Link to login page if user already has an account */}
        <p className='mt-4 text-center text-[#004aad]/90'>
          Already have an account?{' '}
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

export default Signup;
