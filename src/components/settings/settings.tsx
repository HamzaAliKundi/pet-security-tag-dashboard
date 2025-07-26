import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useGetSingleUserQuery, useUpdateSingleUserMutation } from '../../apis/user/users';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // @ts-ignore
  const { data: userData, isLoading: isLoadingUser, error: userError } = useGetSingleUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateSingleUserMutation();

  // Form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<UserFormData>();

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      setValue('firstName', userData.user.firstName);
      setValue('lastName', userData.user.lastName);
      setValue('email', userData.user.email);
    }
  }, [userData, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const result = await updateUser(data).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (userData?.user) {
      reset({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email
      });
    }
    setIsEditing(false);
  };

  // Loading state for initial data fetch
  if (isLoadingUser) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="font-afacad font-semibold text-[18px] sm:text-[20px] lg:text-[24px] text-[#222] mb-4 sm:mb-6 lg:mb-8 text-left">
          Account
        </div>
        <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8">
          <div className="animate-pulse">
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="border-b border-[#E0E0E0]"></div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (userError) {
    return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="font-afacad font-semibold text-[18px] sm:text-[20px] lg:text-[24px] text-[#222] mb-4 sm:mb-6 lg:mb-8 text-left">
          Account
        </div>
        <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8">
          <div className="text-center py-8">
            <div className="text-red-500 text-lg mb-2">Error loading user data</div>
            <div className="text-gray-600">Please try refreshing the page</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      {/* Account Title */}
      <div className="font-afacad font-semibold text-[18px] sm:text-[20px] lg:text-[24px] text-[#222] mb-4 sm:mb-6 lg:mb-8 text-left">
        Account
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <div className="font-afacad font-semibold text-[16px] text-[#222]">Profile</div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] shadow-sm hover:bg-[#d0eefd] transition"
              >
                <svg width="16" height="16" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit
              </button>
            )}
          </div>
          <div className="font-afacad text-[14px] text-[#636363] mb-4">
            We like to know who we're talking to; please enter your name so we know how to address you.
          </div>
          <div className="border-b border-[#E0E0E0]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div>
            <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="firstName">
              First name*
            </label>
            <input
              id="firstName"
              type="text"
              className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                isEditing 
                  ? 'bg-white focus:border-[#4CB2E2]' 
                  : 'bg-[#FAFAFA] cursor-not-allowed'
              }`}
              readOnly={!isEditing}
              {...register('firstName', { required: 'First name is required' })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div>
            <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="lastName">
              Last name*
            </label>
            <input
              id="lastName"
              type="text"
              className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                isEditing 
                  ? 'bg-white focus:border-[#4CB2E2]' 
                  : 'bg-[#FAFAFA] cursor-not-allowed'
              }`}
              readOnly={!isEditing}
              {...register('lastName', { required: 'Last name is required' })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div>
            <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="email">
              Email*
            </label>
            <input
              id="email"
              type="email"
              className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                isEditing 
                  ? 'bg-white focus:border-[#4CB2E2]' 
                  : 'bg-[#FAFAFA] cursor-not-allowed'
              }`}
              readOnly={!isEditing}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </div>

          {isEditing && (
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[16px] shadow-sm hover:bg-[#3da1d1] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7"/>
                    </svg>
                    Save
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex items-center gap-2 px-6 py-2.5 rounded-[8px] bg-gray-200 text-gray-700 font-afacad font-semibold text-[16px] shadow-sm hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Settings;