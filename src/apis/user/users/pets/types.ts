export interface Pet {
  _id: string;
  userId: string;
  userPetTagOrderId: string;
  petName: string;
  hideName: boolean;
  age?: number;
  breed: string;
  medication: string;
  allergies: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetResponse {
  message: string;
  status: number;
  pet: Pet;
}

export interface PetsResponse {
  message: string;
  status: number;
  pets: Pet[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPets: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UpdatePetRequest {
  petName?: string;
  hideName?: boolean;
  age?: number;
  breed?: string;
  medication?: string;
  allergies?: string;
  notes?: string;
}
