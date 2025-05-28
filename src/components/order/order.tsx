import React, { useState } from 'react';

const TAG_PRICE = 2.95;
const SHIPPING = 2.95;

const Order = () => {
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState('');

  const subtotal = (quantity * TAG_PRICE).toFixed(2);
  const total = (quantity * TAG_PRICE + SHIPPING).toFixed(2);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-[#fafbfc] to-[#f8fafd]">
      {/* Title & Subtitle */}
      <div className="mb-8 text-center">
        <div className="font-afacad font-semibold text-[24px] text-[#222] mb-2">Order more tags</div>
        <div className="font-afacad text-[15px] text-[#636363]">You are on the Premium Plus plan, so you can order as many tags as you need.</div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-[16px] shadow-lg px-6 py-7 w-full max-w-[670px]">
        {/* How many tags */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[16px] text-[#222] mb-1">How many tags do you need?</div>
          <div className="font-afacad text-[13px] text-[#636363]">Dispatched today if you order in the next: <span className="font-semibold text-[#222]">2 hours, 13 minutes</span></div>
        </div>
        <hr className="my-4 border-[#E0E0E0]" />

        {/* Quantity Selector */}
        <div className="mb-4">
          <div className="font-afacad font-semibold text-[15px] text-[#222] mb-2">Quantity:</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-white shadow-sm hover:bg-[#f3f3f3] transition"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#B0B0B0" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 12h12"/></svg>
            </button>
            <span className="w-8 text-center font-afacad font-semibold text-[16px]">{quantity}</span>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-[8px] bg-[#4CB2E2] shadow-sm hover:bg-[#38a1d6] transition"
              onClick={() => setQuantity(q => q + 1)}
              aria-label="Increase quantity"
            >
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v12M6 12h12"/></svg>
            </button>
          </div>
        </div>

        {/* Pet Name Input */}
        <input
          type="text"
          placeholder="Pet Name"
          className="w-full rounded-[8px] border border-[#E0E0E0] bg-[#FAFAFA] px-4 py-3 font-afacad text-[15px] text-[#222] shadow-sm focus:outline-none focus:border-[#4CB2E2] transition mb-4"
          value={petName}
          onChange={e => setPetName(e.target.value)}
        />

        {/* Order Summary */}
        <div className="divide-y divide-[#E0E0E0] mb-6">
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#222]">
            <span>{quantity}x Digital Tails Tag</span>
            <span>£{(quantity * TAG_PRICE).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#636363]">
            <span>Subtotal</span>
            <span>£{subtotal}</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad text-[15px] text-[#636363]">
            <span>Shipping & Handling</span>
            <span>£{SHIPPING.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 font-afacad font-semibold text-[16px] text-[#222]">
            <span>Total</span>
            <span>£{total}</span>
          </div>
        </div>

        {/* Complete Order Button */}
        <button
          type="button"
          className="w-full py-3 rounded-[8px] bg-[#4CB2E2] text-white font-afacad font-semibold text-[17px] shadow-md hover:bg-[#38a1d6] transition"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
};

export default Order;