'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

// ContactPage displays a contact form for users to send messages
const ContactPage = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // State to track if form is submitting
  const [submitting, setSubmitting] = useState(false);

  // Handle input changes and update form state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call (replace with real API call if needed)
      await new Promise((res) => setTimeout(res, 1000));
      toast.success('Message sent successfully!');
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error(`${error} Please try again later.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-16'>
      {/* Page title */}
      <h1 className='text-4xl font-bold text-center text-[#004aad] mb-6'>
        Contact Us
      </h1>
      {/* Subtitle */}
      <p className='text-center text-gray-600 mb-10'>
        Have questions, feedback, or just want to say hi? Fill out the form
        below and we’ll get back to you soon!
      </p>

      {/* Contact form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded-lg p-6 space-y-6'
      >
        <div>
          <label className='block mb-1 font-medium'>Name</label>
          <input
            name='name'
            type='text'
            required
            value={formData.name}
            onChange={handleChange}
            className='w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]'
            placeholder='Your Name'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>Email</label>
          <input
            name='email'
            type='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]'
            placeholder='you@example.com'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>Message</label>
          <textarea
            name='message'
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className='w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]'
            placeholder='Tell us how we can help...'
          />
        </div>

        {/* Submit button, disabled while submitting */}
        <button
          type='submit'
          disabled={submitting}
          className='bg-[#004aad] text-white px-6 py-2 rounded-md hover:bg-[#003080] transition cursor-pointer'
        >
          {submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
