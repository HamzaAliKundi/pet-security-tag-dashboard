import { useNavigate } from "react-router-dom";

const EmailVerificationSent = () => {
  const navigate = useNavigate();

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
              Check Your Email
            </h2>
            <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] mb-6">
              We've sent a verification link to your email address.<br />Please check your inbox and click the link to verify your account.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationSent;