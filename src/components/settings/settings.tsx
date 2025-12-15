import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useGetSingleUserQuery, useUpdateSingleUserMutation, useDeleteAccountMutation } from '../../apis/user/users';

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countryCode, setCountryCode] = useState('+1');
  const navigate = useNavigate();
  
  // @ts-ignore
  const { data: userData, isLoading: isLoadingUser, error: userError } = useGetSingleUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateSingleUserMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] = useDeleteAccountMutation();

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
      if (userData.user.phone) {
        // Extract country code and phone number from stored phone
        const phoneValue = userData.user.phone;
        // Check if phone starts with + and extract country code
        if (phoneValue.startsWith('+')) {
          // Try to match common country codes (sorted by length, longer first to avoid partial matches)
          const commonCodes = ['+44', '+92', '+91', '+86', '+81', '+33', '+49', '+39', '+34', '+61', '+27', '+55', '+52', '+1', '+7'];
          let matched = false;
          for (const code of commonCodes) {
            if (phoneValue.startsWith(code)) {
              setCountryCode(code);
              setValue('phone', phoneValue.substring(code.length).trim());
              matched = true;
              break;
            }
          }
          // If no match, default to +1 and use full number
          if (!matched) {
            setCountryCode('+1');
            setValue('phone', phoneValue);
          }
        } else {
          setValue('phone', phoneValue);
        }
      } else {
        setValue('phone', '');
      }
      // Set address fields
      setValue('street', userData.user.street || '');
      setValue('city', userData.user.city || '');
      setValue('state', userData.user.state || '');
      setValue('zipCode', userData.user.zipCode || '');
      setValue('country', userData.user.country || '');
    }
  }, [userData, setValue]);

  const onSubmit = async (data: UserFormData) => {
    try {
      // Combine country code with phone number
      const phoneWithCountryCode = data.phone 
        ? (data.phone.startsWith('+') ? data.phone : `${countryCode}${data.phone}`)
        : undefined;
      
      const updateData = {
        ...data,
        phone: phoneWithCountryCode
      };
      
      const result = await updateUser(updateData).unwrap();
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (userData?.user) {
      let phoneValue = '';
      if (userData.user.phone) {
        const phone = userData.user.phone;
        if (phone.startsWith('+')) {
          // Extract country code and phone number
          const commonCodes = ['+44', '+92', '+91', '+86', '+81', '+33', '+49', '+39', '+34', '+61', '+27', '+55', '+52', '+1', '+7'];
          let extracted = false;
          for (const code of commonCodes) {
            if (phone.startsWith(code)) {
              setCountryCode(code);
              phoneValue = phone.substring(code.length).trim();
              extracted = true;
              break;
            }
          }
          if (!extracted) {
            phoneValue = phone;
          }
        } else {
          phoneValue = phone;
        }
      }
      reset({
        firstName: userData.user.firstName,
        lastName: userData.user.lastName,
        email: userData.user.email,
        phone: phoneValue,
        street: userData.user.street || '',
        city: userData.user.city || '',
        state: userData.user.state || '',
        zipCode: userData.user.zipCode || '',
        country: userData.user.country || ''
      });
    }
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // @ts-ignore
      await deleteAccount().unwrap();
      toast.success('Your account has been deleted successfully.');
      localStorage.removeItem('token');
      navigate('/', { replace: true });
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete account');
    } finally {
      setIsDeleteModalOpen(false);
    }
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

      {/* Alert Message */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-afacad text-sm text-blue-700">
              <strong>Important:</strong> Please make sure to give correct information and fill all the fields so that for referral rewards we will use your given address.
            </p>
          </div>
        </div>
      </div>

      {/* Combined Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Profile Section */}
        <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <div className="font-afacad font-semibold text-[16px] text-[#222]">Profile</div>
              {!isEditing && (
                <button
                  type="button"
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

          {/* Profile Form Fields */}
          <div className="flex flex-col gap-6">
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
              className="w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none bg-[#FAFAFA] cursor-not-allowed"
              readOnly
              disabled
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

          <div>
            <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="phone">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={!isEditing}
                className={`rounded-[8px] border border-[#E0E0E0] px-3 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                style={{ width: '120px' }}
              >
               <option value="+44">+44 (UK)</option>
                <option value="+1">+1 (USA)</option>
                 <option value="+1">+1 (Canada)</option>
              </select>
              <input
                id="phone"
                type="tel"
                className={`flex-1 rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                readOnly={!isEditing}
                placeholder="Enter phone number"
                {...register('phone', {
                  pattern: {
                    value: /^[\d\s\-()]+$/,
                    message: 'Invalid phone number format'
                  }
                })}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </span>
            )}
          </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8 mt-6">
          <div className="mb-6">
            <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">Address</div>
            <div className="font-afacad text-[14px] text-[#636363] mb-4">
              Provide your complete address for referral reward deliveries.
            </div>
            <div className="border-b border-[#E0E0E0]" />
          </div>

          {/* Address Form Fields */}
          <div className="flex flex-col gap-6">
          <div>
            <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="street">
              Street Address
            </label>
            <input
              id="street"
              type="text"
              className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                isEditing 
                  ? 'bg-white focus:border-[#4CB2E2]' 
                  : 'bg-[#FAFAFA] cursor-not-allowed'
              }`}
              readOnly={!isEditing}
              placeholder="Enter street address"
              {...register('street')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="city">
                City
              </label>
              <input
                id="city"
                type="text"
                className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                readOnly={!isEditing}
                placeholder="Enter city"
                {...register('city')}
              />
            </div>

            <div>
              <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="state">
                State/Province
              </label>
              <input
                id="state"
                type="text"
                className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                readOnly={!isEditing}
                placeholder="Enter state or province"
                {...register('state')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="zipCode">
                ZIP/Postal Code
              </label>
              <input
                id="zipCode"
                type="text"
                className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                readOnly={!isEditing}
                placeholder="Enter ZIP or postal code"
                {...register('zipCode')}
              />
            </div>

            <div>
              <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="country">
                Country
              </label>
              <select
                id="country"
                disabled={!isEditing}
                className={`w-full rounded-[8px] border border-[#E0E0E0] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm transition focus:outline-none ${
                  isEditing 
                    ? 'bg-white focus:border-[#4CB2E2]' 
                    : 'bg-[#FAFAFA] cursor-not-allowed'
                }`}
                {...register('country')}
              >
                <option value="" disabled>Select country</option>
                <option value="United States">United States</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
          </div>
          </div>
        </div>

        {/* Save/Cancel Buttons - At the bottom of the form */}
        {isEditing && (
          <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-6 mt-6 flex gap-3 justify-end">
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Danger zone */}
      <div className="bg-white rounded-[16px] shadow-lg border border-[#FFE2E2] px-6 py-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-afacad font-semibold text-[16px] text-[#C81E1E]">Delete Account</div>
            <p className="font-afacad text-[14px] text-[#7A1C1C] mt-1">
              Permanently remove your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 rounded-[8px] bg-[#FEE2E2] text-[#B91C1C] font-afacad font-semibold text-[14px] shadow-sm hover:bg-[#FECACA] transition"
          >
            Delete account
          </button>
        </div>
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40 px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="bg-red-100 text-red-500 rounded-full p-3 mb-4">
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <path d="M12 9v4m0 4h.01M3.23 17a2 2 0 0 0 1.73 1h14.08a2 2 0 0 0 1.73-1l2.77-5a2 2 0 0 0 0-2l-2.77-5A2 2 0 0 0 19.04 3H4.96a2 2 0 0 0-1.73 1L.46 9a2 2 0 0 0 0 2l2.77 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-[20px] font-afacad font-semibold text-[#1F2933] mb-2">Delete account?</h2>
              <p className="text-[14px] text-[#6B7280] font-afacad mb-4">
                This will permanently delete your profile, pets, orders, subscriptions, and QR code assignments. You will lose access immediately.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-[10px] border border-gray-200 text-gray-600 font-afacad font-semibold hover:bg-gray-100 transition"
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
                className="flex-1 px-4 py-2.5 rounded-[10px] bg-[#DC2626] text-white font-afacad font-semibold hover:bg-[#B91C1C] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;