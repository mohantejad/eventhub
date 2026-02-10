'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UserType, EventType } from '@/types';
import EventCard from '@/component/utils/EventCard';
import { store } from '@/redux/store';
import { loginSuccess } from '@/redux/authSlice';

// UserDetails component displays and allows editing of user profile and lists user's events
const UserDetails = () => {
  const router = useRouter();
  // State to hold user's events
  const [events, setEvents] = useState<EventType[]>([]);
  // State to track loading status
  const [loading, setLoading] = useState(true);
  // State to hold user details
  const [userDetails, setUserDetails] = useState<UserType>();
  // State to toggle edit mode for profile
  const [editMode, setEditMode] = useState(false);
  // State to hold updated user info during editing
  const [updatedUser, setUpdatedUser] = useState<UserType>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
  });

  // Fetch user profile and user's events on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setLoading(false);
        return;
      }

      // Fetch user profile data
      try {
        const userresponse = await fetch(
          '/auth/users/me/',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${accessToken}`,
            },
          }
        );

        if (!userresponse.ok) {
          throw new Error('Failed to fetch user data');
        }

        if (userresponse.ok) {
          const userData = await userresponse.json();
          setUserDetails(userData);
          // Update Redux store with user data
          store.dispatch(loginSuccess({ user: userData }));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Error fetching profile');
        } else {
          toast.error('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }

      // Fetch user's created events
      try {
        const eventResponse = await fetch(
          '/api/event/events/my_events/',
          {
            method: 'GET',
            headers: {
              Authorization: `JWT ${accessToken}`,
            },
          }
        );

        if (!eventResponse.ok) {
          throw new Error('Failed to fetch user events');
        }

        const eventData = await eventResponse.json();
        setEvents(eventData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Error fetching User events');
        } else {
          toast.error('An unknown error occurred');
        }
      }
    };

    fetchUserProfile();
  }, [router]);

  // Handle profile update when user saves changes
  const handleUpdateProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      // Send PATCH request to update user profile
      const response = await fetch('/auth/users/me/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${accessToken}`,
        },
        body: JSON.stringify({
          first_name: updatedUser.first_name || userDetails?.first_name,
          last_name: updatedUser.last_name || userDetails?.last_name,
          email: updatedUser.email || userDetails?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserDetails(updatedData);

      toast.success('Profile updated successfully! 🎉');
      setEditMode(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Error updating profile');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Show loading message while fetching data
  if (loading)
    return <p className='text-center text-[#004aad]'>Loading profile...</p>;

  return (
    <div className='container mx-auto py-10 px-4'>
      {/* User profile card */}
      <div className='bg-white border border-[#81a7e3] rounded-lg p-6 max-w-2xl mx-auto'>
        <h2 className='text-2xl font-semibold text-center text-[#004aad] uppercase'>
          User Profile
        </h2>
        <div className='mt-4 space-y-2'>
          <div>
            {/* Edit mode: show input fields for editing */}
            {editMode ? (
              <div>
                <label className='block font-medium text-gray-700'>
                  First Name
                </label>
                <input
                  type='text'
                  className='border p-2 rounded w-full mb-2'
                  value={updatedUser.first_name}
                  placeholder={userDetails?.first_name}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      first_name: e.target.value,
                    })
                  }
                />

                <label className='block font-medium text-gray-700'>
                  Last Name
                </label>
                <input
                  type='text'
                  className='border p-2 rounded w-full mb-2'
                  value={updatedUser.last_name}
                  placeholder={userDetails?.last_name}
                  onChange={(e) =>
                    setUpdatedUser({
                      ...updatedUser,
                      last_name: e.target.value,
                    })
                  }
                />

                <label className='block font-medium text-gray-700'>Email</label>
                <input
                  type='email'
                  className='border p-2 rounded w-full mb-2'
                  value={updatedUser.email}
                  placeholder={userDetails?.email}
                  onChange={(e) =>
                    setUpdatedUser({ ...updatedUser, email: e.target.value })
                  }
                />

                <div className='flex items-center justify-between'>
                  {/* Save changes button */}
                  <button
                    className='mt-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer'
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>

                  {/* Cancel editing button */}
                  <button
                    className='px-4 py-2 bg-gray-500 text-white rounded cursor-pointer'
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode: show user details
              <div>
                <p>
                  <strong>First Name:</strong> {userDetails?.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {userDetails?.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails?.email}
                </p>
                {/* Edit profile button */}
                <button
                  className='mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer'
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User's created events section */}
      <div className='mt-8'>
        <h3 className='text-xl font-semibold text-[#004aad]'>Your Events</h3>
        {!events || events.length === 0 ? (
          <p className='mt-4 text-gray-500'>
            You have not created any events yet.
          </p>
        ) : (
          <div className='mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Button to create a new event */}
      <button
        className='mt-8 px-4 py-2 bg-green-500 text-white rounded cursor-pointer'
        onClick={() => router.push('/create-event')}
      >
        Create New Event
      </button>
    </div>
  );
};

export default UserDetails;
