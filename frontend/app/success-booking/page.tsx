import React from 'react';

// SuccessBookingPage displays a confirmation message after successful ticket booking
const SuccessBookingPage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-[#f0f6ff]'>
      {/* Card container for success message */}
      <div className='bg-white shadow-xl rounded-lg p-10 flex flex-col items-center max-w-md w-full'>
        {/* Success icon */}
        <div className='text-green-500 mb-4 text-6xl'>✅</div>
        {/* Main success message */}
        <h1 className='text-2xl font-bold text-[#004aad] mb-2 text-center'>
          Tickets Booked Successfully!
        </h1>
        {/* Sub-message with instructions */}
        <p className='text-gray-700 text-center mb-4'>
          Thank you for your booking.
          <br />
          Please check your email for your tickets and further details.
        </p>
        {/* Optional: Button to go back to home or view events */}
        <a
          href='/all-events'
          className='mt-2 px-6 py-2 bg-[#004aad] text-white rounded-md font-semibold hover:bg-[#003080] transition'
        >
          Browse More Events
        </a>
      </div>
    </div>
  );
};

export default SuccessBookingPage;
