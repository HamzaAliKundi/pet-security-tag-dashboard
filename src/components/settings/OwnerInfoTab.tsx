import React from 'react';

const OwnerInfoTab = () => (
  <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-8">
    {/* Profile Section */}
    <div className="mb-6">
      <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">Profile</div>
      <div className="font-afacad text-[14px] text-[#636363] mb-4">We like to know who we're talking to; please enter your name so we know how to address you.</div>
      <div className="border-b border-[#E0E0E0]" />
    </div>
    {/* Form */}
    <form className="flex flex-col gap-6">
      <div>
        <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="firstName">First name</label>
        <input id="firstName" type="text" value="Zeeshan" className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" readOnly />
      </div>
      <div>
        <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="lastName">Last name</label>
        <input id="lastName" type="text" value="Gabbar" className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" readOnly />
      </div>
      <div>
        <label className="block font-afacad text-[14px] text-[#636363] mb-2" htmlFor="email">Email</label>
        <input id="email" type="email" value="zeeshaninfinitti@gmail.com" className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" readOnly />
      </div>
      <div className="pt-2">
        <button type="button" className="flex items-center gap-2 px-6 py-2.5 rounded-[8px] bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[16px] shadow-sm hover:bg-[#d0eefd] transition">
          {/* Check Icon */}
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          Save
        </button>
      </div>
    </form>
  </div>
);

export default OwnerInfoTab; 