import React from 'react'
import { Link } from 'react-router-dom'

const Overview = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[750px] min-h-[110px] flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[11.72px] shadow-lg px-4 sm:px-6 py-4 sm:py-[18px] box-border">
        <div className="flex flex-col justify-center h-full mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="font-afacad font-semibold text-[20px] sm:text-[30px] leading-[26px] sm:leading-[36px] tracking-[0.32px] text-[#313131]">
              Your Active Tag(s):
            </span>
            <span className="font-afacad font-semibold text-[20px] sm:text-[30px] leading-[26px] sm:leading-[36px] tracking-[0.32px] text-[#313131]">
              2
            </span>
          </div>
          <span className="font-afacad font-normal text-[12px] sm:text-[16px] leading-[100%] tracking-[0.4px] text-[#636363] mt-1">
            Your pets' profiles missing alerts.
          </span>
        </div>
        <button
          className="flex items-center justify-center w-full sm:w-[160px] h-[38px] px-[12px] rounded-[8px] bg-[#4CB2E2] border-none text-white font-afacad font-semibold text-[15px] sm:text-[16px] leading-[100%] tracking-[0.4px] cursor-pointer gap-2 whitespace-nowrap self-center mt-4 sm:mt-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8 sm:w-10 sm:h-10 md:min-w-4 md:min-h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12C3.5 7.5 7.5 4.5 12 4.5s8.5 3 9.75 7.5c-1.25 4.5-5.25 7.5-9.75 7.5s-8.5-3-9.75-7.5z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Active Pets
        </button>
      </div>

      <div className="w-full max-w-[750px] h-auto flex flex-col md:flex-row justify-between gap-4 mt-6">
        {/* Pet Profile Card */}
        <div className="w-full md:w-1/2 h-[110px] rounded-[11.72px] shadow-lg bg-white p-[12.21px] flex flex-col mb-4 md:mb-0">
          <div className="mb-2 flex items-center">
            {/* Replace with your SVG/icon */}
            <img src="/overview/profile.svg" alt="Pet" className="w-6 h-6 mr-2" />
            <span className="font-afacad font-semibold text-[13px] sm:text-[14px] leading-[8.79px] tracking-[0.12px] text-[#313131]">
              Pet profile
            </span>
          </div>
          <span className="font-afacad font-normal text-[9px] sm:text-[10px] leading-[100%] tracking-[0.2px] text-[#636363]">
            Your pet's profiles are live and will show if anyone scans their tag.
          </span>
        </div>

        {/* Order More Tags Card */}
        <div className="w-full md:w-1/2 h-[110px] rounded-[11.72px] shadow-lg bg-white p-[12.21px] flex flex-col justify-between">
          <div>
            <span className="font-afacad font-semibold text-[13px] sm:text-[14px] leading-[100%] tracking-[0.12px] text-[#313131]">
              Order More Tags
            </span>
            <div className="font-afacad font-normal text-[9px] sm:text-[10px] leading-[100%] tracking-[0.2px] text-[#636363] mt-1">
              Need to add another pet to your Digital Tails account? We're excited to welcome them on board!
            </div>
          </div>
          <Link to="/order" className="flex items-center w-full sm:w-[111px] h-[32px] px-[11.29px] py-[4.34px] rounded-[6.95px] border border-[#4CB2E2] text-[#4CB2E2] font-afacad font-semibold text-[11px] sm:text-[12px] leading-[25.18px] tracking-[0.35px] bg-white mt-2">
            {/* Replace with your SVG/icon */}
            <svg width="23.4" height="21.7" className="pr-[7.81px]" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 22">
              <path d="M5 11h14M13 7l6 4-6 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Order Tags
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[750px] min-w-[280px] h-auto rounded-[20.84px] shadow-lg bg-white px-[18px] sm:px-[22px] py-[18px] sm:py-[22px] mt-8 flex flex-col justify-center">
        <div className="flex flex-col items-center text-center w-full">
          <div className="font-afacad font-semibold text-[15px] sm:text-[16px] leading-[20.84px] tracking-[0.28px] text-[#313131] mb-2">
            Get access to a Customer Support 24/7
          </div>
          <div className="font-afacad font-normal text-[12px] sm:text-[14px] leading-[100%] tracking-[0.35px] text-[#636363] mb-5">
            Speak with a customer support whenever you need help with our Digital Tails mobile app.
          </div>
          <button
            className="w-full sm:w-[133px] h-[38px] max-w-[1400px] px-[12px] rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[14px] sm:text-[15px] leading-[100%] tracking-[0.4px]"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  )
}

export default Overview
