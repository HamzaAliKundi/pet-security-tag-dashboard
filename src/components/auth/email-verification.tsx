import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmailMutation } from '../../apis/auth';
import toast from 'react-hot-toast';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const token = searchParams.get('token');

  const handleVerifyEmail = async () => {
    if (!token) {
      toast.error('Invalid verification link');
      return;
    }

    try {
      const res = await verifyEmail({ token }).unwrap();
      if (res?.status === 200) {
        navigate('/verification-success');
      }
    } catch (error) {
      toast.error('Failed to verify email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#4CB2E2]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#4CB2E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-[#05131D] mb-4 capitalize">
              Verify Your Email
            </h2>
            <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] mb-6">
              Please click the button below to verify your email address.<br />This will help us ensure the security of your account.
            </p>
            <button
              onClick={handleVerifyEmail}
              disabled={isLoading}
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#05131D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full h-[56px] bg-gray-100 text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-gray-200 transition-colors font-bold mt-4"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
