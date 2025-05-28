import React from 'react'
import { Link } from 'react-router-dom';

const pets = [
  {
    id: 1,
    name: "Braddy",
    image: "/overview/cat.svg",
  },
  {
    id: 2,
    name: "Ellie's",
    image: "/overview/cat.svg",
  },
  {
    id: 3,
    name: "Ellie's",
    image: "/overview/cat.svg",
  },
  {
    id: 4,
    name: "Braddy",
    image: "/overview/cat.svg",
  },
];

const Pets = () => {
  return (
    <div className="w-full max-w-[750px] mx-auto px-2 sm:px-0 py-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-afacad font-semibold text-[22px] sm:text-[24px] text-[#222] mb-1">Manage your pets</h2>
        <p className="font-afacad text-[13px] sm:text-[15px] text-[#636363]">Edit your pet's details that will show when their tag is scanned.</p>
      </div>

      {/* Pet Cards */}
      <div className="flex flex-col gap-5">
        {pets.map((pet) => (
          <div key={pet.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-4 py-4 gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img src={pet.image} alt={pet.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              <div>
                <div className="font-afacad text-[13px] text-[#636363]">Pet's name</div>
                <div className="font-afacad font-semibold text-[16px] text-[#222]">{pet.name}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link to="/edit-pet"  className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
                {/* Pencil Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487l1.65-1.65a1.5 1.5 0 1 1 2.121 2.122l-1.65 1.65M15.44 6.91L5.5 16.85v2.65h2.65l9.94-9.94-2.65-2.65z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Edit information
              </Link>
              <button className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
                {/* Eye Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="9" ry="7"/><circle cx="12" cy="12" r="3"/></svg>
                View {pet.name}'s page
              </button>
              <button className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
                {/* Refresh Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.07 19A9 9 0 1 1 21 12.93"/></svg>
                Get replacement tag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Pets Card */}
      <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">Need to add more pets?</div>
          <div className="font-afacad text-[13px] text-[#636363]">You can protect as many pets as you like with Digital Tails Premium Plus.</div>
        </div>
        <button className="flex items-center gap-2 border border-[#4CB2E2] text-[#4CB2E2] font-afacad font-semibold text-[15px] px-5 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
          {/* Plus Icon */}
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          Order more tags
        </button>
      </div>
    </div>
  );
};

export default Pets;
