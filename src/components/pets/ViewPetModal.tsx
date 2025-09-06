import React from 'react';

interface ViewPetModalProps {
  isOpen: boolean;
  pet: any;
  onClose: () => void;
}

const ViewPetModal: React.FC<ViewPetModalProps> = ({ isOpen, pet, onClose }) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-[16px]">
          <h2 className="font-afacad font-semibold text-[20px] text-[#222]">Pet Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* Pet Image and Basic Info */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-[12px]">
            <img 
              src={pet.image || "/overview/cat.svg"} 
              alt={pet.petName} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" 
            />
            <div>
              <h3 className="font-afacad font-semibold text-[18px] text-[#222] mb-1">
                {pet.hideName ? 'Pet' : pet.petName}
              </h3>
              <p className="font-afacad text-[14px] text-[#636363]">
                {pet.breed || 'Mixed Breed'} {pet.age ? `• ${pet.age} years old` : ''}
              </p>
            </div>
          </div>

          {/* Pet Information Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
                <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Pet Name</label>
                <p className="font-afacad text-[16px] text-[#222]">{pet.petName || 'Not specified'}</p>
              </div>
              
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
                <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Breed</label>
                <p className="font-afacad text-[16px] text-[#222]">{pet.breed || 'Mixed Breed'}</p>
              </div>
              
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
                <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Age</label>
                <p className="font-afacad text-[16px] text-[#222]">{pet.age ? `${pet.age} years` : 'Not specified'}</p>
              </div>
              
              <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
                <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Name Visibility</label>
                <p className="font-afacad text-[16px] text-[#222]">{pet.hideName ? 'Hidden' : 'Visible'}</p>
              </div>
            </div>

            {/* Full width fields */}
            <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
              <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Allergies</label>
              <p className="font-afacad text-[16px] text-[#222]">{pet.allergies || 'None reported'}</p>
            </div>
            
            <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
              <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Medication</label>
              <p className="font-afacad text-[16px] text-[#222]">{pet.medication || 'None reported'}</p>
            </div>
            
            <div className="bg-white border border-[#E0E0E0] rounded-[8px] p-4">
              <label className="font-afacad font-semibold text-[14px] text-[#636363] mb-1 block">Notes</label>
              <p className="font-afacad text-[16px] text-[#222]">{pet.notes || 'No additional notes'}</p>
            </div>

            {/* Tag Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-[8px] p-4">
              <h4 className="font-afacad font-semibold text-[16px] text-[#222] mb-3">Tag Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-afacad font-semibold text-[12px] text-[#636363] mb-1 block">Status</label>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div>
                  <label className="font-afacad font-semibold text-[12px] text-[#636363] mb-1 block">Created</label>
                  <p className="font-afacad text-[14px] text-[#222]">
                    {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Owner Contact Information */}
            <div className="bg-gray-50 border border-gray-200 rounded-[8px] p-4">
              <h4 className="font-afacad font-semibold text-[16px] text-[#222] mb-3">Emergency Contact</h4>
              <div className="space-y-2 text-sm text-[#636363]">
                <p className="font-afacad">When this tag is scanned by someone who finds {pet.hideName ? 'this pet' : pet.petName}, they will be able to contact you through our secure platform.</p>
                <p className="font-afacad">Your personal contact details remain private and secure.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-[#E0E0E0]">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#636363] font-afacad font-semibold text-[14px] px-4 py-3 rounded-[8px] transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                // Navigate to edit page - you might want to pass a navigation function
                window.location.href = `/edit-pet/${pet._id}`;
              }}
              className="flex-1 bg-[#4CB2E2] hover:bg-[#3da1d1] text-white font-afacad font-semibold text-[14px] px-4 py-3 rounded-[8px] transition flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16.862 5.487l1.65-1.65a1.5 1.5 0 1 1 2.121 2.122l-1.65 1.65M15.44 6.91L5.5 16.85v2.65h2.65l9.94-9.94-2.65-2.65z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Pet Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPetModal;
