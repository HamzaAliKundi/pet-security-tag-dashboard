import React, { useState } from 'react';

const VetDetailsTab = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="bg-white rounded-[16px] shadow-lg px-4 py-6 border border-[#E0E0E0]">
      <div className="flex justify-end gap-2 mb-4">
        <button className="flex items-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[15px] px-4 py-2 rounded-[8px]">
          <svg width="18" height="18" fill="none" stroke="#E57373" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>
          Delete
        </button>
        <button className="flex items-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[15px] px-4 py-2 rounded-[8px]">
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          Add New Vet
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="text-[#B0B0B0] font-afacad text-[13px]">
              <th className="py-3 px-4 text-left font-normal"><input type="checkbox" /></th>
              <th className="py-3 px-4 text-left font-normal">NAME</th>
              <th className="py-3 px-4 text-left font-normal">NUMBER</th>
              <th className="py-3 px-4 text-left font-normal">ADDRESS</th>
              <th className="py-3 px-4 text-left font-normal">PRIMARY</th>
              <th className="py-3 px-4 text-left font-normal">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white rounded-[16px] shadow-sm border border-[#E0E0E0]">
              <td className="py-3 px-4"><input type="checkbox" /></td>
              <td className="py-3 px-4 font-afacad font-semibold text-[15px] text-[#222]">Vet Name</td>
              <td className="py-3 px-4 font-afacad text-[15px] text-[#222]">65846924687</td>
              <td className="py-3 px-4 font-afacad text-[15px] text-[#222]">558 Manchester Road</td>
              <td className="py-3 px-4"><span className="inline-flex items-center"><span className="w-10 h-6 flex items-center bg-[#E6F6FE] rounded-full p-1 cursor-pointer"><span className="w-4 h-4 bg-[#4CB2E2] rounded-full shadow"></span></span></span></td>
              <td className="py-3 px-4 relative">
                <button onClick={() => setMenuOpen((v) => !v)} className="p-2 rounded-full hover:bg-[#E6F6FE]">
                  <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-[#E6F6FE] rounded-[8px] shadow-lg z-10">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-[#4CB2E2] hover:bg-[#d0eefd] font-afacad text-[14px]">
                      <svg width="16" height="16" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M7 11l5 5 5-5"/></svg>
                      Edit info
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-[#FF4747] hover:bg-[#ffd6d6] font-afacad text-[14px]">
                      <svg width="16" height="16" fill="none" stroke="#FF4747" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VetDetailsTab; 