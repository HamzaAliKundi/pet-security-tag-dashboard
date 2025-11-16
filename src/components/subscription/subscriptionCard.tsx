import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, RotateCcw, TrendingUp } from 'lucide-react';
import { useGetUserSubscriptionsQuery, useGetSubscriptionStatsQuery, useRenewSubscriptionMutation, useUpgradeSubscriptionMutation } from '../../apis/user/qrcode';
import { useLocalization } from '../../context/LocalizationContext';
import PaymentModal from './PaymentModal';
import PlanSelectionModal from './PlanSelectionModal';

const SubscriptionCard: React.FC = () => {
  const { data: subscriptionsData, isLoading: subscriptionsLoading } = useGetUserSubscriptionsQuery({});
  const { data: statsData, isLoading: statsLoading } = useGetSubscriptionStatsQuery();
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    subscriptionId: string;
    subscriptionType: string;
    amount: number;
    currency: string;
    action: 'renewal' | 'upgrade';
    newType?: string;
  } | null>(null);

  // Mutations
  const [renewSubscription] = useRenewSubscriptionMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const { subscriptionPrices } = useLocalization();

  // Handler functions
  const handleRenew = async () => {
    if (!primarySubscription) return;
    
    const priceInfo = subscriptionPrices[primarySubscription.type as 'monthly' | 'yearly'];

    setPaymentData({
      subscriptionId: primarySubscription._id,
      subscriptionType: primarySubscription.type,
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      action: 'renewal'
    });
    setShowPaymentModal(true);
  };

  const handleUpgrade = () => {
    setShowPlanModal(true);
  };

  const handleSelectPlan = async (planType: string) => {
    if (!primarySubscription) return;
    
    const priceInfo = subscriptionPrices[planType as 'monthly' | 'yearly' | 'lifetime'];

    setPaymentData({
      subscriptionId: primarySubscription._id,
      subscriptionType: primarySubscription.type,
      amount: priceInfo.amount,
      currency: priceInfo.currency,
      action: 'upgrade',
      newType: planType
    });
    setShowPaymentModal(true);
  };

  if (subscriptionsLoading || statsLoading) {
    return (
      <div className="w-full max-w-[750px] min-h-[120px] bg-white rounded-[11.72px] shadow-lg px-4 sm:px-6 py-4 sm:py-[18px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const primarySubscription = subscriptionsData?.primarySubscription;
  const hasActiveSubscription = subscriptionsData?.hasActiveSubscription || false;

  if (!hasActiveSubscription || !primarySubscription) {
    return (
      <div className="w-full max-w-[750px] min-h-[120px] bg-white rounded-[11.72px] shadow-lg px-4 sm:px-6 py-4 sm:py-[18px] flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="font-afacad font-semibold text-[18px] sm:text-[20px] text-[#313131] mb-2">
              No Active Subscription
            </h3>
            <p className="font-afacad text-[12px] sm:text-[14px] text-[#636363] mb-4">
              Activate a QR code to get started with your pet's security tag.
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <Link
              to="/order"
              className="bg-[#4CB2E2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#38a1d6] transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { type, daysRemaining, isExpiringSoon, endDate, amountPaid, currency } = primarySubscription;
  
  const getSubscriptionTypeDisplay = (type: string) => {
    switch (type) {
      case 'monthly':
        return 'Monthly Plan';
      case 'yearly':
        return 'Yearly Plan';
      case 'lifetime':
        return 'Lifetime Plan';
      default:
        return 'Active Plan';
    }
  };

  const getStatusColor = () => {
    if (isExpiringSoon) return 'text-orange-600';
    if (daysRemaining <= 0) return 'text-red-600';
    return 'text-green-600';
  };

  const getStatusText = () => {
    if (daysRemaining <= 0) return 'Expired';
    if (isExpiringSoon) return 'Expiring Soon';
    return 'Active';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-[750px] min-h-[120px] bg-white rounded-[11.72px] shadow-lg px-4 sm:px-6 py-4 sm:py-[18px] flex flex-col justify-center">
      <div className="flex items-center justify-between">
        <div className="flex flex-col flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-afacad font-semibold text-[18px] sm:text-[20px] text-[#313131]">
              {getSubscriptionTypeDisplay(type)}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} bg-opacity-10`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-afacad text-[12px] sm:text-[14px] text-[#636363]">
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Subscription expired'}
              </span>
              {daysRemaining > 0 && (
                <span className="font-afacad text-[12px] text-[#636363]">
                  (until {formatDate(endDate)})
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-afacad text-[12px] sm:text-[14px] text-[#636363]">
                Paid: {currency?.toUpperCase()} {amountPaid?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          
          {type === 'lifetime' ? (
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-3 mb-2">
                <div className="flex items-center justify-center mb-1">
                  <Check className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="font-afacad font-semibold text-[12px] text-purple-800">
                    Lifetime Plan
                  </span>
                </div>
                <p className="font-afacad text-[11px] text-purple-700">
                  Enjoy our service non-stop
                </p>
              </div>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleRenew}
                className="bg-[#4CB2E2] text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-[#38a1d6] transition-colors flex items-center"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Renew
              </button>
              <button
                onClick={handleUpgrade}
                className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <span className="text-orange-600 mr-2">⚠️</span>
            <span className="font-afacad text-[12px] text-orange-700">
              Your subscription expires in {daysRemaining} days. Renew now to keep your pet's security tag active.
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      {paymentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentData(null);
          }}
          subscriptionId={paymentData.subscriptionId}
          subscriptionType={paymentData.subscriptionType}
          amount={paymentData.amount}
          currency={paymentData.currency}
          action={paymentData.action}
          newType={paymentData.newType}
        />
      )}

      <PlanSelectionModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        currentType={type}
        onSelectPlan={handleSelectPlan}
      />
    </div>
  );
};

export default SubscriptionCard;
