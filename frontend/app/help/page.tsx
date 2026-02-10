'use client';

import { useState } from 'react';

// List of FAQs for the help page
const faqs = [
  {
    question: 'How do I book an event ticket?',
    answer:
      "Click the 'Book Now' button on the event page, fill in your details, choose ticket quantity, and proceed to checkout.",
  },
  {
    question: 'Can I cancel my booking?',
    answer:
      'Currently, cancellations are not supported. Please contact us if you made a mistake during booking.',
  },
  {
    question: 'Is online payment secure?',
    answer:
      'Yes, we use secure payment gateways like Razorpay to ensure your transaction is safe.',
  },
  {
    question: 'Will I receive a confirmation email?',
    answer:
      "Yes, once your booking is successful, you'll receive a confirmation email with your ticket details.",
  },
];

const HelpPage = () => {
  // State to track which FAQ is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle the open/close state of an FAQ
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-16'>
      {/* Page title */}
      <h1 className='text-4xl font-bold text-[#004aad] text-center mb-6'>
        Help & Support
      </h1>
      {/* Subtitle */}
      <p className='text-center text-gray-600 mb-10'>
        Need help with booking, payments, or something else? Find answers below
        or reach out to us!
      </p>

      {/* Help Section with general tips */}
      <div className='mb-12'>
        <h2 className='text-2xl font-semibold mb-4'>General Help</h2>
        <ul className='list-disc pl-6 text-gray-700 space-y-2'>
          <li>Make sure you are logged in before booking an event.</li>
          <li>Double-check your email before submitting the form.</li>
          <li>Payments are handled securely through our payment partner.</li>
          <li>
            If you face any issue, feel free to use the{' '}
            <strong>Contact Us</strong> page.
          </li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className='text-2xl font-semibold mb-4'>
          Frequently Asked Questions
        </h2>
        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <div key={index} className='border rounded-md p-4'>
              {/* FAQ question button */}
              <button
                className='flex justify-between w-full text-left font-medium text-[#004aad]'
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span>{openIndex === index ? '−' : '+'}</span>
              </button>
              {/* Show answer if this FAQ is open */}
              {openIndex === index && (
                <p className='mt-2 text-gray-700'>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
