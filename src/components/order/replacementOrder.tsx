import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useGetPetQuery } from '../../apis/user/users';
import { useLocalization } from '../../context/LocalizationContext';

const TAG_PRICE = 0; // Tags are free

// Initialize Stripe using environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

// Payment Form Component for Replacement Order
const ReplacementPaymentForm = ({ 
  petId,
  petName, 
  totalCost, 
  tagColor, 
  phone, 
  street, 
  city, 
  state, 
  zipCode, 
  country, 
  onClose, 
  onSuccess,
  onFormChange
}: {
  petId: string;
  petName: string;
  totalCost: { amount: number; currency: string; symbol: string };
  tagColor: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  onClose: () => void;
  onSuccess: (orderData: any) => void;
  onFormChange: (field: string, value: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Get the payment method from Stripe Elements
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // Create replacement order using the new endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/pets/${petId}/replacement-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          tagColor,
          phone,
          street,
          city,
          state,
          zipCode,
          country
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create replacement order');
      }

      const orderResult = await response.json();

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(orderResult.payment.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        setIsProcessing(false);
        return;
      }

      // Confirm payment on backend using the new replacement endpoint
      const confirmResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/replacement-orders/${orderResult.order._id}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          paymentIntentId: orderResult.payment.paymentIntentId,
          petId: petId
        })
      });

      if (!confirmResponse.ok) {
        const errorData = await confirmResponse.json();
        throw new Error(errorData.message || 'Failed to confirm payment');
      }

      onSuccess(orderResult);
    } catch (err: any) {
      setError(err.message || 'Order failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Complete Replacement Order</h3>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Order Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>1x Digital Tails Tag</span>
            <span className="font-semibold">FREE</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping & Handling</span>
            <span>{totalCost.symbol}{totalCost.amount.toFixed(2)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{totalCost.symbol}{totalCost.amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tag Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tag Color</label>
          <select
            value={tagColor}
            onChange={(e) => onFormChange('tagColor', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select tag color</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
          </select>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onFormChange('phone', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        {/* Address Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            type="text"
            value={street}
            onChange={(e) => onFormChange('street', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => onFormChange('city', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="New York"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => onFormChange('state', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="NY"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => onFormChange('zipCode', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => onFormChange('country', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="United States"
              required
            />
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Information</label>
          <div className="p-3 border border-gray-300 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

const ReplacementOrder = () => {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tagColor: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Fetch pet data
  const { data: petData, isLoading, error } = useGetPetQuery(petId || '');
  const { shippingPrice, isLocalizing } = useLocalization();

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOrderSuccess = (orderData: any) => {
    alert('Replacement order completed successfully! Your new tag will be shipped soon.');
    navigate('/pets');
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading pet information...</div>
        </div>
      </div>
    );
  }

  if (error || !petData?.pet) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">Pet not found or error loading data.</div>
          <button 
            onClick={() => navigate('/pets')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Pets
          </button>
        </div>
      </div>
    );
  }

  const pet = petData.pet;

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fafbfc] to-[#f8fafd] py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="font-afacad font-semibold text-[24px] text-[#222] mb-2">
          Replacement Tag Order
        </div>
        <div className="font-afacad text-[15px] text-[#636363]">
          Ordering a replacement tag for <span className="font-semibold">{pet.petName}</span>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-[16px] shadow-lg px-6 py-7 w-full max-w-[670px] mb-6">
        <div className="text-center mb-6">
          <h2 className="font-afacad font-semibold text-[20px] text-[#222] mb-2">
            Replacement Tag Order
          </h2>
          <p className="font-afacad text-[14px] text-[#636363]">
            Your existing tag will be deactivated when this order is processed.
          </p>
        </div>

        {/* Pet Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-afacad font-semibold text-[16px] text-[#222] mb-2">Pet Information</h3>
          <div className="flex items-center gap-3">
            <img 
              src={pet.image || "/overview/cat.svg"} 
              alt={pet.petName} 
              className="w-12 h-12 rounded-full object-cover border border-gray-200" 
            />
            <div>
              <div className="font-afacad font-semibold text-[16px] text-[#222]">{pet.petName}</div>
              <div className="font-afacad text-[14px] text-[#636363]">
                {pet.breed || 'Mixed Breed'} {pet.age ? `• ${pet.age} years old` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-afacad font-semibold text-[16px] text-[#222] mb-3">Order Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-afacad text-[14px] text-[#636363]">1x Digital Tails Tag</span>
              <span className="font-afacad font-semibold text-[14px] text-[#222]">FREE</span>
            </div>
            <div className="flex justify-between">
              <span className="font-afacad text-[14px] text-[#636363]">Shipping & Handling</span>
              <span className="font-afacad text-[14px] text-[#222]">
                {isLocalizing ? '...' : `${shippingPrice.symbol}${shippingPrice.amount.toFixed(2)}`}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="font-afacad font-semibold text-[16px] text-[#222]">Total</span>
              <span className="font-afacad font-semibold text-[16px] text-[#222]">
                {isLocalizing ? '...' : `${shippingPrice.symbol}${shippingPrice.amount.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-[#4CB2E2] hover:bg-[#3da1d1] text-white font-afacad font-semibold text-[16px] px-6 py-3 rounded-[8px] transition"
        >
          Complete Order
        </button>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Elements stripe={stripePromise}>
              <ReplacementPaymentForm
                petId={petId || ''}
                petName={pet.petName}
                totalCost={shippingPrice}
                tagColor={formData.tagColor}
                phone={formData.phone}
                street={formData.street}
                city={formData.city}
                state={formData.state}
                zipCode={formData.zipCode}
                country={formData.country}
                onClose={() => setShowModal(false)}
                onSuccess={handleOrderSuccess}
                onFormChange={handleFormChange}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReplacementOrder;
