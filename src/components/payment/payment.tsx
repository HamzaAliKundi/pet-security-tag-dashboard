import React, { useMemo } from 'react'
import { useGetPetTagOrdersQuery } from '../../apis/user/users';
import { useGetUserSubscriptionsQuery } from '../../apis/user/qrcode';

// Custom CSS for 800px breakpoint
// Add this to your global CSS (e.g., index.css):
// @media (max-width: 800px) {
//   .max800\:overflow-x-auto { overflow-x: auto; }
//   .max800\:min-w-\[800px\] { min-width: 800px; }
// }

const Payment = () => {
  // Fetch payment history from API
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetPetTagOrdersQuery({ page: 1, limit: 50 });
  const { data: subscriptionsData, isLoading: subscriptionsLoading, error: subscriptionsError } = useGetUserSubscriptionsQuery({ page: 1, limit: 50 });
  
  // Combine and sort payment data
  const paymentData = useMemo(() => {
    const orders = ordersData?.orders || [];
    const subscriptions = subscriptionsData?.subscriptions || [];
    
    // Transform subscriptions to match payment format
    const subscriptionPayments = subscriptions.map((sub: any) => ({
      _id: sub._id,
      paymentIntentId: sub.paymentIntentId || `SUB-${sub._id.slice(-8)}`,
      createdAt: sub.createdAt,
      totalCostEuro: sub.amountPaid,
      status: sub.status === 'active' ? 'paid' : sub.status,
      type: 'subscription',
      subscriptionType: sub.type,
      endDate: sub.endDate
    }));
    
    // Transform orders to include type
    const orderPayments = orders.map(order => ({
      ...order,
      type: 'order'
    }));
    
    // Combine and sort by date (newest first)
    const allPayments = [...orderPayments, ...subscriptionPayments];
    return allPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [ordersData, subscriptionsData]);
  
  const isLoading = ordersLoading || subscriptionsLoading;
  const error = ordersError || subscriptionsError;
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YY format
  };
  
  // Format amount function
  const formatAmount = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };
  
  // Get status display info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paid':
        return { text: 'Paid', bgColor: 'bg-[#E7FFE7]', textColor: 'text-[#00B212]' };
      case 'pending':
        return { text: 'Pending', bgColor: 'bg-[#FFF8E7]', textColor: 'text-[#F5B700]' };
      case 'failed':
        return { text: 'Failed', bgColor: 'bg-[#FFE7E7]', textColor: 'text-[#FF4747]' };
      default:
        return { text: status, bgColor: 'bg-[#F0F0F0]', textColor: 'text-[#636363]' };
    }
  };

  return (
    <div className="max-w-full overflow-hidden">
      <div className="w-full max-w-[750px] mx-auto px-4 sm:px-0 py-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-2 bg-[#E6F6FE] rounded-[8px] px-3 py-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CB2E2" strokeWidth="2">
              <path d="M21 6H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z" />
              <path d="M1 10h22" />
            </svg>
            <span className="font-afacad font-semibold text-[16px] text-[#4CB2E2]">Payment History</span>
          </div>
          <span className="font-afacad font-semibold text-[16px] text-[#636363]">
            {isLoading ? '...' : `${paymentData.length} payments`}
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="font-afacad text-[15px] text-[#636363]">Loading payment history...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <div className="font-afacad text-[15px] text-red-600">Error loading payment history. Please try again.</div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && paymentData.length === 0 && (
          <div className="text-center py-8">
            <div className="font-afacad text-[15px] text-[#636363]">No payment history found.</div>
          </div>
        )}

        {/* Table: scrollable only on <=1000px */}
        {!isLoading && !error && paymentData.length > 0 && (
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] md:min-w-0">
            <thead>
              <tr className="border-b border-[#E0E0E0]">
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[25%]">INVOICE NO.</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[15%]">TYPE</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[12%]">DATE</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[12%]">AMOUNT</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[18%]">STATUS</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[18%]">DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                return (
                  <tr key={payment._id} className="border-b border-[#E0E0E0]">
                    <td className="py-4 font-afacad text-[14px] text-[#222]">
                      {payment.paymentIntentId}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-afacad font-medium ${
                        payment.type === 'subscription' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {payment.type === 'subscription' ? 'Subscription' : 'Pet Tag Order'}
                      </span>
                    </td>
                    <td className="py-4 font-afacad text-[14px] text-[#222]">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="py-4 font-afacad text-[14px] text-[#222]">
                      {formatAmount(payment.totalCostEuro)}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-afacad font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="py-4 font-afacad text-[12px] text-[#636363]">
                      {payment.type === 'subscription' ? (
                        <div>
                          <div className="font-medium text-[#222]">
                            {payment.subscriptionType?.charAt(0).toUpperCase() + payment.subscriptionType?.slice(1)} Plan
                          </div>
                          {payment.endDate && (
                            <div className="text-[11px]">
                              Until: {formatDate(payment.endDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-[#222]">
                            {payment.quantity} Pet Tag{payment.quantity > 1 ? 's' : ''}
                          </div>
                          {payment.petName && (
                            <div className="text-[11px]">
                              For: {payment.petName}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}

export default Payment
