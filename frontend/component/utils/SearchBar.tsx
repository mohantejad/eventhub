'use client';

// SearchBar component allows users to search for events by name and city, with city autocomplete and geolocation

import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaLocationArrow } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';

// List of available cities for autocomplete
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

// Type for form values
type FormValues = {
  eventSearch: string;
  location: string;
};

const SearchBar = () => {
  const router = useRouter();
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: {},
  } = useForm<FormValues>({
    defaultValues: {
      eventSearch: '',
      location: '',
    },
  });

  // State for dropdown, filtered cities, and loading geolocation
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Get city name from latitude and longitude using OpenStreetMap API
  const getCityFromCoordinates = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data.address && data.address.state_district) {
        setValue('location', data.address.state_district);
      } else {
        alert('Could not detect city. Please enter manually.');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Failed to fetch location. Please enter manually.');
    } finally {
      setLoadingLocation(false);
    }
  };

  // Detect user's current location using browser geolocation
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getCityFromCoordinates(latitude, longitude);
      },
      () => {
        alert('Unable to retrieve your location. Please enter manually.');
        setLoadingLocation(false);
      }
    );
  };

  // Handle city input for autocomplete dropdown
  const handleCityInput = (value: string) => {
    setValue('location', value);
    if (value) {
      setFilteredCities(
        cities.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  };

  // Handle city selection from dropdown
  const handleCitySelect = (city: string) => {
    setValue('location', city);
    setFilteredCities([]);
  };

  // Handle form submission: validate and redirect to search results
  const onSubmit = (data: { eventSearch: string; location: string }) => {
    if (!data.eventSearch && !data.location) {
      setError('eventSearch', {
        type: 'manual',
        message: 'enter event or city',
      });
      setError('location', {
        type: 'manual',
        message: 'enter event or city',
      });
      return;
    }

    router.push(
      `/all-events?search=${encodeURIComponent(
        data.eventSearch
      )}&city=${encodeURIComponent(data.location)}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex items-center bg-[#004aad]/2 p-2 rounded-full border border-[#004aad] w-full md:max-w-md lg:max-w-lg'
    >
      {/* Event search input */}
      <div className='flex items-center pl-4 pr-8 w-full border-r border-[#004aad]'>
        <FaSearch className='text-[#004aad]/80 mr-2' />
        <Controller
          name='eventSearch'
          control={control}
          render={({ field, fieldState }) => (
            <div className='w-full'>
              <input
                {...field}
                type='text'
                placeholder='Search events'
                className='bg-transparent outline-none w-full text-[#004aad]/90'
              />
              {/* Show validation error for event search */}
              {fieldState.error && (
                <p className='text-red-500 text-sm'>
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      {/* City/location input with autocomplete and geolocation */}
      <div className='relative flex items-center px-4 w-full'>
        <FaMapMarkerAlt className='text-[#004aad]/80 mr-2' />
        <Controller
          name='location'
          control={control}
          render={({ field, fieldState }) => (
            <div className='w-full'>
              <input
                {...field}
                type='text'
                placeholder='Search city'
                className='bg-transparent outline-none w-full text-[#004aad]/90'
                onChange={(e) => handleCityInput(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                autoComplete='off'
              />
              {/* Show validation error for city */}
              {fieldState.error && (
                <p className='text-red-500 text-sm'>
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        {/* Dropdown for city autocomplete and geolocation */}
        {showDropdown && (
          <ul className='absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 h-fit max-h-56 overflow-y-scroll'>
            {/* Option to detect current location */}
            {filteredCities.length === 0 && (
              <li
                className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center'
                onClick={detectCurrentLocation}
              >
                <FaLocationArrow className='mr-2 text-[#004aad]' />
                {loadingLocation ? 'Detecting...' : 'Use Current Location'}
              </li>
            )}

            {/* Show all cities if input is empty */}
            {filteredCities.length === 0 &&
              watch('location') === '' &&
              cities.map((city, index) => (
                <li
                  key={index}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </li>
              ))}

            {/* Show filtered cities */}
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <li
                  key={index}
                  className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => handleCitySelect(city)}
                >
                  {city}
                </li>
              ))
            ) : (
              <li className='px-4 py-2 text-gray-500'>No more cities</li>
            )}
          </ul>
        )}
      </div>

      {/* Submit button */}
      <button className='bg-[#004aad]/90 text-white p-2 rounded-full ml-2 hover:bg-[#004aad] cursor-pointer'>
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBar;
