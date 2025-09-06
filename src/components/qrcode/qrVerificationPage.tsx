import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetQRVerificationDetailsQuery, useVerifyQRWithSubscriptionMutation } from '../../apis/user/qrcode';
import SubscriptionModal from './subscriptionModal';
import toast from 'react-hot-toast';

const QRVerificationPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>('');

  // Get QR verification details
  const { data: qrDetails, isLoading, error } = useGetQRVerificationDetailsQuery(code!, {
    skip: !code,
  });

  const [verifyQRCode] = useVerifyQRWithSubscriptionMutation();

  useEffect(() => {
    if (qrDetails) {
      // Check if user is logged in (has token)
      const token = localStorage.getItem('token');
      
      if (qrDetails.isVerified && qrDetails.hasActiveSubscription) {
        // Already verified with active subscription
        toast.success('QR code is already verified and active!');
        navigate('/overview');
      } else if (!token) {
        // User is not logged in - redirect to login
        toast.error('Please log in to verify this QR code');
        navigate('/', { state: { redirectTo: `/qr/verify/${code}` } });
      } else if (!qrDetails.isVerified) {
        // User is logged in and QR needs verification - show subscription modal
        setShowSubscriptionModal(true);
      } else {
        // Fallback case
        setShowSubscriptionModal(true);
      }
    }
  }, [qrDetails, navigate, code]);

  const handleSubscriptionSuccess = async (subscriptionType: 'monthly' | 'yearly', petId?: string) => {
    try {
      if (!qrDetails?.qrCode?.id) {
        toast.error('QR code information not available');
        return;
      }

      const result = await verifyQRCode({
        qrCodeId: qrDetails.qrCode.id,
        subscriptionType,
        petId: petId || selectedPetId,
      }).unwrap();

      toast.success('QR code verified successfully!');
      setShowSubscriptionModal(false);
      navigate('/overview');
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.data?.message || 'Failed to verify QR code');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading QR verification details...</p>
        </div>
      </div>
    );
  }

  if (error || !qrDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold text-lg mb-2">QR Code Error</h2>
            <p>
              {error ? 
                ('data' in error ? (error.data as any)?.message : 'Failed to load QR code details') : 
                'QR code not found or invalid'
              }
            </p>
          </div>
          <button
            onClick={() => navigate('/overview')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                QR Code Verification
              </h1>
              <p className="text-gray-600">
                Activate your pet's security tag with a subscription
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">QR Code Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Code:</span> {qrDetails.qrCode.code}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    qrDetails.qrCode.status === 'verified' ? 'bg-green-100 text-green-800' :
                    qrDetails.qrCode.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {qrDetails.qrCode.status}
                  </span>
                </p>
                {qrDetails.qrCode.assignedPetName && (
                  <p><span className="font-medium">Pet:</span> {qrDetails.qrCode.assignedPetName}</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Activate with Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal
          qrCode={qrDetails.qrCode}
          onSuccess={handleSubscriptionSuccess}
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  );
};

export default QRVerificationPage;
