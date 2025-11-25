import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ReplacementTagModal from './ReplacementTagModal';
import ViewPetModal from './ViewPetModal';
import { useGetUserPetsQuery } from '../../apis/user/users';

// Mock pets for replacement tag modal (keeping original structure)
const mockPets = [
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPetForView, setSelectedPetForView] = useState<any>(null);
  
  // Fetch pets from API
  const { data: petsData, isLoading, error } = useGetUserPetsQuery({ page: 1, limit: 10 });
  
  // Use real pets data or fallback to empty array
  const pets = petsData?.pets || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedPetId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPetId(null);
  };

  const handleSelectPet = (id: number) => {
    setSelectedPetId(id.toString());
  };

  const handleOrder = () => {
    // TODO: Implement order logic
    setIsModalOpen(false);
    setSelectedPetId(null);
    // Optionally show a success message
  };

  const handleReplacementOrder = (pet: any) => {
    // Navigate to replacement order page with pet data
    window.location.href = `/replacement-order/${pet._id}`;
  };

  const handleViewPet = (pet: any) => {
    setSelectedPetForView(pet);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPetForView(null);
  };

  return (
    <div className="w-full max-w-[750px] mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="font-afacad font-semibold text-[22px] sm:text-[24px] lg:text-[26px] text-[#222] mb-2">Manage your pets</h2>
        <p className="font-afacad text-[13px] sm:text-[15px] text-[#636363]">Edit your pet's details that will show when their tag is scanned.</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="font-afacad text-[15px] text-[#636363]">Loading pets...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="font-afacad text-[15px] text-red-600">Error loading pets. Please try again.</div>
        </div>
      )}

      {/* Pet Cards */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {pets.length === 0 && !isLoading && !error && (
          <div className="text-center py-8 sm:py-12">
            <div className="font-afacad text-[15px] sm:text-[16px] text-[#636363]">No pets found. Complete an order to see your pets here.</div>
          </div>
        )}
        {pets.map((pet) => (
          <div key={pet._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-4 sm:px-5 lg:px-6 py-4 sm:py-5 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 sm:flex-initial">
              <img src={pet.image || "/overview/cat.svg"} alt={pet.petName} className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full object-cover border border-gray-200" />
              <div className="min-w-0 flex-1">
                <div className="font-afacad text-[12px] sm:text-[13px] text-[#636363] mb-1">Pet's name</div>
                <div className="font-afacad font-semibold text-[15px] sm:text-[16px] lg:text-[17px] text-[#222] break-words">{pet.petName}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full sm:w-auto sm:flex-shrink-0">
              <Link to={`/edit-pet/${pet._id}`} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#d6f0fd] transition-colors">
                {/* Pencil Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487l1.65-1.65a1.5 1.5 0 1 1 2.121 2.122l-1.65 1.65M15.44 6.91L5.5 16.85v2.65h2.65l9.94-9.94-2.65-2.65z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Edit information
              </Link>
              <button onClick={() => handleViewPet(pet)} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#d6f0fd] transition-colors">
                {/* Eye Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span className="hidden sm:inline">View {pet.petName}'s details</span>
                <span className="sm:hidden">View details</span>
              </button>
              <button onClick={() => handleReplacementOrder(pet)} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#d6f0fd] transition-colors">
                {/* Refresh Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.07 19A9 9 0 1 1 21 12.93"/></svg>
                Get replacement tag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Pets Card */}
      <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-4 sm:px-6 lg:px-8 py-5 sm:py-6 mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex-1 min-w-0">
          <div className="font-afacad font-semibold text-[15px] sm:text-[16px] lg:text-[17px] text-[#222] mb-1.5 sm:mb-2">Need to add more pets?</div>
          <div className="font-afacad text-[12px] sm:text-[13px] lg:text-[14px] text-[#636363]">You can protect up to 5 pets with digital tails!</div>
        </div>
        <Link to="/order" className="flex items-center justify-center gap-2 border border-[#4CB2E2] text-[#4CB2E2] font-afacad font-semibold text-[14px] sm:text-[15px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#E6F6FE] transition-colors flex-shrink-0">
          {/* Plus Icon */}
          <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>
          Order more tags
        </Link>
      </div>

      <ReplacementTagModal
        isOpen={isModalOpen}
        pets={mockPets}
        selectedPetId={selectedPetId ? parseInt(selectedPetId) : null}
        onSelectPet={handleSelectPet}
        onClose={handleCloseModal}
        onOrder={handleOrder}
      />
      
      <ViewPetModal
        isOpen={isViewModalOpen}
        pet={selectedPetForView}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default Pets;
