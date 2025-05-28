import React from 'react'

const paymentData = [
  { id: 1, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Pending' },
  { id: 2, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Paid' },
  { id: 3, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Paid' },
  { id: 4, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Paid' },
  { id: 5, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Pending' },
  { id: 6, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Paid' },
  { id: 7, invoice: 'INV 1744678412 - £0.00', date: '15/04/25', amount: '£0.00', status: 'Paid' },
];

// Custom CSS for 800px breakpoint
// Add this to your global CSS (e.g., index.css):
// @media (max-width: 800px) {
//   .max800\:overflow-x-auto { overflow-x: auto; }
//   .max800\:min-w-\[800px\] { min-width: 800px; }
// }

const Payment = () => {
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
          <span className="font-afacad font-semibold text-[16px] text-[#636363]">07</span>
        </div>

        {/* Table: scrollable only on <=800px */}
        <div className="w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[800px] md:min-w-0">
            <thead>
              <tr className="border-b border-[#E0E0E0]">
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[30%]">INVOICE NO.</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[15%]">DATE</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[15%]">AMOUNT</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[20%]">STATUS</th>
                <th className="text-left py-3 font-afacad font-semibold text-[14px] text-[#636363] w-[20%]">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((payment) => (
                <tr key={payment.id} className="border-b border-[#E0E0E0]">
                  <td className="py-4 font-afacad text-[14px] text-[#222]">{payment.invoice}</td>
                  <td className="py-4 font-afacad text-[14px] text-[#222]">{payment.date}</td>
                  <td className="py-4 font-afacad text-[14px] text-[#222]">{payment.amount}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-afacad font-medium
                      ${payment.status === 'Pending' 
                        ? 'bg-[#FFF8E7] text-[#F5B700]' 
                        : 'bg-[#E7FFE7] text-[#00B212]'
                      }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="flex items-center gap-2 text-[#FF4747] font-afacad text-[14px] hover:opacity-80">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payment
