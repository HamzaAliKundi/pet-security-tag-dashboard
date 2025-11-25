import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, TrendingUp } from 'lucide-react';
import { useGetUserSubscriptionsQuery, useGetSubscriptionStatsQuery, useUpgradeSubscriptionMutation } from '../../apis/user/qrcode';
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
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const { subscriptionPrices } = useLocalization();

  // Handler functions
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col flex-1">
            <h3 className="font-afacad font-semibold text-[16px] sm:text-[18px] md:text-[20px] text-[#313131] mb-2">
              No Active Subscription
            </h3>
            <p className="font-afacad text-[11px] sm:text-[12px] md:text-[14px] text-[#636363] mb-2 sm:mb-4">
              Activate a QR code to get started with your pet's security tag.
            </p>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl sm:text-2xl">🔒</span>
            </div>
            <Link
              to="/order"
              className="bg-[#4CB2E2] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#38a1d6] transition-colors whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { type, daysRemaining, isExpiringSoon, endDate, amountPaid, currency, autoRenew } = primarySubscription;
  
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-afacad font-semibold text-[16px] sm:text-[18px] md:text-[20px] text-[#313131]">
              {getSubscriptionTypeDisplay(type)}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} bg-opacity-10 whitespace-nowrap`}>
              {getStatusText()}
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 sm:space-x-4">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <span className="font-afacad text-[11px] sm:text-[12px] md:text-[14px] text-[#636363]">
                {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Subscription expired'}
              </span>
              {daysRemaining > 0 && (
                <span className="font-afacad text-[11px] sm:text-[12px] text-[#636363] whitespace-nowrap">
                  (until {formatDate(endDate)})
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="font-afacad text-[11px] sm:text-[12px] md:text-[14px] text-[#636363]">
                Paid: {currency?.toUpperCase()} {amountPaid?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Auto-Renewal Status */}
          {autoRenew && type !== 'lifetime' && daysRemaining > 0 && (
            <div className="mt-2 sm:mt-2 p-2 bg-green-50 border border-green-200 rounded-lg w-full sm:max-w-[calc(100%-180px)] md:max-w-[calc(100%-200px)]">
              <div className="flex items-start sm:items-center">
                <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="font-afacad text-[11px] sm:text-[12px] text-green-700 break-words">
                  Auto-renewal enabled • Your subscription will automatically renew on {formatDate(endDate)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 sm:flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          
          {type === 'lifetime' ? (
            <div className="text-center sm:text-center w-full sm:w-auto">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg p-2 sm:p-3">
                <div className="flex items-center justify-center mb-1">
                  <Check className="w-4 h-4 text-purple-600 mr-1" />
                  <span className="font-afacad font-semibold text-[11px] sm:text-[12px] text-purple-800">
                    Lifetime Plan
                  </span>
                </div>
                <p className="font-afacad text-[10px] sm:text-[11px] text-purple-700">
                  Enjoy our service non-stop
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex items-center whitespace-nowrap"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Change plan
            </button>
          )}
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mt-3 p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start sm:items-center">
            <span className="text-orange-600 mr-2 flex-shrink-0 text-base sm:text-lg">⚠️</span>
            <span className="font-afacad text-[11px] sm:text-[12px] text-orange-700 break-words">
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
