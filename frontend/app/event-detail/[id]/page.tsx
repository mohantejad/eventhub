'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EventType } from '@/types';
import Image from 'next/image';
import BookTicketModal from '@/component/BookTicketModal';

// EventDetail displays detailed information about a single event
const EventDetail = () => {
  // Get event ID from URL params
  const { id } = useParams();
  // State to hold event data
  const [event, setEvent] = useState<EventType | null>(null);
  // State to control booking modal visibility
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Fetch event details from backend API
    const fetchEvent = async () => {
      try {
        const res = await fetch(
          `/api/event/events/${id}/`
        );
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    // Only fetch if id is present
    if (id) fetchEvent();
  }, [id]);

  // Show loading message while event data is being fetched
  if (!event) {
    return (
      <p className='text-center text-gray-500'>Loading event details...</p>
    );
  }

  return (
    <div className='container mx-auto px-4 py-10 max-w-6xl'>
      <div className='flex flex-col items-start gap-6'>
        {/* Event image */}
        <div className='w-full'>
          <Image
            src={event.image.startsWith('http') ? event.image.replace('http://3.106.141.19', '') : event.image}
            alt={event.title}
            width={600}
            height={400}
            className='w-full h-auto rounded-xl shadow-xl object-cover'
          />
        </div>

        <div className='w-full space-y-6'>
          {/* Event title */}
          <h1 className='text-4xl font-extrabold text-[#004aad]'>
            {event.title}
          </h1>

          {/* Event details and booking section */}
          <div className='flex flex-col-reverse md:flex-row items-start justify-between border-t w-full'>
            <div className='pt-4 space-y-2'>
              {/* Event category */}
              <p className='text-lg'>
                <span className='font-semibold text-gray-800'>Category:</span>{' '}
                {event.event_category}
              </p>
              {/* Event date */}
              <p className='text-lg'>
                <span className='font-semibold text-gray-800'>Date:</span>{' '}
                {event.date}
              </p>
              {/* Event city */}
              <p className='text-lg'>
                <span className='font-semibold text-gray-800'>City:</span>{' '}
                {event.city}
              </p>
              {/* Organizer */}
              <p className='text-lg'>
                <span className='font-semibold text-gray-800'>
                  Organized By:
                </span>{' '}
                {event.created_by}
              </p>
              {/* Number of likes */}
              <p className='text-lg'>
                <span className='font-semibold text-gray-800'>
                  Number of Likes:
                </span>{' '}
                {event.likes}
              </p>
            </div>

            {/* Booking section */}
            <div className='mt-6 flex flex-col'>
              {/* Event price */}
              <span className='px-5 items-center flex justify-center py-2 rounded-full text-lg font-semibold shadow-md'>
                ${event.price}
              </span>
              {/* Book Now button */}
              <button
                onClick={() => setIsBookingOpen(true)}
                className='mt-4 bg-[#004aad] text-white px-6 py-2 rounded-md hover:bg-[#003080] transition cursor-pointer uppercase'
              >
                Book Now
              </button>
              {/* Booking modal */}
              <BookTicketModal
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                eventTitle={event.title}
                eventId={event.id}
                eventPrice={event.price}
              />
            </div>
          </div>

          {/* Event description */}
          <p className='text-gray-600 text-base leading-relaxed'>
            {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
