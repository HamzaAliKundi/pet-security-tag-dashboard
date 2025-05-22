import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PasswordChangedSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-[#4CB2E2]/20 p-4 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-[#4CB2E2]" />
            </div>
            <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-[#05131D] text-center capitalize">
              Password Changed Successfully
            </h2>
            <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] text-center">
              Your password has been changed successfully. You can now login with your new password.
            </p>
          </div>
          <div className="space-y-4">
            <Link to="/">
              <button className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangedSuccess;