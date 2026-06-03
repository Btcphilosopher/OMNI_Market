import React, { useState } from 'react';
import { X, Trash2, Calendar, ShoppingBag, ArrowRight, Sparkles, AlertCircle, Ticket } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { mockCoupons } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (pId: string, q: number, isSub: boolean) => void;
  onRemoveItem: (pId: string, isSub: boolean) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onBeginCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onBeginCheckout,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  // Calculators
  const subtotal = cartItems.reduce((acc, curr) => {
    let price = curr.product.price;
    if (curr.isSubscription && curr.product.subscriptionDiscountPercent) {
      price = price * (1 - curr.product.subscriptionDiscountPercent / 100);
    }
    return acc + price * curr.quantity;
  }, 0);

  // Apply Coupon logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const query = couponCode.trim().toUpperCase();
    const found = mockCoupons.find((c) => c.code === query);

    if (!found) {
      setCouponError('Invalid promo code. Check Deals tab!');
      return;
    }

    if (subtotal < found.minimumSpend) {
      setCouponError(`Min spend for ${found.code} is $${found.minimumSpend.toFixed(2)}.`);
      return;
    }

    onApplyCoupon(found);
    setCouponSuccess(`Applied: ${found.description}`);
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : appliedCoupon.value
    : 0;

  const total = subtotal - discountAmount;

  // Recommended bundling items helper
  const showBundleAd = subtotal > 0 && subtotal < 50;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content frame */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-gray-100 flex flex-col justify-between z-10 overflow-hidden">
        {/* Header telemetry info */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-bold tracking-tight">LOGISTICS ASSEMBLY</h2>
              <span className="block text-[9px] font-mono text-gray-400">Cart Node Id: {Math.random().toString(36).substring(4, 9).toUpperCase()}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of items */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl text-xs text-gray-500 font-mono">
            <span>PACKS REGISTERED: {cartItems.length}</span>
            <span className="text-emerald-600 font-bold">READY TO DEPLOY</span>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-700">Logistics tray is empty</p>
              <p className="text-xs text-gray-400 mt-1 mb-6">Explore the smart recommendations or filter specific categories to get started.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {cartItems.map((item, idx) => {
                const discountCoeff = item.isSubscription && item.product.subscriptionDiscountPercent
                  ? (1 - item.product.subscriptionDiscountPercent / 100)
                  : 1;
                const activePrice = item.product.price * discountCoeff;
                const hasDiscountApplied = discountCoeff < 1;

                return (
                  <div 
                    key={`${item.product.id}-${item.isSubscription}`}
                    className="p-3 bg-white border border-gray-100 rounded-2xl shadow-xs hover:border-gray-200 flex items-start justify-between space-x-3.5 transition-all"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Metadata & Controls */}
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 leading-tight mb-1">
                        {item.product.name}
                      </h4>
                      
                      {/* Subscription indicator labels */}
                      {item.isSubscription ? (
                        <div className="flex items-center text-[10px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded-sm w-fit mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Autoreorder {item.subscriptionIntervalWeeks}w (Save {item.product.subscriptionDiscountPercent}%)</span>
                        </div>
                      ) : (
                        <span className="block text-[9px] text-gray-400 font-mono mb-2 uppercase">ONE-TIME CARRIER</span>
                      )}

                      {/* Quantity Controller */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-150 rounded-lg bg-gray-50 overflow-hidden">
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity - 1, item.isSubscription)}
                            className="px-2 py-0.5 text-xs text-gray-550 hover:bg-gray-100 transition-colors font-bold font-mono"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800 font-mono select-none bg-white py-0.5">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQty(item.product.id, item.quantity + 1, item.isSubscription)}
                            className="px-2 py-0.5 text-xs text-gray-550 hover:bg-gray-100 transition-colors font-bold font-mono"
                          >
                            +
                          </button>
                        </div>

                        {/* trash removal link */}
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.isSubscription)}
                          className="p-1.5 text-gray-450 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-right flex-shrink-0 flex flex-col justify-between">
                      <span className="text-xs font-bold text-gray-850 font-mono block">
                        ${(activePrice * item.quantity).toFixed(2)}
                      </span>
                      {hasDiscountApplied && (
                        <span className="text-[9px] text-gray-450 font-mono line-through block">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      )}
                      <span className="text-[9px] text-gray-400 font-mono">
                        ${activePrice.toFixed(2)}/ea
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bundle recommendation drawer if order total is low */}
          {showBundleAd && (
            <div className="mt-6 p-3 bg-blue-50/40 border border-blue-100 rounded-2xl flex items-start space-x-2.5">
              <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs text-blue-800 block">Deploy Savings Booster</strong>
                <p className="text-[11px] text-blue-600/80 leading-normal mb-1">
                  Combine essentials above $50.00 to activate free same-day carrier dispatch! Saving you $7.99 in delivery.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Promo Codes & Pricing Breakdown drawer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-150 space-y-4">
            {/* Promo application form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO CODE (e.g. OMNISAVE)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow px-3 py-1.5 bg-white border border-gray-200 focus:outline-none focus:border-blue-500 rounded-xl text-xs uppercase font-mono font-bold tracking-wider"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition flex items-center"
              >
                <Ticket className="w-3.5 h-3.5 mr-1" />
                Apply
              </button>
            </form>

            {/* Promo response indicators */}
            {couponError && (
              <p className="text-[11px] font-semibold text-rose-500 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {couponError}
              </p>
            )}
            {couponSuccess && (
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center justify-between">
                <span>{couponSuccess}</span>
                <button 
                  onClick={() => { onApplyCoupon(null); setCouponSuccess(''); }}
                  className="text-[10px] text-rose-505 underline"
                >
                  Remove
                </button>
              </p>
            )}

            {/* Calculations and CTA Checkout buttons */}
            <div className="space-y-1.5 pt-2 border-t border-gray-200 text-xs text-gray-500 font-mono">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>DISCOUNT ({appliedCoupon.code}):</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>DELIVERY ESTIMATE (CARRIER):</span>
                <span className="text-emerald-500 font-bold">{subtotal >= 50 ? 'FREE' : '$7.99'}</span>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 text-gray-800 font-semibold font-sans">
                <span>DEPLOYMENT COST:</span>
                <span className="text-lg font-black text-blue-600 font-mono">
                  ${(total + (subtotal >= 50 ? 0 : 7.99)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout button trigger */}
            <button
              onClick={onBeginCheckout}
              className="w-full bg-blue-600 hover:bg-blue-750 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm select-none"
              id="btn-trigger-checkout"
            >
              <span>Engage Fast Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
