import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSignupMutation } from "../../apis/auth";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signup] = useSignupMutation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref'); // Get referral code from URL

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        referralCode: referralCode || undefined, // Include referral code if present
      };
      const res = await signup(payload);
      if (res?.data?.status === 201) navigate("/verify-email-sent");
      // @ts-ignore
      else toast.error(res?.error?.data?.message ?? "Signup failed");
    } catch (error) {
      toast.error("An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        {/* Header */}
        <div className="text-start space-y-4">
          <h1 className="font-helvetica-neue font-medium text-[32px] leading-[100%] text-[#05131D] capitalize">
            Register Form
          </h1>
          <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] capitalize">
            Welcome to Digital Tails 🐾<br />
            Please create an account to manage your pet's profile. 🐶🐱
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-center capitalize">
            Register
          </h2>

          <form className="space-y-6 mb-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                First Name*
              </label>
              <input
                type="text"
                className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                placeholder="Enter your first name"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Last Name*
              </label>
              <input
                type="text"
                className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                placeholder="Enter your last name"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Email*
              </label>
              <input
                type="email"
                className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Password*
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  style={{ position: 'absolute', right: 12, top: 20 }}
                >
                  {passwordVisible ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="font-helvetica-neue font-normal text-[#05131D] text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#05131D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing Up...
                </div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <div className="text-center space-y-4">
            <p className="font-helvetica-neue font-normal text-base text-[#05131D] mt-8 leading-[100%] tracking-[-0.02em] text-center">
              Already have an account? <Link to="/" className='underline'>Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;