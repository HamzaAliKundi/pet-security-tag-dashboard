import React from 'react'

const Settings = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      {/* Account Title */}
      <div className="font-afacad font-semibold text-[20px] text-[#222] mb-6 text-left">Account</div>
      {/* Tabs */}
      <div className="flex items-center border-b border-[#E0E0E0] mb-8">
        {/* Owner Information Tab (Active) */}
        <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-[#4CB2E2] text-[#4CB2E2] font-afacad font-medium text-[16px] focus:outline-none">
          {/* User Icon */}
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          Owner information
        </button>
        {/* Contact Details Tab */}
        <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-[#B0B0B0] font-afacad font-medium text-[16px] hover:text-[#4CB2E2] focus:outline-none">
          {/* Contact Icon */}
          <svg width="18" height="18" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
          Contact Details
        </button>
        {/* Vet Details Tab */}
        <button className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-[#B0B0B0] font-afacad font-medium text-[16px] hover:text-[#4CB2E2] focus:outline-none">
          {/* Location Icon */}
          <svg width="18" height="18" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="4"/><path d="M12 14v7"/><path d="M12 21c-4-4-8-7-8-11a8 8 0 0 1 16 0c0 4-4 7-8 11z"/></svg>
          Vet Details
        </button>
      </div>

      {/* Card */}
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
    </div>
  )
}

export default Settings
