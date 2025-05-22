import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PasswordChangedSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-xl shadow-lg p-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-50 p-3">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h2 className="text-center text-2xl font-semibold text-gray-800">
            Password Changed Successfully
          </h2>
          <p className="text-center text-gray-500 text-sm">
            Your password has been changed successfully. You can now login with your new password.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangedSuccess;