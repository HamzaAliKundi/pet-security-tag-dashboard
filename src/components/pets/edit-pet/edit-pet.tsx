import React, { useState } from 'react';

const EditPet = () => {
  const [hideName, setHideName] = useState(false);
  const [name, setName] = useState('Ellie');
  const [breed, setBreed] = useState('Domestic Short-hair X No');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medication, setMedication] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] px-2 py-8 flex flex-col items-center">
      <div className="w-full max-w-[900px] mx-auto">
        {/* Top Section */}
        <div className="mb-8">
          <div className="font-afacad font-semibold text-[18px] text-[#222] mb-1">Manage your pets</div>
          <div className="font-afacad text-[15px] text-[#636363]">Edit your pet's details that will show when their tag is scanned.</div>
        </div>

        {/* Card/Section */}
        <div className="bg-white rounded-[16px] py-8">
          {/* Update Info Header and Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="font-afacad font-semibold text-[20px] text-[#222]">Update information</div>
            <button type="button" className="flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-medium text-[15px] shadow-sm hover:bg-[#d0eefd] transition self-start sm:self-auto">
              <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
              Save information
            </button>
          </div>

          {/* Divider */}
          <hr className="border-[#E0E0E0] mb-8" />

          {/* Form Grid with lines after each row */}
          <form>
            {/* Row 1: Name & Breed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="petName">Name</label>
                <input id="petName" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
                <div className="flex items-center gap-2 mt-3">
                  <input id="hideName" type="checkbox" checked={hideName} onChange={e => setHideName(e.target.checked)} className="w-4 h-4 rounded border-[#E0E0E0] focus:ring-[#4CB2E2]" />
                  <label htmlFor="hideName" className="font-afacad font-bold text-[14px] text-[#636363] select-none cursor-pointer">Hide Name</label>
                </div>
              </div>
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="breed">Breed</label>
                <input id="breed" type="text" value={breed} onChange={e => setBreed(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
            </div>
            <hr className="border-[#E0E0E0] my-7" />
            {/* Row 2: Age & Allergies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="age">Age (in human years)</label>
                <input id="age" type="text" placeholder="Select age" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="allergies">Allergies</label>
                <input id="allergies" type="text" value={allergies} onChange={e => setAllergies(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
            </div>
            <hr className="border-[#E0E0E0] my-7" />
            {/* Row 3: Medication & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="medication">Medication</label>
                <input id="medication" type="text" value={medication} onChange={e => setMedication(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
              <div>
                <label className="block font-afacad font-bold text-[14px] text-[#636363] mb-2" htmlFor="notes">Notes</label>
                <input id="notes" type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full rounded-[8px] border border-[#E0E0E0] bg-white px-4 py-3 font-afacad text-[16px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPet;