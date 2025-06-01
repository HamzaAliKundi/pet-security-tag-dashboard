import React, { useState } from 'react';
import OwnerInfoTab from './OwnerInfoTab';
import ContactDetailsTab from './ContactDetailsTab';
import VetDetailsTab from './VetDetailsTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      {/* Account Title */}
      <div className="font-afacad font-semibold text-[20px] text-[#222] mb-6 text-left">Account</div>
      {/* Tabs */}
      <div className="flex items-center border-b border-[#E0E0E0] mb-8 overflow-x-auto">
        {/* Owner Information Tab */}
        <button
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-afacad font-medium text-[14px] sm:text-[16px] whitespace-nowrap focus:outline-none ${activeTab === 0 ? 'border-[#4CB2E2] text-[#4CB2E2]' : 'border-transparent text-[#B0B0B0] hover:text-[#4CB2E2]'}`}
          onClick={() => setActiveTab(0)}
        >
          <svg width="24" height="24" fill="none" stroke={activeTab === 0 ? '#4CB2E2' : '#B0B0B0'} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7"/></svg>
          Owner information
        </button>
        {/* Contact Details Tab */}
        <button
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-afacad font-medium text-[14px] sm:text-[16px] whitespace-nowrap focus:outline-none ${activeTab === 1 ? 'border-[#4CB2E2] text-[#4CB2E2]' : 'border-transparent text-[#B0B0B0] hover:text-[#4CB2E2]'}`}
          onClick={() => setActiveTab(1)}
        >
          <svg width="24" height="24" fill="none" stroke={activeTab === 1 ? '#4CB2E2' : '#B0B0B0'} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
          Contact Details
        </button>
        {/* Vet Details Tab */}
        <button
          className={`flex items-center gap-2 px-4 py-3 border-b-2 font-afacad font-medium text-[14px] sm:text-[16px] whitespace-nowrap focus:outline-none ${activeTab === 2 ? 'border-[#4CB2E2] text-[#4CB2E2]' : 'border-transparent text-[#B0B0B0] hover:text-[#4CB2E2]'}`}
          onClick={() => setActiveTab(2)}
        >
          <svg width="24" height="24" fill="none" stroke={activeTab === 2 ? '#4CB2E2' : '#B0B0B0'} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="10" r="4"/><path d="M12 14v7"/><path d="M12 21c-4-4-8-7-8-11a8 8 0 0 1 16 0c0 4-4 7-8 11z"/></svg>
          Vet Details
        </button>
      </div>
      {/* Tab Content */}
      {activeTab === 0 && <OwnerInfoTab />}
      {activeTab === 1 && <ContactDetailsTab />}
      {activeTab === 2 && <VetDetailsTab />}
    </div>
  );
};

export default Settings;
