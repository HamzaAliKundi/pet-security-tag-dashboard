import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useConfirmQRSubscriptionPaymentMutation } from '../../apis/user/qrcode';
import toast from 'react-hot-toast';

// Get Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

// Check if Stripe key is configured
if (!import.meta.env.VITE_STRIPE_PUBLISH_KEY) {
  console.warn('VITE_STRIPE_PUBLISH_KEY is not set in environment variables');
}

interface SubscriptionModalProps {
  qrCode: {
    id: string;
    code: string;
    assignedPetName?: string;
  };
  onSuccess: (subscriptionType: 'monthly' | 'yearly' | 'lifetime', petId?: string) => void;
  onClose: () => void;
}

const SubscriptionForm: React.FC<{
  qrCode: SubscriptionModalProps['qrCode'];
  onSuccess: SubscriptionModalProps['onSuccess'];
  onClose: SubscriptionModalProps['onClose'];
}> = ({ qrCode, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [confirmQRSubscriptionPayment] = useConfirmQRSubscriptionPaymentMutation();

  const pricing = {
    monthly: { price: 2.75, label: 'Monthly', description: 'Billed every month' },
    yearly: { price: 28.99, label: 'Yearly', description: 'Billed every year' },
    lifetime: { price: 129.99, label: 'Lifetime', description: 'One-time payment' }
  };

  const handleSubscriptionSelect = async (type: 'monthly' | 'yearly' | 'lifetime') => {
    setSubscriptionType(type);
    setLoading(true);

    try {
      // This would call your backend to create a payment intent
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/qr/verify-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          qrCodeId: qrCode.id,
          subscriptionType: type,
        }),
      });

      const data = await response.json();

      if (data.payment) {
        setPaymentIntentId(data.payment.paymentIntentId);
        setClientSecret(data.payment.clientSecret);
        setShowPaymentForm(true);
      } else {
        throw new Error(data.message || 'Failed to create payment intent');
      }
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      toast.error(error.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe not ready:', { stripe: !!stripe, elements: !!elements, clientSecret: !!clientSecret });
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error('Card element not found');
      setLoading(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        console.error('Payment confirmation error:', error);
        toast.error(error.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm with backend
        await confirmQRSubscriptionPayment({
          qrCodeId: qrCode.id,
          paymentIntentId: paymentIntent.id,
          subscriptionType,
        }).unwrap();

        toast.success('Payment successful! QR code activated.');
        onSuccess(subscriptionType);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast.error(error.data?.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (showPaymentForm) {
    return (
      <div className="bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{pricing[subscriptionType].label} Subscription</p>
              <p className="text-sm text-gray-600">{pricing[subscriptionType].description}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-600">
                €{pricing[subscriptionType].price}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          <div className="mb-4">
            <label className="block font-afacad font-semibold text-[15px] text-[#222] mb-2">
              Payment Card*
            </label>
            
            {/* Stripe Card Element */}
            <div className="border border-[#E0E0E0] rounded-[8px] p-3 bg-[#FAFAFA]">
              <CardElement
                onReady={() => console.log('CardElement ready')}
                onChange={(event) => console.log('CardElement changed:', event)}
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

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!stripe || loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Pay €${pricing[subscriptionType].price}`}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Choose Your Subscription</h3>
      
      <div className="space-y-4 mb-6">
        {Object.entries(pricing).map(([type, details]) => (
          <div
            key={type}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              subscriptionType === type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSubscriptionType(type as 'monthly' | 'yearly' | 'lifetime')}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="subscription"
                    value={type}
                    checked={subscriptionType === type}
                    onChange={() => setSubscriptionType(type as 'monthly' | 'yearly' | 'lifetime')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <p className="font-medium">{details.label}</p>
                    <p className="text-sm text-gray-600">{details.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">£{details.price}</p>
                {type === 'yearly' && (
                  <p className="text-sm text-green-600">Save £4.01</p>
                )}
                {type === 'lifetime' && (
                  <p className="text-sm text-green-600">Best Value</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium mb-2">What's Included:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ 24/7 QR code activation</li>
          <li>✓ Lost pet notifications</li>
          <li>✓ Contact form for finders</li>
          <li>✓ Location sharing capability</li>
          <li>✓ Multiple pet support</li>
        </ul>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSubscriptionSelect(subscriptionType)}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : `Continue with ${pricing[subscriptionType].label}`}
        </button>
      </div>
    </div>
  );
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ qrCode, onSuccess, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Activate QR Code</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <Elements stripe={stripePromise}>
          <SubscriptionForm qrCode={qrCode} onSuccess={onSuccess} onClose={onClose} />
        </Elements>
      </div>
    </div>
  );
};

export default SubscriptionModal;
