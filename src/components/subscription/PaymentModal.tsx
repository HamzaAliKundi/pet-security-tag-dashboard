import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useRenewSubscriptionMutation, useUpgradeSubscriptionMutation, useConfirmSubscriptionPaymentMutation } from '../../apis/user/qrcode';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

if (!import.meta.env.VITE_STRIPE_PUBLISH_KEY) {
  console.warn('VITE_STRIPE_PUBLISH_KEY is not set in environment variables');
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
  subscriptionType: string;
  amount: number;
  currency: string;
  action: 'renewal' | 'upgrade';
  newType?: string;
}

const PaymentForm: React.FC<{
  subscriptionId: string;
  subscriptionType: string;
  amount: number;
  currency: string;
  action: 'renewal' | 'upgrade';
  newType?: string;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ subscriptionId, subscriptionType, amount, currency, action, newType, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isElementsReady, setIsElementsReady] = useState(false);
  
  const [renewSubscription] = useRenewSubscriptionMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const [confirmPayment] = useConfirmSubscriptionPaymentMutation();

  // Handle Elements ready state
  useEffect(() => {
    if (elements) {
      setIsElementsReady(true);
    }
  }, [elements]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !isElementsReady) {
      toast.error('Payment form is not ready. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const paymentIntentResponse = action === 'renewal' 
        ? await renewSubscription({ subscriptionId }).unwrap()
        : await upgradeSubscription({ subscriptionId, newType: newType! }).unwrap();

      if (!paymentIntentResponse.payment?.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentResponse.payment.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        }
      );

      if (error) {
        toast.error(error.message || 'Payment failed');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await confirmPayment({
          subscriptionId,
          paymentIntentId: paymentIntent.id,
          action,
          newType
        }).unwrap();

        toast.success(`Subscription ${action} successful!`);
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-afacad font-semibold text-[16px] text-[#222]">
                {action === 'renewal' ? 'Renew Subscription' : 'Upgrade Subscription'}
              </h3>
              <p className="font-afacad text-[14px] text-[#636363] mt-1">
                {action === 'renewal' 
                  ? `Renew your ${subscriptionType} plan`
                  : `Upgrade to ${newType} plan`
                }
              </p>
            </div>
            <div className="text-right">
              <div className="font-afacad font-bold text-[20px] text-[#222]">
                {currency} {amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-afacad font-semibold text-[14px] text-[#222] flex items-center">
            <CreditCard className="w-4 h-4 mr-2" />
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-3 bg-white min-h-[50px]">
            {isElementsReady ? (
              <CardElement 
                options={cardElementOptions}
                className="w-full"
              />
            ) : (
              <div className="flex items-center justify-center h-8">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Loading payment form...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-afacad font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || !isElementsReady || isProcessing}
          className="flex-1 px-4 py-3 bg-[#4CB2E2] text-white rounded-lg font-afacad font-medium hover:bg-[#38a1d6] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {action === 'renewal' ? 'Renew Now' : 'Upgrade Now'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  subscriptionId,
  subscriptionType,
  amount,
  currency,
  action,
  newType
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    // Refresh subscription data
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-afacad font-bold text-[20px] text-[#222]">
            {action === 'renewal' ? 'Renew Subscription' : 'Upgrade Subscription'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <Elements stripe={stripePromise} key={subscriptionId}>
            <PaymentForm
              subscriptionId={subscriptionId}
              subscriptionType={subscriptionType}
              amount={amount}
              currency={currency}
              action={action}
              newType={newType}
              onSuccess={handleSuccess}
              onClose={onClose}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
