import React, { useState } from 'react';
import { X, Check, MapPin, Truck, CreditCard, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Coupon } from '../types';

interface CheckoutModalProps {
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onClose: () => void;
  deliveryZip: string;
  onConfirmOrder: (orderData: {
    address: string;
    scheduledTime: string;
    deliveryMethod: 'delivery' | 'pickup';
    paymentMethod: string;
  }) => void;
}

export default function CheckoutModal({
  cartItems,
  appliedCoupon,
  onClose,
  deliveryZip,
  onConfirmOrder,
}: CheckoutModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Address
  const [addressInput, setAddressInput] = useState('742 Evergreen Terrace');
  const [apartment, setApartment] = useState('Apt 4B');
  const [city] = useState('Chicago');
  const [state] = useState('IL');
  const [zip] = useState(deliveryZip);

  // Scheduling
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [timeWindow, setTimeWindow] = useState('Today, 4:00 PM - 6:00 PM priority');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('Visa Ending in 8011 (Express)');
  const [cardName, setCardName] = useState('Homer Simpson');
  const [cardNumber, setCardNumber] = useState('4111 •••• •••• 8011');

  // Calculators
  const subtotal = cartItems.reduce((acc, curr) => {
    let p = curr.product.price;
    if (curr.isSubscription && curr.product.subscriptionDiscountPercent) {
      p = p * (1 - curr.product.subscriptionDiscountPercent / 105);
    }
    return acc + p * curr.quantity;
  }, 0);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  const deliveryFee = deliveryMethod === 'pickup' ? 0 : subtotal >= 50 ? 0 : 7.99;
  const tax = (subtotal - discountAmount) * 0.0825; // 8.25% Chicago rate
  const grandTotal = subtotal - discountAmount + deliveryFee + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      onConfirmOrder({
        address: `${addressInput}, ${apartment ? apartment + ', ' : ''}${city}, ${state} ${zip}`,
        scheduledTime: timeWindow,
        deliveryMethod,
        paymentMethod,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden font-sans my-8"
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header telemetry node */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-base font-bold text-gray-900">OMNI CHECKOUT DISPATCH</h2>
            <p className="text-xs text-gray-400 font-mono">STEP {step} OF 2 // ENCRYPTED TRANSACTION PROTOCOL</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-rose-500 hover:bg-gray-100 rounded-full transition-colors border border-gray-100 bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {/* LEFT: Inputs */}
          <div className="p-6 md:w-3/5 space-y-5">
            {/* Steps Progress Visuals */}
            <div className="flex items-center space-x-3 mb-2 font-mono text-[10px] font-bold">
              <span className={`px-2.5 py-0.5 rounded-md ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1. Logistics / Destination</span>
              <span className="text-gray-300">➔</span>
              <span className={`px-2.5 py-0.5 rounded-md ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2. BioID / Pay Lock</span>
            </div>

            {step === 1 ? (
              // STEP 1: Address & Method
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-3 flex items-center">
                    <MapPin className="w-4 h-4 text-blue-500 mr-1.5" />
                    Delivery Destination
                  </h3>
                  <div className="grid grid-cols-1 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Street Address</label>
                      <input
                        type="text"
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl text-xs font-semibold text-gray-800"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-455 uppercase mb-1">Unit / Room</label>
                        <input
                          type="text"
                          value={apartment}
                          onChange={(e) => setApartment(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-150 focus:outline-none focus:border-blue-500 focus:bg-white rounded-xl text-xs font-semibold text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-455 uppercase mb-1">Postal ZIP</label>
                        <input
                          type="text"
                          value={zip}
                          disabled
                          className="w-full px-3 py-2 bg-gray-100 border border-transparent rounded-xl text-xs font-bold text-gray-400 text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-3 flex items-center">
                    <Truck className="w-4 h-4 text-blue-500 mr-1.5" />
                    Logistics Protocol
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-4.5">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-3 rounded-xl border text-left transition ${
                        deliveryMethod === 'delivery'
                          ? 'border-blue-500 bg-blue-50/10'
                          : 'border-gray-150 hover:bg-gray-50'
                      }`}
                    >
                      <strong className="block text-xs text-gray-800">Home Shipment</strong>
                      <span className="text-[10px] text-gray-400 mt-1 block">Deploy carrier directly.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('pickup')}
                      className={`p-3 rounded-xl border text-left transition ${
                        deliveryMethod === 'pickup'
                          ? 'border-blue-500 bg-blue-50/10'
                          : 'border-gray-150 hover:bg-gray-50'
                      }`}
                    >
                      <strong className="block text-xs text-gray-800">In-Store Locker</strong>
                      <span className="text-[10px] text-gray-400 mt-1 block">Collect at store. No fee.</span>
                    </button>
                  </div>

                  {deliveryMethod === 'delivery' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Carrier Dispatch Schedule</label>
                      <select
                        value={timeWindow}
                        onChange={(e) => setTimeWindow(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Today, 4:00 PM - 6:00 PM (Express)">Today, 4:00 PM - 6:00 PM (Express)</option>
                        <option value="Today, 7:00 PM - 9:00 PM (Twilight)">Today, 7:00 PM - 9:00 PM (Twilight)</option>
                        <option value="Tomorrow morning, 8:00 AM - 10:00 AM">Tomorrow morning, 8:00 AM - 10:00 AM</option>
                        <option value="Tomorrow afternoon, 1:00 PM - 3:00 PM">Tomorrow afternoon, 1:00 PM - 3:00 PM</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Locker Counter Location</label>
                      <input
                        type="text"
                        disabled
                        value="Northside Metro Hub, Lane 4 (Lanes 1-8 Open)"
                        className="w-full px-3 py-2 bg-gray-100 text-gray-500 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // STEP 2: Secure Payment details
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 text-blue-500 mr-1.5" />
                    Express Checkout Protocol
                  </h3>
                  <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl mb-4 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-450 font-mono">CARD ASSIGNED:</span>
                      <strong className="text-gray-700">{cardNumber}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-450 font-mono">ACCOUNT HOLDER:</span>
                      <strong className="text-gray-700">{cardName}</strong>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Custom Account Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-450 uppercase mb-1">Simulated Card Token</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs font-mono font-bold text-gray-700"
                        required
                      />
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800 leading-normal flex items-start space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>
                        Secure express checkout with auto-reordering is loaded. Your payment will be encrypted via US-FIPS compliance standards. No real money is spent!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Totals summary */}
          <div className="p-6 md:w-2/5 bg-gray-50/50 flex flex-col justify-between font-mono text-xs">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1.5 font-sans">DISPATCH BILL</h3>
              
              {/* Product thumbnails summary */}
              <div className="max-h-36 overflow-y-auto space-y-2.5 pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-[11px]">
                    <span className="line-clamp-1 flex-1 text-gray-750 mr-2 font-sans font-semibold">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="text-gray-900 font-bold shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price calculations breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">SUBTOTAL:</span>
                  <span className="text-gray-700 font-bold">${subtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>COUPON DISCOUNT:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">DELIVERY FEE({deliveryMethod === 'delivery' ? 'CARRIER' : 'PICKUP'}):</span>
                  <span className="text-gray-700 font-bold">${deliveryFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400 font-semibold">REGIONAL TAX (8.25%):</span>
                  <span className="text-gray-700 font-bold">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-900 font-black pt-2 pb-1 border-t border-dashed border-gray-200">
                  <span>TOTAL ESTIMATED:</span>
                  <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action flow buttons */}
            <div className="pt-6 font-sans">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center space-x-1.5 text-xs select-none"
              >
                <span>{step === 1 ? 'Configure Payment' : 'Confirm & Dispatch Shipment'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-xs text-gray-400 py-1.5 hover:text-gray-600 mt-2 font-mono"
                >
                  ◀ EDIT ADDRESS DETS
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
