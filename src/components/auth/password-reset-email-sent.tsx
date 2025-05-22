import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const PasswordResetEmailSent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="rounded-full bg-[#4CB2E2]/20 p-4 flex items-center justify-center">
              <Mail className="h-10 w-10 text-[#4CB2E2]" />
            </div>
            <div>
              <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-[#05131D] mb-2 capitalize">
                Check Your Email
              </h2>
              <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D]">
                We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
              </p>
            </div>
            <div className="space-y-4 w-full">
              <p className="font-helvetica-neue text-sm text-[#05131D]">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="flex flex-col gap-3">
                <Link to="/forgot-password">
                  <button className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold">
                    Try Again
                  </button>
                </Link>
                <Link to="/">
                  <button className="w-full flex items-center justify-center gap-2 font-helvetica-neue text-base text-[#05131D] hover:underline transition-colors">
                    <FiArrowLeft />
                    Back to Login
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmailSent;