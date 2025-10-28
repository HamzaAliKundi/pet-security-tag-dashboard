export interface PetTagOrderRequest {
  quantity: number;
  petName: string;
  totalCostEuro: number;
  tagColor: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isReplacement?: boolean;
}

export interface PetTagOrderResponse {
  message: string;
  status: number;
  order: {
    _id: string;
    petName: string;
    quantity: number;
    totalCostEuro: number;
    tagColor: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    status: string;
    paymentStatus: string;
    paymentIntentId: string;
    createdAt: string;
  };
  payment: {
    paymentIntentId: string;
    clientSecret: string;
    publishableKey: string;
  };
}

export interface PetTagOrder {
  _id: string;
  userId: string;
  quantity: number;
  petName: string;
  totalCostEuro: number;
  tagColor: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentIntentId?: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PetTagOrdersResponse {
  message: string;
  status: number;
  orders: PetTagOrder[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  message: string;
  status: number;
  order: PetTagOrder;
}
