import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCreatePetTagOrderMutation, useConfirmPaymentMutation, useGetUserPetCountQuery, useGetSingleUserQuery, useValidateDiscountMutation } from '../../apis/user/users';
import { useLocalization } from '../../context/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { isUserSettingsComplete } from '../../utils/settingsValidation';
import toast from 'react-hot-toast';

// Tag price is now retrieved from LocalizationContext

// Initialize Stripe using environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

// Check if Stripe key is configured
if (!import.meta.env.VITE_STRIPE_PUBLISH_KEY) {
  console.warn('VITE_STRIPE_PUBLISH_KEY is not set in environment variables');
}

// Payment Form Component
const PaymentForm = ({ 
  quantity, 
  petName, 
  totalCost, 
  tagColor, 
  tagColors,
  phone, 
  street, 
  city, 
  state, 
  zipCode, 
  country, 
  countryCode,
  onClose, 
  onSuccess,
  onFormChange,
  onTagColorChange,
  onCountryCodeChange
}: {
  quantity: number;
  petName: string;
  totalCost: { amount: number; currency: string; symbol: string };
  tagColor: string;
  tagColors: string[];
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  countryCode: string;
  onClose: () => void;
  onSuccess: (orderData: any) => void;
  onFormChange: (field: string, value: string) => void;
  onTagColorChange: (index: number, color: string) => void;
  onCountryCodeChange: (code: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // RTK Query hooks
  const [createPetTagOrder] = useCreatePetTagOrderMutation();
  const [confirmPayment] = useConfirmPaymentMutation();

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

      // Combine country code with phone number
      const fullPhoneNumber = `${countryCode}${phone}`;

      // Ensure tagColors array matches quantity exactly
      let finalTagColors: string[];
      if (quantity === 1) {
        finalTagColors = [tagColor];
      } else {
        if (tagColors.length >= quantity) {
          finalTagColors = tagColors.slice(0, quantity);
        } else {
          finalTagColors = [...tagColors, ...Array(quantity - tagColors.length).fill('blue')];
        }
      }

      const orderResult = await createPetTagOrder({
        quantity,
        petName,
        totalCostEuro: totalCost.amount, // Send amount in user's currency (no conversion needed)
        currency: totalCost.currency.toLowerCase(), // Send currency from LocalizationContext
        tagColor: quantity === 1 ? tagColor : undefined, // Keep for backward compatibility
        tagColors: finalTagColors, // Array of colors for each tag
        phone: fullPhoneNumber,
        street,
        city,
        state,
        zipCode,
        country
      }).unwrap();

      // Confirm the payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(orderResult.payment.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed');
        setIsProcessing(false);
        return;
      }

      // Payment successful - confirm with backend
      await confirmPayment({
        orderId: orderResult.order._id,
        paymentData: {
          paymentIntentId: orderResult.payment.paymentIntentId
        }
      }).unwrap();

      // Payment successful
      onSuccess(orderResult);
    } catch (err: any) {
      setError(err?.data?.message || err?.message || 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[16px] shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-afacad font-semibold text-[24px] text-[#222]">Complete Your Order</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-afacad font-semibold text-[16px] text-[#222] mb-2">Order Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Pet Name:</strong> {petName}</p>
                <p><strong>Quantity:</strong> {quantity} tag(s)</p>
                {quantity === 1 ? (
                  <p><strong>Tag Color:</strong> {tagColor}</p>
                ) : (
                  <p><strong>Tag Colors:</strong> {tagColors.slice(0, quantity).join(', ')}</p>
                )}
                <p><strong>Total Cost:</strong> {totalCost.symbol}{totalCost.amount.toFixed(2)} {totalCost.currency}</p>
              </div>
            </div>

            {/* Tag Color Selection */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                {quantity === 1 ? 'Tag Color*' : 'Select Color for Each Tag*'}
              </label>
              {quantity === 1 ? (
                <select
                  value={tagColor}
                  onChange={(e) => onFormChange('tagColor', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                >
                  <option value="">Select tag color</option>
                  <option value="blue">Blue</option>
                  <option value="pink">Pink</option>
                  <option value="yellow">Yellow</option>
                </select>
              ) : (
                <div className="space-y-3">
                  {Array.from({ length: quantity }).map((_, index) => (
                    <div key={index} className="border border-[#E0E0E0] rounded-lg p-3">
                      <label className="block font-afacad font-semibold text-[13px] text-[#222] mb-2">
                        Tag {index + 1} Color
                      </label>
                      <select
                        value={tagColors[index] || 'blue'}
                        onChange={(e) => onTagColorChange(index, e.target.value)}
                        className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-2 font-afacad text-[14px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                        required
                      >
                        <option value="blue">Blue</option>
                        <option value="pink">Pink</option>
                        <option value="yellow">Yellow</option>
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Phone Number*
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => onCountryCodeChange(e.target.value)}
                  className="rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-3 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  style={{ width: '120px' }}
                >
                  <option value="+44">+44 (UK)</option>
                  <option value="+1">+1 (USA)</option>
                  <option value="+1">+1 (Canada)</option>
                </select>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => onFormChange('phone', e.target.value)}
                  className="flex-1 rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Street Address*
              </label>
              <input
                type="text"
                placeholder="Enter street address"
                value={street}
                onChange={(e) => onFormChange('street', e.target.value)}
                className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                required
              />
            </div>

            {/* City and State Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  City*
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => onFormChange('city', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  State / County*
                </label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => onFormChange('state', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
            </div>

            {/* Zip Code and Country Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  Zip Code / Postal Code*
                </label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  value={zipCode}
                  onChange={(e) => onFormChange('zipCode', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                />
              </div>
              <div>
                <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                  Country*
                </label>
                <select
                  value={country}
                  onChange={(e) => onFormChange('country', e.target.value)}
                  className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition"
                  required
                >
                  <option value="" disabled>Select Country</option>
                  <option value="United States">United States</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>

            {/* Payment Card */}
            <div>
              <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
                Payment Card*
              </label>
              
              {/* Stripe Card Element */}
              <div className="border border-[#E0E0E0] rounded-[8px] p-3 bg-[#FAFAFA]">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#222',
                        fontFamily: 'Afacad, sans-serif',
                        '::placeholder': {
                          color: '#636363',
                        },
                        iconColor: '#4CB2E2',
                      },
                      invalid: {
                        color: '#e53e3e',
                        iconColor: '#e53e3e',
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>
              
              <div className="mt-2 text-xs text-[#636363]">
                Your card details are securely processed by Stripe
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full py-3 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[17px] shadow-md hover:bg-[#38a1d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ${totalCost.symbol}${totalCost.amount.toFixed(2)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Order = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const [tagColor, setTagColor] = useState('blue');
  const [tagColors, setTagColors] = useState<string[]>(['blue']);
  const [formData, setFormData] = useState({
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Get user's pet count for limit validation
  const { data: petCountData, isLoading: petCountLoading } = useGetUserPetCountQuery();
  const { shippingPrice, tagPrice, isLocalizing } = useLocalization();
  
  // Fetch user data to check if settings are complete
  // @ts-ignore
  const { data: userData, isLoading: isLoadingUser } = useGetSingleUserQuery();
  
  // Discount state
  const [discountCode, setDiscountCode] = useState('');
  const [isDiscountValid, setIsDiscountValid] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [validateDiscount, { isLoading: isValidatingDiscount }] = useValidateDiscountMutation();
  
  // Calculate totals
  const tagSubtotal = tagPrice.amount * quantity;
  // Shipping is free if discount is applied, otherwise use regular shipping price
  const shippingCost = (isDiscountApplied && isDiscountValid) ? 0 : shippingPrice.amount;
  const totalAmount = tagSubtotal + shippingCost;
  
  const currentPetCount = petCountData?.data?.currentCount || 0;
  const maxAllowed = petCountData?.data?.maxAllowed || 5;
  const canOrderMore = petCountData?.data?.canOrderMore || false;
  const remainingSlots = petCountData?.data?.remainingSlots || 0;
  
  // Check if user settings are complete
  const isSettingsComplete = userData?.user ? isUserSettingsComplete(userData.user) : false;

  const handleCompleteOrder = () => {
    if (!petName.trim()) {
      toast.error('Please enter a pet name');
      return;
    }

    // Check if user settings are complete
    if (userData?.user && !isUserSettingsComplete(userData.user)) {
      toast.error('Please complete your profile settings before placing an order. Redirecting to settings...');
      setTimeout(() => {
        navigate('/settings');
      }, 2000);
      return;
    }

    // Check if user can order more pets
    if (!canOrderMore) {
      toast.error(`You have reached the maximum limit of ${maxAllowed} pet tags per account.`);
      return;
    }

    // Check if the requested quantity exceeds remaining slots
    if (quantity > remainingSlots) {
      toast.error(`You can only order ${remainingSlots} more pet tag(s). You currently have ${currentPetCount} pets and the maximum is ${maxAllowed}.`);
      return;
    }

    setShowModal(true);
  };

  // Handle quantity changes - update tagColors array
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > quantity) {
      // Adding tags - add default color
      setTagColors(prev => [...prev, ...Array(newQuantity - quantity).fill('blue')]);
    } else if (newQuantity < quantity) {
      // Removing tags - remove last colors
      setTagColors(prev => prev.slice(0, newQuantity));
    }
    setQuantity(newQuantity);
  };

  const handleFormChange = (field: string, value: string) => {
    if (field === 'tagColor') {
      setTagColor(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTagColorChange = (index: number, color: string) => {
    setTagColors(prev => {
      const newColors = [...prev];
      newColors[index] = color;
      return newColors;
    });
  };

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    try {
      const result = await validateDiscount(discountCode.trim()).unwrap();
      
      if (result.valid) {
        setIsDiscountValid(true);
        setIsDiscountApplied(true);
        setDiscountError('');
        toast.success('Discount code applied successfully!');
      } else {
        setIsDiscountValid(false);
        setIsDiscountApplied(false);
        setDiscountError(result.message || 'Invalid discount code');
      }
    } catch (error: any) {
      setIsDiscountValid(false);
      setIsDiscountApplied(false);
      const errorMessage = error?.data?.message || 'Failed to validate discount code';
      setDiscountError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleOrderSuccess = (orderData: any) => {
    setShowModal(false);
    navigate('/order-summary', { state: { orderData } });
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fafbfc] to-[#f8fafd]">
      {/* Title & Subtitle */}
      <div className="mb-8 text-center">
        <div className="font-afacad font-semibold text-[24px] text-[#222] mb-2">Order more tags</div>
        <div className="font-afacad text-[15px] text-[#636363]">You can protect up to 5 pets with digital tails!</div>
        
        {/* Pet Limit Status & Settings Warning */}
        {!petCountLoading && (
          <div className="mt-4 space-y-3 max-w-md mx-auto">
            {!isSettingsComplete && !isLoadingUser && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-afacad text-[14px] text-red-800">
                  <span className="font-semibold">⚠️ Profile Incomplete:</span> Please complete your profile settings before placing an order.
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="mt-2 text-sm text-red-600 underline font-semibold hover:text-red-800"
                >
                  Go to Settings
                </button>
              </div>
            )}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="font-afacad text-[14px] text-blue-800">
                <span className="font-semibold">Pet Tags Status:</span> {currentPetCount}/{maxAllowed} used
                {remainingSlots > 0 && (
                  <span className="text-blue-600"> • {remainingSlots} slots remaining</span>
                )}
              </div>
              {!canOrderMore && (
                <div className="font-afacad text-[13px] text-red-600 mt-1">
                  ⚠️ You have reached the maximum limit of {maxAllowed} pet tags per account.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] shadow-lg px-6 py-7 w-full max-w-[670px]">
        {/* How many tags */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">How many tags do you need?</div>
          {/* <div className="font-afacad text-[13px] text-[#636363]">Dispatched today if you order in the next: <span className="font-semibold text-[#222]">2 hours, 13 minutes</span></div> */}
        </div>
        <hr className="my-4 border-[#E0E0E0]" />

        {/* Quantity Selector */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[15px] text-[#222] mb-2">Quantity:</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-white shadow-sm transition ${
                !canOrderMore || quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#f3f3f3]'
              }`}
              onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              disabled={!canOrderMore || quantity <= 1}
              aria-label="Decrease quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 12h12"/></svg>
            </button>
            <span className="w-8 text-center font-afacad font-semibold text-[16px]">{quantity}</span>
            <button
              type="button"
              className={`w-9 h-9 flex items-center justify-center rounded-[8px] shadow-sm transition ${
                !canOrderMore || quantity >= remainingSlots ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-[#4CB2E2] hover:bg-[#38a1d6]'
              }`}
              onClick={() => handleQuantityChange(Math.min(remainingSlots, quantity + 1))}
              disabled={!canOrderMore || quantity >= remainingSlots}
              aria-label="Increase quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg>
            </button>
          </div>
        </div>

        {/* Pet Name Input */}
        <input
          type="text"
          placeholder="Pet Name"
          className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition mb-4"
          value={petName}
          onChange={e => setPetName(e.target.value)}
        />

        {/* Discount Code Input */}
        <div className="mb-4">
          <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
            Discount Code (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => {
                setDiscountCode(e.target.value);
                setDiscountError('');
                setIsDiscountValid(false);
                setIsDiscountApplied(false);
              }}
              placeholder="Enter discount code"
              className={`flex-1 rounded-[8px] border px-4 py-3 font-afacad text-[15px] shadow-sm focus:outline-none transition ${
                discountError ? 'border-red-500' : isDiscountValid ? 'border-green-500' : 'border-[#E0E0E0]'
              } bg-[#FAFAFA] text-[#222] focus:border-[#4CB2E2]`}
              disabled={isValidatingDiscount}
            />
            <button
              type="button"
              onClick={handleApplyDiscount}
              disabled={!discountCode.trim() || isValidatingDiscount || isDiscountApplied}
              className={`px-6 py-3 rounded-[8px] font-afacad font-semibold text-[15px] transition ${
                !discountCode.trim() || isValidatingDiscount || isDiscountApplied
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#4CB2E2] text-white hover:bg-[#38a1d6]'
              }`}
            >
              {isValidatingDiscount ? 'Checking...' : isDiscountApplied ? 'Applied' : 'Apply'}
            </button>
          </div>
          {discountError && (
            <span className="text-red-500 text-sm mt-1 block">{discountError}</span>
          )}
          {isDiscountValid && isDiscountApplied && (
            <span className="text-green-600 text-sm mt-1 block">✓ Discount code applied successfully!</span>
          )}
        </div>

        {/* Order Summary */}
        <div className="divide-y divide-[#E0E0E0] mb-6">
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#222]">
            <span>{quantity}x Digital Tails Tag @ {isLocalizing ? '...' : `${tagPrice.symbol}${tagPrice.amount.toFixed(2)}`}</span>
            <span>{isLocalizing ? '...' : `${tagPrice.symbol}${tagSubtotal.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#636363]">
            <span>Shipping & Handling</span>
            <span>
              {isLocalizing ? '...' : (isDiscountApplied && isDiscountValid) ? 'Free' : `${shippingPrice.symbol}${shippingPrice.amount.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad font-semibold text-[16px] text-[#222]">
            <span>Total</span>
            <span>
              {isLocalizing ? '...' : `${tagPrice.symbol}${totalAmount.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Complete Order Button */}
        <button
          type="button"
          onClick={handleCompleteOrder}
          disabled={!canOrderMore || petCountLoading || !isSettingsComplete || isLoadingUser}
          className={`w-full py-3 rounded-[8px] font-afacad font-semibold text-[17px] shadow-md transition ${
            !canOrderMore || petCountLoading || !isSettingsComplete || isLoadingUser
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-[#4CB2E2] text-white hover:bg-[#38a1d6]'
          }`}
        >
          {petCountLoading || isLoadingUser ? 'Loading...' : !isSettingsComplete ? 'Complete Profile First' : !canOrderMore ? 'Limit Reached' : 'Complete Order'}
        </button>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            quantity={quantity}
            petName={petName}
            totalCost={{ amount: totalAmount, currency: tagPrice.currency, symbol: tagPrice.symbol }}
            tagColor={tagColor}
            tagColors={tagColors}
            phone={formData.phone}
            street={formData.street}
            city={formData.city}
            state={formData.state}
            zipCode={formData.zipCode}
            country={formData.country}
            countryCode={countryCode}
            onClose={() => setShowModal(false)}
            onSuccess={handleOrderSuccess}
            onFormChange={handleFormChange}
            onTagColorChange={handleTagColorChange}
            onCountryCodeChange={setCountryCode}
          />
        </Elements>
      )}
    </div>
  );
};

export default Order;