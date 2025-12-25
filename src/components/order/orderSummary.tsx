import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Calendar } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { petsApi } from '../../apis/user/users/pets';

const OrderSummary: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderData = (location.state as any)?.orderData;

  const handleGoToDashboard = () => {
    // Invalidate Pet tags to refetch pets when navigating to dashboard
    dispatch(petsApi.util.invalidateTags(['Pet']));
    navigate('/overview');
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    if (!orderData) {
      navigate('/order');
    }
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const order = orderData.order || orderData;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount?: number) => {
    return `€${parseFloat(String(amount || 0)).toFixed(2)}`;
  };

  const getColorName = (color?: string) => {
    if (!color) return 'N/A';
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Your order has been placed!
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We&apos;ll send you an email confirmation shortly.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#4CB2E2]" />
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-gray-900">{order._id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <p className="font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {order.status || 'Pending'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {order.paymentStatus === 'succeeded' ? 'Paid' : 'Processing'}
              </span>
            </div>
          </div>
        </div>

        {/* Tag & Pet Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tag &amp; Pet Information
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Pet Name:</span>{' '}
              {order.petName || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Quantity:</span>{' '}
              {order.quantity || 1}
            </p>
            <p>
              <span className="font-medium">Tag Color:</span>{' '}
              {getColorName(order.tagColor)}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#4CB2E2]" />
            Shipping Address
          </h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-medium">{order.street || ''}</p>
            <p>
              {order.city || ''}{order.city && order.state ? ', ' : ''}{order.state || ''}
            </p>
            <p>{order.zipCode || ''}</p>
            <p className="font-medium mt-1">{order.country || ''}</p>
          </div>
        </div>

        {/* Order Summary / Pricing */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Number of Tags:</span>
              <span className="font-medium">{order.quantity || 1}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-[#4CB2E2]">
                  {formatCurrency(order.totalCostEuro)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoToDashboard}
            className="px-6 py-3 bg-[#4CB2E2] text-white rounded-lg font-semibold hover:bg-[#3da1d1] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;


