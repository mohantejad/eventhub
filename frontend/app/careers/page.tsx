// CareerPage displays information about job opportunities at the company
const CareerPage = () => {
  return (
    <div className='max-w-3xl mx-auto px-4 py-20 text-center'>
      {/* Page Title */}
      <h1 className='text-4xl font-bold text-[#004aad] mb-4'>Careers</h1>
      {/* Introductory Text */}
      <p className='text-lg text-gray-700 mb-6'>
        We&apos;re always looking for passionate and talented people to join our
        team.
      </p>
      {/* Notice for no current job openings */}
      <div className='bg-yellow-50 border border-yellow-200 rounded-md p-6'>
        <h2 className='text-xl font-semibold text-yellow-800 mb-2'>
          No Job Openings Right Now
        </h2>
        <p className='text-gray-700'>
          Currently, there are no open positions. Please check back later or
          follow us on social media for updates.
        </p>
      </div>
    </div>
  );
};

export default CareerPage;
