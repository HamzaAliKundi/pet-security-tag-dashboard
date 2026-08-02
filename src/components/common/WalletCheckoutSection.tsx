import React, { useState } from 'react';
import WalletCheckout, { WalletStatus } from './WalletCheckout';

interface WalletCheckoutSectionProps {
  amount: number;
  currency: string;
  disabled?: boolean;
  validate?: () => boolean;
  onPaymentMethod: (paymentMethodId: string) => Promise<void>;
  /** Text on the divider below the wallet button. */
  dividerLabel?: string;
}

/**
 * Apple Pay button plus its loading state and "or pay with card" divider.
 *
 * Drop this directly above an existing CardElement. It renders nothing at all when
 * the device cannot use Apple Pay, so the card form remains the only option.
 */
const WalletCheckoutSection: React.FC<WalletCheckoutSectionProps> = ({
  amount,
  currency,
  disabled,
  validate,
  onPaymentMethod,
  dividerLabel = 'Or pay with card',
}) => {
  const [status, setStatus] = useState<WalletStatus>('loading');
  const hasAmount = Math.round((Number(amount) || 0) * 100) > 0;

  if (!hasAmount) return null;

  return (
    <>
      {status === 'loading' && (
        <div className="w-full h-[48px] rounded-lg bg-gray-100 animate-pulse flex items-center justify-center gap-2 mb-3">
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Checking available payment methods...</span>
        </div>
      )}

      {/*
        Never use `display: none` here. Stripe Elements cannot initialise inside a
        display:none container, so onReady would never fire and the button could never
        appear. Clip it instead.
      */}
      <div className={status === 'ready' ? 'mb-3' : 'h-0 overflow-hidden opacity-0 pointer-events-none'}>
        <WalletCheckout
          amount={amount}
          currency={currency}
          disabled={disabled}
          validate={validate}
          onStatusChange={setStatus}
          onPaymentMethod={onPaymentMethod}
        />
      </div>

      {status === 'ready' && (
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500 uppercase tracking-wide">{dividerLabel}</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>
      )}
    </>
  );
};

export default WalletCheckoutSection;
