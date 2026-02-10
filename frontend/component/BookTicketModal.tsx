'use client';

// BookTicketModal displays a modal dialog for users to book tickets for an event

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Props for BookTicketModal component
interface BookTicketModalProps {
  open: boolean; // Whether the modal is open
  onOpenChange: (open: boolean) => void; // Function to handle modal open/close
  eventTitle: string; // Title of the event
  eventId: number; // Event ID
  eventPrice: number; // Price per ticket
}

const BookTicketModal = ({
  open,
  onOpenChange,
  eventTitle,
  eventId,
  eventPrice,
}: BookTicketModalProps) => {
  const router = useRouter();
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Handle form submission: redirect to checkout page with booking details
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = eventPrice * quantity;
    router.push(
      `/checkout?name=${eventTitle}&email=${email}&quantity=${quantity}&eventId=${eventId}&totalAmount=${totalAmount}`
    );
    onOpenChange(false); // Close the modal after proceeding
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Modal overlay */}
        <Dialog.Overlay className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        {/* Modal content */}
        <Dialog.Content className='fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl space-y-4'>
          <div className='flex justify-between items-center mb-2'>
            {/* Modal title */}
            <Dialog.Title className='text-xl font-semibold text-gray-800'>
              Book Tickets for {eventTitle}
            </Dialog.Title>
            {/* Close button */}
            <Dialog.Close>
              <X className='w-5 h-5 text-gray-500 hover:text-black' />
            </Dialog.Close>
          </div>

          {/* Booking form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name input */}
            <div>
              <label className='block font-medium text-sm text-gray-700'>
                Name
              </label>
              <input
                required
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full mt-1 border rounded-md px-3 py-2'
              />
            </div>

            {/* Email input */}
            <div>
              <label className='block font-medium text-sm text-gray-700'>
                Email
              </label>
              <input
                required
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full mt-1 border rounded-md px-3 py-2'
              />
            </div>

            {/* Number of tickets input */}
            <div>
              <label className='block font-medium text-sm text-gray-700'>
                Number of Tickets
              </label>
              <input
                required
                type='number'
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className='w-full mt-1 border rounded-md px-3 py-2'
              />
            </div>

            {/* Submit button */}
            <button
              type='submit'
              className='w-full bg-[#004aad] text-white py-2 px-4 rounded-md hover:bg-[#003080] transition cursor-pointer'
            >
              Proceed to Payment
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BookTicketModal;
