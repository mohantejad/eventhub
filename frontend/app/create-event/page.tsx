'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useState } from 'react';
import WithAuth from '@/component/utils/WithAuth';

// Define the structure of the event form inputs
interface EventFormInputs {
  title: string;
  description: string;
  city: string;
  category: string;
  mode: string;
  date: string;
  image: FileList;
  price: number;
}

// List of available cities for event location
const cities = [
  'Sydney',
  'Melbourne',
  'Brisbane',
  'Adelaide',
  'Perth',
  'Hobart',
  'Darwin',
  'Canberra',
];

// List of event categories
const categories = [
  'Music',
  'Nightlife',
  'Performing & Visual Arts',
  'Holidays',
  'Dating',
  'Hobbies',
  'Business',
  'Food & Drink',
];

// List of event modes
const event_mode = ['Online', 'Onsite', 'Hybrid'];

// Main Create Event page component
const CreateEventPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form for form handling and validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EventFormInputs>();

  // Handle form submission
  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('city', data.city);
    formData.append('event_category', data.category);
    formData.append('event_mode', data.mode);
    formData.append('price', data.price.toString());
    formData.append('date', data.date);
    if (data.image[0]) formData.append('image', data.image[0]);

    try {
      // Get JWT token from localStorage for authentication
      const token = localStorage.getItem('accessToken');

      if (!token) {
        toast.error('No access token found. Please log in.');
        return;
      }

      // Send POST request to backend to create the event
      const response = await fetch('/api/event/events/', {
        method: 'POST',
        headers: token ? { Authorization: `JWT ${token}` } : {},
        body: formData,
      });

      // Handle error response from backend
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.detail || 'Failed to create event');
      }

      // Show success message and redirect to user profile
      toast.success('Event created successfully!');
      reset();
      router.push('/user-profile');
    } catch (error: unknown) {
      // Show error message if event creation fails
      if (error instanceof Error) {
        toast.error(error.message || 'Event creation failed');
      } else {
        toast.error('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex items-center justify-center py-16'>
      <div className='bg-white border border-[#81a7e3] rounded-lg p-8 w-full max-w-md'>
        {/* Page title */}
        <h2 className='text-2xl font-semibold text-center text-[#004aad] uppercase'>
          Create Event
        </h2>

        {/* Event creation form */}
        <form className='mt-6 space-y-4' onSubmit={handleSubmit(onSubmit)}>
          {/* Event Title */}
          <input
            type='text'
            placeholder='Event Title'
            {...register('title', { required: 'Title is required' })}
            className='w-full px-4 py-2 border rounded-md'
          />
          {errors.title && (
            <p className='text-red-500 text-sm'>{errors.title.message}</p>
          )}

          {/* Event Description */}
          <textarea
            placeholder='Description'
            {...register('description', {
              required: 'Description is required',
            })}
            className='w-full px-4 py-2 border rounded-md'
          ></textarea>
          {errors.description && (
            <p className='text-red-500 text-sm'>{errors.description.message}</p>
          )}

          {/* City Selection */}
          <select
            {...register('city', { required: 'City is required' })}
            className='w-full px-4 py-2 border rounded-md'
          >
            <option value=''>Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className='text-red-500 text-sm'>{errors.city.message}</p>
          )}

          {/* Category Selection */}
          <select
            {...register('category', { required: 'Category is required' })}
            className='w-full px-4 py-2 border rounded-md'
          >
            <option value=''>Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className='text-red-500 text-sm'>{errors.category.message}</p>
          )}

          {/* Event Mode Selection */}
          <select
            {...register('mode', { required: 'Event Mode is required' })}
            className='w-full px-4 py-2 border rounded-md'
          >
            <option value=''>Event Mode</option>
            {event_mode.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className='text-red-500 text-sm'>{errors.city.message}</p>
          )}

          {/* Date and Time Picker */}
          <input
            type='datetime-local'
            {...register('date', { required: 'Date is required' })}
            className='w-full px-4 py-2 border rounded-md'
          />
          {errors.date && (
            <p className='text-red-500 text-sm'>{errors.date.message}</p>
          )}

          {/* Price Input */}
          <input
            type='number'
            placeholder='Price'
            {...register('price', {
              required: 'Price is required',
              valueAsNumber: true,
            })}
            className='w-full px-4 py-2 border rounded-md'
          />
          {errors.price && (
            <p className='text-red-500 text-sm'>{errors.price.message}</p>
          )}

          {/* Image Upload */}
          <input
            type='file'
            {...register('image')}
            className='w-full px-4 py-2 border rounded-md'
          />

          {/* Form Actions: Submit and Cancel */}
          <div className='flex justify-between'>
            <motion.button
              type='submit'
              className='px-6 py-2 text-white bg-[#004aad] rounded-md'
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Create Event'}
            </motion.button>

            <Link
              href='/profile'
              className='px-6 py-2 bg-gray-500 text-white rounded-md'
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrap the page with authentication HOC to restrict access
export default WithAuth(CreateEventPage);
