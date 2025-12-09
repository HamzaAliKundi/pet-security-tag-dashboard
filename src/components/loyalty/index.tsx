import React, { useState } from 'react';
import { useGetLoyaltyInfoQuery } from '../../apis/user/loyalty';
import toast from 'react-hot-toast';
import { Copy, Share2, Gift, Users, Award, TrendingUp } from 'lucide-react';

const Loyalty: React.FC = () => {
  const { data: loyaltyInfo, isLoading, error, refetch } = useGetLoyaltyInfoQuery();
  const [copied, setCopied] = useState(false);

  const referralLink = loyaltyInfo?.referralLink || '';
  const loyaltyPoints = loyaltyInfo?.loyaltyPoints || 0;
  const referralCode = loyaltyInfo?.referralCode || '';
  const referralCount = loyaltyInfo?.referralCount || 0;
  const referrals = loyaltyInfo?.referrals || [];
  const currentReward = loyaltyInfo?.currentReward;
  const nextReward = loyaltyInfo?.nextReward;
  const rewardRedemptions = loyaltyInfo?.rewardRedemptions || [];

  const handleCopyLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'Digital Tails Referral',
          text: 'Join Digital Tails and get rewards!',
          url: referralLink,
        });
        toast.success('Referral link shared!');
      } catch (shareError) {
        console.error('Error sharing:', shareError);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CB2E2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load loyalty information. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Loyalty & Referrals</h1>

      {/* Points Display */}
      <div className="bg-gradient-to-r from-[#4CB2E2] to-[#3da1d1] rounded-lg shadow-lg p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm mb-1">Your Loyalty Points</p>
            <p className="text-4xl font-bold">{loyaltyPoints.toLocaleString()}</p>
          </div>
          <Award className="w-16 h-16 text-white/20" />
        </div>
      </div>

      {/* Rewards Section */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {currentReward && (
          <div className={`border-2 rounded-lg p-6 ${
            currentReward.status === 'shipped' 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <Gift className={`w-6 h-6 ${
                currentReward.status === 'shipped' 
                  ? 'text-blue-600' 
                  : 'text-green-600'
              }`} />
              <h3 className={`font-semibold ${
                currentReward.status === 'shipped' 
                  ? 'text-blue-900' 
                  : 'text-green-900'
              }`}>
                {currentReward.status === 'shipped' 
                  ? 'Reward On The Way!' 
                  : 'Current Reward Achieved!'}
              </h3>
            </div>
            <p className={`font-medium ${
              currentReward.status === 'shipped' 
                ? 'text-blue-800' 
                : 'text-green-800'
            }`}>
              {currentReward.name}
            </p>
            <p className={`text-sm mt-1 ${
              currentReward.status === 'shipped' 
                ? 'text-blue-700' 
                : 'text-green-700'
            }`}>
              {currentReward.description}
            </p>
            {currentReward.message && (
              <div className={`mt-3 p-3 rounded-lg ${
                currentReward.status === 'shipped' 
                  ? 'bg-blue-100 border border-blue-300' 
                  : 'bg-yellow-100 border border-yellow-300'
              }`}>
                <p className={`text-sm font-medium ${
                  currentReward.status === 'shipped' 
                    ? 'text-blue-800' 
                    : 'text-yellow-800'
                }`}>
                  {currentReward.message}
                </p>
              </div>
            )}
          </div>
        )}
        {nextReward && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Next Reward</h3>
            </div>
            <p className="text-blue-800 font-medium">{nextReward.name}</p>
            <p className="text-blue-700 text-sm mt-1">{nextReward.description}</p>
            <div className="mt-3">
              <div className="bg-blue-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((loyaltyPoints / nextReward.pointsRequired) * 100, 100)}%`
                  }}
                />
              </div>
              <p className="text-blue-700 text-xs">
                {nextReward.pointsNeeded} points needed ({loyaltyPoints} / {nextReward.pointsRequired})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Referral Link Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#4CB2E2]" />
          Share Your Referral Link
        </h2>
        <p className="text-gray-600 mb-4">
          Share your unique referral link with friends. When they sign up, both of you get 100 points!
        </p>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={handleCopyLink}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-3 bg-[#4CB2E2] text-white rounded-lg hover:bg-[#3da1d1] transition-colors flex items-center gap-2"
            title="Share link"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Your referral code: <span className="font-mono font-semibold">{referralCode}</span>
        </p>
      </div>

      {/* Referral Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Referral Statistics</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#4CB2E2]">{referralCount}</p>
            <p className="text-gray-600 text-sm mt-1">Total Referrals</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-[#4CB2E2]">{loyaltyPoints}</p>
            <p className="text-gray-600 text-sm mt-1">Current Points</p>
          </div>
        </div>
      </div>

      {/* Reward Redemption History */}
      {rewardRedemptions && rewardRedemptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reward History</h2>
          <div className="space-y-3">
            {rewardRedemptions.map((redemption: any) => (
              <div
                key={redemption._id}
                className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {redemption.rewardTier === 1 ? 'Amazon Voucher' : 'Pet Gift Box'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  redemption.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : redemption.status === 'shipped'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {redemption.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral History */}
      {referrals && referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Referrals</h2>
          <div className="space-y-3">
            {referrals.map((referral: any) => (
              <div
                key={referral._id}
                className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {referral.referredUserId?.firstName} {referral.referredUserId?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{referral.referredUserId?.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+{referral.pointsAwarded} points</p>
                  <p className="text-xs text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Share your referral link with friends</li>
          <li>• When they sign up, both you and your friend get 100 points</li>
          <li>• Reach 1,000 points to get a £20/$20 Amazon voucher</li>
          <li>• Reach 2,000 points to get a Pet Gift Box with toys and treats</li>
          <li>• Points reset to 0 after reaching 2,000 points</li>
        </ul>
      </div>
    </div>
  );
};

export default Loyalty;

