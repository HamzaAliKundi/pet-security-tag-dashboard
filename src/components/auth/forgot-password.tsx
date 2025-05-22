import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../../apis/auth";
import { FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string }) => {
    try {
      setIsLoading(true);
      const response = await forgotPassword({ email: data.email });
      if (response?.data?.status === 200) {
        toast.success("Password reset link has been sent to your email");
        navigate("/password-reset-email-sent");
      } else {
        // @ts-ignore
        toast.error(response?.error?.data?.message || "Failed to send reset password email");
      }
    } catch (error) {
      toast.error("Failed to send reset password email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <div className="text-center mb-8">
            <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-[#05131D] mb-2 capitalize">
              Forgot Password?
            </h2>
            <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D] mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#05131D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center font-helvetica-neue font-normal text-base text-[#05131D] hover:underline transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;