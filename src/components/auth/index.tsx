import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../apis/auth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const res: any = await login(data);
      if (res?.data?.status === 200) {
        localStorage.setItem("token", res?.data?.token);
        toast.success(res?.data?.message);
        navigate("/overview");
      } else toast.error(res?.error?.data?.message ?? "Invalid credentials");
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-[650px] space-y-4">
        {/* Header */}
        <div className="text-start space-y-4">
          <h1 className="font-helvetica-neue font-medium text-[32px] leading-[100%] text-[#05131D] capitalize">
            Login Form
          </h1>
          <p className="font-helvetica-neue font-normal text-base leading-[140%] tracking-[-0.02em] text-[#05131D] capitalize">
            Welcome to Digital Tails 🐾<br />
            Please login or create an account to manage your pet's profile. 🐶🐱
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg px-2 md:px-8 py-4 md:py-8 space-y-4">
          <h2 className="font-helvetica-neue font-medium text-2xl leading-[100%] text-center capitalize">
            Login
          </h2>

          <form className="space-y-6 mb-12" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label className="block font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Email*
              </label>
              <input
                type="email"
                className="w-full h-[56px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CB2E2]"
                placeholder="Enter your email"
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">Valid email is required</span>
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
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-500"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  style={{ position: 'absolute', right: 16, top: 18 }}
                >
                  {passwordVisible ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">Password is required</span>
              )}
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="font-helvetica-neue font-normal text-base leading-[100%] tracking-[-0.02em] text-[#05131D]">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full h-[56px] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 hover:bg-[#3da1d1] transition-colors font-bold flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#05131D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center space-y-4 !mt-10">
            <p className="font-helvetica-neue font-[500] text-base leading-[100%] tracking-[0%] text-center capitalize">
              Don't have an account?
            </p>
            <div className="flex justify-center">
              <Link to="/signup" className="w-[198px] h-[56px] font-medium border border-[#4CB2E2] bg-[#4CB2E2] text-[#05131D] rounded-lg px-6 py-2.5 transition-colors flex items-center justify-center">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;