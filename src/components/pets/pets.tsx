import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import ReplacementTagModal from './ReplacementTagModal';
import ViewPetModal from './ViewPetModal';
import { useGetUserPetsQuery } from '../../apis/user/users';
import { isPetComplete } from '../../utils/petValidation';

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
  
  // Fetch pets from API - refetch on mount to ensure fresh data
  const { data: petsData, isLoading, error, refetch } = useGetUserPetsQuery({ page: 1, limit: 10 }, { refetchOnMountOrArgChange: true });
  
  // Use real pets data or fallback to empty array
  const pets = petsData?.pets || [];

  // Check if any pets need updating
  const hasIncompletePets = pets.some(pet => !isPetComplete(pet));

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

  const truncatePetName = (name: string, maxLength: number = 10) => {
    if (!name) return 'Unnamed Pet';
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <div className="w-full max-w-[750px] mx-auto px-2 sm:px-0 py-6">
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-afacad font-semibold text-[22px] sm:text-[24px] text-[#222] mb-1">Manage your pets</h2>
        <p className="font-afacad text-[13px] sm:text-[15px] text-[#636363]">Edit your pet's details that will show when their tag is scanned.</p>
      </div>

      {/* Warning Banner if pets need updating */}
      {hasIncompletePets && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-afacad text-sm text-yellow-700">
                <strong>Update required:</strong> Some of your pets' information is incomplete. Please update their details so finders can identify them if lost.
              </p>
            </div>
          </div>
        </div>
      )}

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
      <div className="flex flex-col gap-5">
        {pets.length === 0 && !isLoading && !error && (
          <div className="text-center py-8">
            <div className="font-afacad text-[15px] text-[#636363]">No pets found. Complete an order to see your pets here.</div>
          </div>
        )}
        {pets.map((pet) => {
          const isComplete = isPetComplete(pet);
          return (
            <div key={pet._id} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-4 py-4 gap-4">
            {/* Incomplete Indicator Dot */}
            {!isComplete && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-afacad text-[10px] font-semibold">Needs update</span>
              </div>
            )}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img src={pet.image || "/overview/cat.svg"} alt={pet.petName} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              <div>
                <div className="font-afacad text-[13px] text-[#636363]">Pet's name</div>
                <div className="font-afacad font-semibold text-[16px] text-[#222]" title={pet.petName || 'Unnamed Pet'}>{truncatePetName(pet.petName)}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link to={`/edit-pet/${pet._id}`} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
                {/* Pencil Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M16.862 5.487l1.65-1.65a1.5 1.5 0 1 1 2.121 2.122l-1.65 1.65M15.44 6.91L5.5 16.85v2.65h2.65l9.94-9.94-2.65-2.65z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Edit information
              </Link>
              <button onClick={() => handleViewPet(pet)} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#d6f0fd] transition">
                {/* Eye Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View {truncatePetName(pet.petName)}'s details
              </button>
              <button onClick={() => handleReplacementOrder(pet)} className="flex items-center justify-center gap-2 bg-[#E6F6FE] text-[#4CB2E2] font-afacad font-semibold text-[14px] px-4 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto hover:bg-[#d6f0fd] transition">
                {/* Refresh Icon */}
                <svg width="18" height="18" fill="none" stroke="#4CB2E2" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h5M20 20v-5h-5"/><path d="M5.07 19A9 9 0 1 1 21 12.93"/></svg>
                Get replacement tag
              </button>
            </div>
            </div>
          );
        })}
      </div>

      {/* Add More Pets Card */}
      <div className="bg-white rounded-[16px] shadow-lg border border-[#E0E0E0] px-6 py-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">Need to add more pets?</div>
          <div className="font-afacad text-[13px] text-[#636363]">You can protect up to 5 pets with digital tails!</div>
        </div>
        <Link to="/order" className="flex items-center gap-2 border border-[#4CB2E2] text-[#4CB2E2] font-afacad font-semibold text-[15px] px-5 py-2 rounded-[8px] whitespace-nowrap w-full sm:w-auto">
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
