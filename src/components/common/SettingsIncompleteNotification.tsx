import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetSingleUserQuery } from '../../apis/user/users';
import { isUserSettingsComplete } from '../../utils/settingsValidation';

const SettingsIncompleteNotification = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  
  // Fetch user data to check if settings are complete
  // @ts-ignore
  const { data: userData, isLoading } = useGetSingleUserQuery();

  // Check if settings are complete
  const isSettingsComplete = userData?.user ? isUserSettingsComplete(userData.user) : false;

  // Hide notification if settings are complete
  useEffect(() => {
    if (isSettingsComplete) {
      setIsVisible(false);
    } else if (!isLoading && userData?.user) {
      // Show notification if settings are incomplete
      setIsVisible(true);
    }
  }, [isSettingsComplete, isLoading, userData]);

  // Don't show if loading, complete, or hidden by user
  if (isLoading || isSettingsComplete || !isVisible || !userData?.user) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-[320px] md:w-[380px] max-w-[380px] animate-slide-down">
      <div className="bg-white rounded-lg shadow-2xl border border-red-200 overflow-hidden">
        {/* Header */}
        <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-afacad font-semibold text-sm">Profile Incomplete</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close notification"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Notification Content */}
        <div className="px-4 py-4">
          <div className="flex-1 min-w-0">
            <p className="font-afacad font-semibold text-[#0F2137] text-sm mb-2">
              Complete your profile settings
            </p>
            <p className="font-afacad text-[#636363] text-xs mb-4">
              Please complete your profile settings (including address and phone) before updating pets or placing orders.
            </p>
            <button
              onClick={() => {
                setIsVisible(false);
                navigate('/settings');
              }}
              className="w-full bg-[#4CB2E2] text-white font-afacad font-semibold text-sm px-4 py-2 rounded-lg hover:bg-[#3da1d1] transition-colors"
            >
              Go to Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsIncompleteNotification;

