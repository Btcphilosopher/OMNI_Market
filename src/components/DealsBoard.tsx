import { useState } from 'react';
import { Flame, Ticket, Percent, Sparkles, Check, Clock, Calendar } from 'lucide-react';
import { Coupon, Product } from '../types';
import { mockCoupons, mockProducts } from '../data/products';

interface DealsBoardProps {
  onClipCoupon: (coupon: Coupon) => void;
  clippedCoupons: string[]; // List of coupon codes
  onSelectProduct: (p: Product) => void;
}

export default function DealsBoard({ onClipCoupon, clippedCoupons, onSelectProduct }: DealsBoardProps) {
  const [stampMsg, setStampMsg] = useState<string | null>(null);

  const handleClip = (coupon: Coupon) => {
    onClipCoupon(coupon);
    setStampMsg(`Coupon "${coupon.code}" clipped successfully! Loaded into checkout profile.`);
    setTimeout(() => {
      setStampMsg(null);
    }, 3000);
  };

  const dealProducts = mockProducts.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans space-y-8" id="deals-dashboard-board">
      {/* Visual top notification banner */}
      {stampMsg && (
        <div className="p-3.5 bg-emerald-600 text-white font-sans text-xs font-bold rounded-2xl shadow-lg transition-all animate-bounce flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>{stampMsg}</span>
        </div>
      )}

      {/* Hero Banner: Futuristic US circular flyer */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 space-y-3 md:max-w-xl">
          <div className="flex items-center space-x-2 text-rose-500 font-mono text-xs font-bold">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>US CENTRAL LOGISTICS DIRECTIVE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none text-white">
            USA ESSENTIALS WEEKLY DIRECT DISCOUNTS
          </h1>
          <p className="text-xs text-gray-400 leading-normal font-sans">
            Secure priority price reductions directly from national warehouse floor allocations. Auto-savings applied directly to bulk groceries, tech hardware, and wellness medicine.
          </p>
          <div className="flex items-center space-x-3.5 text-rose-400 font-mono text-[10px] uppercase font-bold pt-1">
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Circular Node: #EP-8211
            </span>
            <span>|</span>
            <span>Refreshes in 4 days</span>
          </div>
        </div>

        <div className="p-5 border border-dashed border-rose-500/40 rounded-2xl bg-rose-500/5 backdrop-blur-md relative overflow-hidden flex flex-col justify-between shrink-0 select-none">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl" />
          <span className="text-[10px] font-black font-mono tracking-widest uppercase text-rose-400">STOREWIDE BOOST</span>
          <h2 className="text-3xl font-black text-rose-500 font-mono mt-1 mb-2">10% OFF</h2>
          <div className="p-2 border border-slate-700 bg-slate-950 font-mono text-xs text-center rounded-lg font-bold uppercase tracking-wider text-white">
            Code: OMNISAVE
          </div>
        </div>
      </div>

      {/* Grid 1: Clipable Digital Coupons Section */}
      <div>
        <div className="flex justify-between items-end border-b border-gray-150 pb-3.5 mb-5 select-none">
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-none">Instant Merchant Coupons</h3>
            <p className="text-xs text-gray-400 font-mono uppercase mt-1">Clip, load, & save instantly. Codes attach automatically during checkouts.</p>
          </div>
          <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md font-bold">FIPS DIRECTIVES ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockCoupons.map((coupon) => {
            const isClipped = clippedCoupons.includes(coupon.code);
            return (
              <div 
                key={coupon.code}
                className={`p-4 rounded-xl border-2 border-dashed relative overflow-hidden transition-all flex flex-col justify-between ${
                  isClipped 
                    ? 'border-emerald-500 bg-emerald-50/5' 
                    : 'border-slate-300 bg-white hover:border-blue-400 hover:shadow-xs'
                }`}
                id={`coupon-${coupon.code}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2.5">
                    <span className="p-1 text-blue-600 bg-blue-50 rounded-lg">
                      <Ticket className="w-5 h-5 text-blue-500" />
                    </span>
                    <strong className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      Min spend: ${coupon.minimumSpend}
                    </strong>
                  </div>

                  <h4 className="text-base font-bold text-gray-850 mt-1 mb-0.5">
                    {coupon.discountType === 'percent' ? `${coupon.value}% Off` : `$${coupon.value}.00 Off`}
                  </h4>
                  <p className="text-xs text-gray-400 leading-normal mb-4 font-sans">{coupon.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                  <div className="font-mono text-xs font-black text-gray-700 bg-slate-100 py-1 px-2.5 rounded-lg border border-gray-200">
                    {coupon.code}
                  </div>

                  <button
                    onClick={() => handleClip(coupon)}
                    disabled={isClipped}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                      isClipped
                        ? 'bg-emerald-500 text-white shadow-xs cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-750'
                    }`}
                  >
                    {isClipped ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>CLIPPED</span>
                      </>
                    ) : (
                      <span>CLIP DISCOUNT</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid 2: Active Flash deals & Price cuts */}
      <div>
        <div className="flex justify-between items-end border-b border-gray-150 pb-3.5 mb-5 select-none">
          <div>
            <h3 className="text-base font-bold text-gray-900 leading-none">Flash Direct Warehouse Reductions</h3>
            <p className="text-xs text-gray-400 font-mono uppercase mt-1">High inventory floor clearance yields immediate price cuts.</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 flex items-center space-x-1">
            <Percent className="w-3.5 h-3.5" />
            <strong>BOOSTER ACTIVE</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dealProducts.map((p) => {
            const discPercent = Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100);
            return (
              <div 
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="product-card p-3 hover:border-rose-400 hover:shadow-xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-square w-full bg-slate-50 flex items-center justify-center p-2 mb-2 rounded-lg border border-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                    <span className="absolute top-1.5 left-1.5 status-badge savings-pill">
                      -{discPercent}% TODAY
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug mb-1">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{p.brand}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 mt-2.5 flex items-baseline justify-between font-mono">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 line-through leading-none">${p.originalPrice?.toFixed(2)}</span>
                    <strong className="text-sm font-bold text-rose-600 leading-none mt-0.5 price-font">${p.price.toFixed(2)}</strong>
                  </div>
                  <span className="status-badge delivery-pill">REFILL</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
