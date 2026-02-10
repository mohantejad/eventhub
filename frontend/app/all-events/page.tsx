'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventType } from '@/types';
import EventCard from '@/component/utils/EventCard';

// List of available event categories
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
const eventModes = ['Online', 'Onsite', 'Hybrid'];

// Main page component with suspense for async loading
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AllEventsContent />
    </Suspense>
  );
};

// Component to fetch and display all events with filters
const AllEventsContent = () => {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<EventType[]>([]);
  // Get filter values from URL or state
  const categoryFromUrl = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedDate, setSelectedDate] = useState('');
  const city = searchParams.get('city') || '';
  const searchKeyword = searchParams.get('search') || '';
  const [selectedMode, setSelectedMode] = useState('');
  // Get access token for authenticated requests
  const accessToken = localStorage.getItem('accessToken');

  // Fetch events from backend API whenever filters change
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Build API URL with query parameters
        let apiUrl = `/api/event/events/?`;
        if (city) apiUrl += `city=${encodeURIComponent(city)}&`;
        if (searchKeyword)
          apiUrl += `search=${encodeURIComponent(searchKeyword)}&`;
        if (selectedCategory)
          apiUrl += `event_category=${encodeURIComponent(selectedCategory)}&`;
        if (selectedMode)
          apiUrl += `event_mode=${encodeURIComponent(selectedMode)}&`;

        // Handle date filter logic
        if (selectedDate) {
          const today = new Date();
          let targetDate = '';

          if (selectedDate === 'today') {
            targetDate = today.toISOString().split('T')[0];
          } else if (selectedDate === 'tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            targetDate = tomorrow.toISOString().split('T')[0];
          } else if (selectedDate === 'this_weekend') {
            const day = today.getDay();
            const daysUntilSaturday = (6 - day + 7) % 7;
            const saturday = new Date(today);
            saturday.setDate(today.getDate() + daysUntilSaturday);
            targetDate = saturday.toISOString().split('T')[0];
          }

          if (targetDate) apiUrl += `date=${encodeURIComponent(targetDate)}&`;
        }

        // Set headers for authentication if token is present
        const headers: Record<string, string> = {};
        if (accessToken) {
          headers['Authorization'] = `JWT ${accessToken}`;
        }

        // Fetch events from API
        const res = await fetch(apiUrl, { headers });
        const data = await res.json();

        setEvents(data);
      } catch (error) {
        // Log any errors during fetch
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [city, searchKeyword, selectedCategory, selectedDate, selectedMode, accessToken]);

  // Reset all filters to default
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedDate('');
    setSelectedMode('');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Page title and subtitle */}
      <h2 className='text-3xl font-bold mb-2'>
        Events in {city || 'Australia'}
      </h2>
      <p className='text-gray-500 mb-6'>
        Search for something you love or check out popular events in your area.
      </p>

      {/* Filters and event list layout */}
      <div className='flex flex-col md:flex-row gap-6 items-center md:items-start'>
        {/* Filters sidebar */}
        <div className='w-full md:w-1/4 flex flex-col md:block'>
          <h3 className='font-bold text-xl mb-4 uppercase'>Filters</h3>

          {/* Category filter for mobile */}
          <div className='mb-4 w-full md:hidden'>
            <label className='block font-semibold text-lg'>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='w-full p-2 border rounded-md'
            >
              <option value=''>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date filter for mobile */}
          <div className='mb-4 w-full md:hidden'>
            <label className='block font-semibold text-lg'>Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className='w-full p-2 border rounded-md'
            >
              <option value=''>Any Date</option>
              <option value='today'>Today</option>
              <option value='tomorrow'>Tomorrow</option>
              <option value='this_weekend'>This Weekend</option>
            </select>
          </div>

          {/* Category filter for desktop */}
          <div className='hidden md:block'>
            <h4 className='font-semibold text-lg'>Category</h4>
            {categories.map((category) => (
              <p
                key={category}
                className={`cursor-pointer py-1 ${
                  selectedCategory === category
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-600'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </p>
            ))}
          </div>

          {/* Date filter for desktop */}
          <div className='hidden md:block'>
            <h4 className='font-semibold mt-2 text-lg'>Date</h4>
            {['Today', 'Tomorrow', 'This Weekend'].map((date) => (
              <p
                key={date}
                className={`cursor-pointer py-1 ${
                  selectedDate === date.toLowerCase()
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-600'
                }`}
                onClick={() => setSelectedDate(date.toLowerCase())}
              >
                {date}
              </p>
            ))}
          </div>

          {/* Mode filter for mobile */}
          <div className='mb-4 w-full md:hidden'>
            <label className='block font-semibold text-lg'>Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className='w-full p-2 border rounded-md'
            >
              <option value=''>All Modes</option>
              {eventModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
          {/* Mode filter for desktop */}
          <div className='hidden md:block'>
            <h4 className='font-semibold mt-2 text-lg'>Mode</h4>
            {eventModes.map((mode) => (
              <p
                key={mode}
                className={`cursor-pointer py-1 ${
                  selectedMode === mode
                    ? 'text-blue-600 font-bold'
                    : 'text-gray-600'
                }`}
                onClick={() => setSelectedMode(mode)}
              >
                {mode}
              </p>
            ))}
          </div>

          {/* Button to reset all filters */}
          <button
            className='p-2 bg-gray-300 text-black rounded-md w-full mt-4'
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </div>
        {/* Events list */}
        <div className='w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
            {events.length > 0 ? (
              // Render each event as a card
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              // Show message if no events found
              <p className='text-gray-500'>No events found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
