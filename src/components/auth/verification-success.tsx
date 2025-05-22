import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-[#05131D] mb-4 capitalize">
              Email Verified!
            </h2>
            <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] mb-6">
              Your email has been successfully verified. Click the button below to login.
            </p>
            <button
              onClick={() => navigate('/')}
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;