/**
 * Utility function to check if a pet's information is complete/updated
 * A pet is considered complete if key fields are filled:
 * - petName must be filled
 * - breed should be filled (important for finders)
 */
export const isPetComplete = (pet: any): boolean => {
  if (!pet) {
    return false;
  }

  // Check if petName is filled
  const hasName = pet.petName && typeof pet.petName === 'string' && pet.petName.trim().length > 0;
  
  // Check if breed is filled (important for identification)
  const hasBreed = pet.breed && typeof pet.breed === 'string' && pet.breed.trim().length > 0;

  // Pet is complete if it has both name and breed
  return hasName && hasBreed;
};

