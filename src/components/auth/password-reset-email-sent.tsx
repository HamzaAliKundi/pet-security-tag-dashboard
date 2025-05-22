import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const PasswordResetEmailSent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-50 p-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Check Your Email
            </h2>
            <p className="text-gray-500">
              We have sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="flex flex-col gap-3">
              <Link to="/forgot-password">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-200">
                  Try Again
                </button>
              </Link>
              
              <Link to="/">
                <button className="w-full flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  <FiArrowLeft />
                  Back to Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmailSent;