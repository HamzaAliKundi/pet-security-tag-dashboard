import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY || '');

export type WalletStatus = 'loading' | 'ready' | 'unavailable';

interface WalletCheckoutProps {
  /** Amount in major units (e.g. 2.99). Converted to minor units internally. */
  amount: number;
  /** ISO currency code, any case (e.g. "GBP"). */
  currency: string;
  /** Blocks the wallet sheet from opening while true. */
  disabled?: boolean;
  /** Return false to stop the sheet opening (e.g. form validation failed). */
  validate?: () => boolean;
  /** Lets the parent show a loader / hide the section. */
  onStatusChange?: (status: WalletStatus) => void;
  /**
   * Called with a PaymentMethod id created from the wallet credential.
   * The parent then runs its normal flow: create the intent server-side and
   * confirm it with this payment method - exactly as the card path does.
   */
  onPaymentMethod: (paymentMethodId: string) => Promise<void>;
}

const WalletCheckoutInner: React.FC<Omit<WalletCheckoutProps, 'amount' | 'currency'>> = ({
  disabled,
  validate,
  onStatusChange,
  onPaymentMethod,
}) => {
  const stripe = useStripe() as Stripe | null;
  const elements = useElements() as StripeElements | null;

  // The wallet sheet only opens if resolve() is called, so validate first.
  const handleClick = ({ resolve }: { resolve: (opts?: Record<string, unknown>) => void }) => {
    if (disabled) return;
    if (validate && !validate()) return;
    // Contact/shipping details are collected by the surrounding form.
    resolve({
      emailRequired: false,
      phoneNumberRequired: false,
      shippingAddressRequired: false,
    });
  };

  const handleConfirm = async () => {
    if (!stripe || !elements) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message || 'Payment details could not be validated');
      return;
    }

    // Manual creation keeps the existing "payment method first" ordering that every
    // backend endpoint here already expects.
    const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({ elements });
    if (pmError || !paymentMethod) {
      toast.error(pmError?.message || 'Failed to create payment method');
      return;
    }

    await onPaymentMethod(paymentMethod.id);
  };

  return (
    <ExpressCheckoutElement
      options={{
        // Apple Pay only for now - flip googlePay to 'auto' to add Google Pay.
        paymentMethods: {
          applePay: 'auto',
          googlePay: 'never',
          klarna: 'never',
          link: 'never',
          paypal: 'never',
          amazonPay: 'never',
        },
        buttonType: { applePay: 'buy' },
        buttonHeight: 48,
      }}
      onReady={({ availablePaymentMethods }) => {
        onStatusChange?.(availablePaymentMethods ? 'ready' : 'unavailable');
      }}
      onLoadError={() => onStatusChange?.('unavailable')}
      onClick={handleClick}
      onConfirm={handleConfirm}
    />
  );
};

/**
 * Apple Pay button rendered in its own Elements instance.
 *
 * It deliberately does not share the Elements provider used by CardElement. Wallets
 * require Stripe's deferred-intent mode (amount/currency known up front), which the
 * legacy CardElement does not support, so the two run side by side and the existing
 * card flow is untouched.
 */
const WalletCheckout: React.FC<WalletCheckoutProps> = ({ amount, currency, ...rest }) => {
  // Stripe expects the smallest currency unit, matching the backend's Math.round(total * 100).
  const amountInMinorUnits = Math.round((Number(amount) || 0) * 100);
  const normalisedCurrency = (currency || '').toLowerCase();

  if (amountInMinorUnits <= 0 || !normalisedCurrency) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      // Currency is not updatable in place, so remount when it changes.
      key={normalisedCurrency}
      options={{
        mode: 'payment',
        amount: amountInMinorUnits,
        currency: normalisedCurrency,
        paymentMethodCreation: 'manual',
      }}
    >
      <WalletCheckoutInner {...rest} />
    </Elements>
  );
};

export default WalletCheckout;
