import React, { useState } from 'react';
import { X, Check, Crown, Calendar, Infinity } from 'lucide-react';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentType: string;
  onSelectPlan: (planType: string) => void;
}

const PlanSelectionModal: React.FC<PlanSelectionModalProps> = ({
  isOpen,
  onClose,
  currentType,
  onSelectPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  if (!isOpen) return null;

  const plans = [
    {
      type: 'monthly',
      name: 'Monthly Plan',
      price: 2.75,
      currency: 'GBP',
      period: 'per month',
      icon: Calendar,
      description: 'Perfect for trying out our service',
      features: ['QR Code Generation', 'Pet Profile Management', 'Basic Support']
    },
    {
      type: 'yearly',
      name: 'Yearly Plan',
      price: 28.99,
      currency: 'GBP',
      period: 'per year',
      icon: Calendar,
      description: 'Best value for regular users',
      features: ['QR Code Generation', 'Pet Profile Management', 'Priority Support']
    },
    {
      type: 'lifetime',
      name: 'Lifetime Plan',
      price: 129.99,
      currency: 'GBP',
      period: 'one-time',
      icon: Crown,
      description: 'Never worry about renewals again',
      features: ['QR Code Generation', 'Pet Profile Management', 'Premium Support', 'Lifetime Access', 'All Future Features']
    }
  ];

  const handleSelectPlan = (planType: string) => {
    if (planType === currentType) {
      return; // Don't allow selecting current plan
    }
    setSelectedPlan(planType);
    onSelectPlan(planType);
    onClose();
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'monthly':
        return Calendar;
      case 'yearly':
        return Calendar;
      case 'lifetime':
        return Crown;
      default:
        return Calendar;
    }
  };

  const isCurrentPlan = (planType: string) => planType === currentType;
  const isRecommended = (planType: string) => planType === 'yearly';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-afacad font-bold text-[24px] text-[#222]">
            Choose Your Plan
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <p className="font-afacad text-[16px] text-[#636363]">
              Upgrade your subscription to get more features and better value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const IconComponent = getPlanIcon(plan.type);
              const isCurrent = isCurrentPlan(plan.type);
              const isRecommended = plan.type === 'yearly';

              return (
                <div
                  key={plan.type}
                  className={`relative border-2 rounded-lg p-6 transition-all duration-200 ${
                    isCurrent
                      ? 'border-gray-300 bg-gray-50'
                      : isRecommended
                      ? 'border-[#4CB2E2] bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-[#4CB2E2] hover:shadow-lg'
                  } ${isCurrent ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={() => !isCurrent && handleSelectPlan(plan.type)}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#4CB2E2] text-white px-3 py-1 rounded-full text-xs font-medium">
                        Recommended
                      </span>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-gray-300' : 'bg-[#4CB2E2]'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${isCurrent ? 'text-gray-600' : 'text-white'}`} />
                    </div>

                    <h3 className="font-afacad font-bold text-[18px] text-[#222] mb-2">
                      {plan.name}
                    </h3>

                    <div className="mb-4">
                      <span className="font-afacad font-bold text-[32px] text-[#222]">
                        {plan.currency} {plan.price}
                      </span>
                      <span className="font-afacad text-[14px] text-[#636363] ml-1">
                        {plan.period}
                      </span>
                    </div>

                    <p className="font-afacad text-[14px] text-[#636363] mb-6">
                      {plan.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-left">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="font-afacad text-[14px] text-[#222]">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 bg-gray-300 text-gray-500 rounded-lg font-afacad font-medium cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : (
                      <button
                        className={`w-full py-3 px-4 rounded-lg font-afacad font-medium transition-colors ${
                          isRecommended
                            ? 'bg-[#4CB2E2] text-white hover:bg-[#38a1d6]'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {plan.type === 'lifetime' ? 'Go Lifetime' : `Upgrade to ${plan.name}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="font-afacad text-[14px] text-[#636363]">
              All plans include secure payment processing and 24/7 customer support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSelectionModal;
