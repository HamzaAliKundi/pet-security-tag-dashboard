import { useState } from 'react';

const VetDetailsTab = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
        <button className="flex items-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] sm:text-[15px] px-3 sm:px-4 py-2 rounded-[8px] w-full sm:w-auto">
          <svg width="18" height="18" fill="none" stroke="#FF4747" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>
          Delete
        </button>
        <button className="flex items-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] sm:text-[15px] px-3 sm:px-4 py-2 rounded-[8px] w-full sm:w-auto">
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          Add New Vet
        </button>
      </div>
      
      {/* Table view for all screen sizes */}
      <div className="overflow-x-auto w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
        <table className="min-w-[900px] w-full">
          <thead className="bg-white sticky top-0 z-10">
            <tr className="text-[#B0B0B0] font-afacad text-[12px] sm:text-[13px] border-b border-[#E0E0E0]">
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">NAME</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">NUMBER</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">ADDRESS</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">PRIMARY</th>
              <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-normal">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white rounded-[8px] shadow-sm border border-[#E0E0E0]">
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad font-semibold text-[14px] sm:text-[15px] text-[#222]">
                Dr. Smith Veterinary
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                65846924687
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                558 Manchester Road
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <span className="inline-flex items-center">
                  <span className="w-10 h-6 flex items-center bg-[#E6F6FE] rounded-full p-1 cursor-pointer">
                    <span className="w-4 h-4 bg-[#4CB2E2] rounded-full shadow transform transition-transform duration-200 translate-x-4"></span>
                  </span>
                </span>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="p-2 rounded-full hover:bg-[#E6F6FE] transition-colors"
                >
                  <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="18" r="1.5"/>
                  </svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-[8px] shadow-lg border border-[#E0E0E0] z-20">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-[#4CB2E2] hover:bg-[#E6F6FE] font-afacad text-[13px] sm:text-[14px] rounded-t-[8px] transition-colors">
                      <svg width="16" height="16" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit info
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-[#FF4747] hover:bg-[#ffd6d6] font-afacad text-[13px] sm:text-[14px] rounded-b-[8px] transition-colors">
                      <svg width="16" height="16" fill="none" stroke="#FF4747" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
            
            {/* Additional sample rows */}
            <tr className="bg-white rounded-[8px] shadow-sm border border-[#E0E0E0]">
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad font-semibold text-[14px] sm:text-[15px] text-[#222]">
                Happy Paws Clinic
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                +1-555-VET1
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                789 Pet Street, TX
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <span className="inline-flex items-center">
                  <span className="w-10 h-6 flex items-center bg-[#E0E0E0] rounded-full p-1 cursor-pointer">
                    <span className="w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"></span>
                  </span>
                </span>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 relative">
                <button className="p-2 rounded-full hover:bg-[#E6F6FE] transition-colors">
                  <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="18" r="1.5"/>
                  </svg>
                </button>
              </td>
            </tr>
            
            <tr className="bg-white rounded-[8px] shadow-sm border border-[#E0E0E0]">
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <input type="checkbox" className="w-4 h-4" />
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad font-semibold text-[14px] sm:text-[15px] text-[#222]">
                Animal Care Center
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                +1-555-CARE
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 font-afacad text-[14px] sm:text-[15px] text-[#222]">
                321 Animal Blvd, FL
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4">
                <span className="inline-flex items-center">
                  <span className="w-10 h-6 flex items-center bg-[#E0E0E0] rounded-full p-1 cursor-pointer">
                    <span className="w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"></span>
                  </span>
                </span>
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-4 relative">
                <button className="p-2 rounded-full hover:bg-[#E6F6FE] transition-colors">
                  <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="6" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="18" r="1.5"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VetDetailsTab;