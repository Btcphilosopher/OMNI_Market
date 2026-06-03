import { useState } from 'react';
import { Star, ShoppingCart, Truck, Calendar, X, Check, Box, Award, ShieldAlert, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { mockProducts } from '../data/products';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, isSub: boolean, interval?: number) => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  allProducts,
  onSelectProduct,
}: ProductDetailModalProps) {
  const [purchaseMode, setPurchaseMode] = useState<'once' | 'subscribe'>(
    product.isSubscriptionEligible ? 'once' : 'once'
  );
  const [subInterval, setSubInterval] = useState<number>(4); // Default to 4 weeks
  const [addedBanner, setAddedBanner] = useState(false);

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  // Get matching cross-sell products from ID references
  const crossSellItems = allProducts.filter((p) =>
    product.frequentlyBoughtTogether?.includes(p.id)
  );

  const handleAddToCart = () => {
    onAddToCart(
      product,
      purchaseMode === 'subscribe',
      purchaseMode === 'subscribe' ? subInterval : undefined
    );
    setAddedBanner(true);
    setTimeout(() => {
      setAddedBanner(false);
    }, 2500);
  };

  const finalPrice =
    purchaseMode === 'subscribe' && product.subscriptionDiscountPercent
      ? product.price * (1 - product.subscriptionDiscountPercent / 100)
      : product.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden font-sans my-8"
        id={`prod-detail-modal-${product.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner notifying added to cart */}
        {addedBanner && (
          <div className="absolute top-4 left-4 right-4 z-50 bg-emerald-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-between font-sans transition-all animate-bounce">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>
                Added {product.name} to list ({purchaseMode === 'subscribe' ? `Auto-delivery every ${subInterval} weeks` : 'One-time shipment'})!
              </span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-700 px-2 py-0.5 rounded-sm">COMPLETED</span>
          </div>
        )}

        {/* Header Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-gray-50 hover:bg-gray-100 hover:text-rose-500 rounded-full transition-colors z-20 border border-gray-100"
          id="btn-close-detail"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Panel splitter */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT PANEL: Media gallery & product features */}
          <div className="p-6 md:p-8 bg-gray-50/50 border-r border-gray-150 flex flex-col justify-between">
            <div className="flex-grow flex items-center justify-center p-6 bg-white rounded-2xl border border-gray-100 shadow-xs mb-6 max-h-[380px]">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-[320px] max-w-full object-contain mix-blend-multiply"
              />
            </div>

            {/* General Specs / Badges */}
            <div className="space-y-3.5">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-gray-800">Quality Verified</span>
                  <p className="text-gray-400">Inspected by OMNI logistics labs under rigorous US standards.</p>
                </div>
              </div>

              {product.stock <= 15 && (
                <div className="flex items-center space-x-3 bg-orange-50 border border-orange-100 p-3 rounded-xl">
                  <ShieldAlert className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-orange-700 font-medium">
                    Critical Inventory Level: Only {product.stock} units remain at this regional hub.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Purchase choices, specifications, reviews */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Manufacturer Label */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-blue-700 bg-blue-50 tracking-wider rounded-md">
                  {product.brand}
                </span>
                <span className="text-xs font-mono text-gray-400">SKU: {product.id} // SEC_REG_US</span>
              </div>

              {/* Title & Stats */}
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>

              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-850 font-mono">{product.rating}</span>
                <span>•</span>
                <span className="underline hover:text-blue-500 cursor-pointer">
                  {product.reviewCount} customer ratings
                </span>
              </div>

              {/* Purchase Config Drawer */}
              <div className="bg-gray-50/80 border border-gray-150 rounded-2xl p-4 mb-5 space-y-4">
                {/* Option One: One-time buy */}
                <label 
                  onClick={() => setPurchaseMode('once')}
                  className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    purchaseMode === 'once'
                      ? 'bg-white border-blue-500 shadow-sm'
                      : 'border-transparent hover:bg-white/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="purchaseMode"
                      checked={purchaseMode === 'once'}
                      onChange={() => setPurchaseMode('once')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">One-time Order</span>
                      <span className="text-[11px] text-gray-400">Standard single grocery shipment dispatch.</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900 font-mono">${product.price.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="block text-[10px] text-rose-500 font-semibold font-mono line-through">
                        ${product.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                </label>

                {/* Option Two: Subscribe and save */}
                {product.isSubscriptionEligible && (
                  <label 
                    onClick={() => setPurchaseMode('subscribe')}
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                      purchaseMode === 'subscribe'
                        ? 'bg-white border-blue-500 shadow-sm'
                        : 'border-transparent hover:bg-white/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          name="purchaseMode"
                          checked={purchaseMode === 'subscribe'}
                          onChange={() => setPurchaseMode('subscribe')}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-emerald-700 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            Subscribe & Save Express
                          </span>
                          <span className="text-[11px] text-gray-400 block">Auto-reorder frequency with priority logistics locks.</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-600 font-mono">
                          ${finalPrice.toFixed(2)}
                        </span>
                        <span className="block text-[9px] font-bold text-white bg-emerald-500 px-1 py-0.5 rounded-sm font-mono mt-0.5">
                          SAVE {product.subscriptionDiscountPercent}%
                        </span>
                      </div>
                    </div>

                    {purchaseMode === 'subscribe' && (
                      <div className="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                        <span className="text-[11px] font-semibold text-gray-500">Auto-Ship Interval:</span>
                        <select
                          value={subInterval}
                          onChange={(e) => setSubInterval(Number(e.target.value))}
                          className="text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg py-1 px-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value={1}>Every 1 Week (High Use)</option>
                          <option value={2}>Every 2 Weeks (Standard Essentials)</option>
                          <option value={4}>Every 4 Weeks (Monthly Grocery)</option>
                          <option value={8}>Every 8 Weeks (Pantry Refill)</option>
                        </select>
                      </div>
                    )}
                  </label>
                )}
              </div>

              {/* Delivery estimates breakdown */}
              <div className="text-xs text-gray-500 space-y-2 mb-6 border-b border-gray-100 pb-5">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  <span>Scheduled delivery to residential address available: <strong className="text-gray-800">{product.deliveryEstimate}</strong></span>
                </div>
                {product.pickupAvailable && (
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                    <span>Free warehouse storage pickup ready within 2 hours</span>
                  </div>
                )}
              </div>

              {/* Add to list trigger */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-md active:scale-98 flex items-center justify-center space-x-2 text-sm select-none mb-6"
                id="btn-add-detail-to-cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {purchaseMode === 'subscribe'
                    ? `Set Recurring Auto-Ship - $${finalPrice.toFixed(2)}`
                    : `Add One-Time Order - $${product.price.toFixed(2)}`}
                </span>
              </button>

              {/* Specifications block */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="p-2 border border-gray-100 rounded-xl bg-gray-50/40">
                      <span className="text-gray-400 font-medium block">{key}</span>
                      <strong className="text-gray-700">{val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed bullets copy */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-2">Product Capabilities</h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cross-Sell Recommendations */}
              {crossSellItems.length > 0 && (
                <div className="mb-6 p-4 border border-blue-50 rounded-2xl bg-blue-50/20">
                  <h3 className="text-xs font-bold text-blue-700 tracking-wider font-mono uppercase mb-2">
                    Frequently Bought Together
                  </h3>
                  <div className="grid grid-cols-2 gap-3" id="cross-sell-grid">
                    {crossSellItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectProduct(item)}
                        className="p-2 bg-white rounded-xl border border-blue-100 hover:border-blue-400 hover:shadow-xs transition-all flex items-center space-x-2.5 cursor-pointer"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain"
                        />
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-semibold text-gray-800 line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-xs font-bold text-blue-600 font-mono">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews subsection */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-3">
                  Customer Reflections ({product.reviews.length || 3})
                </h3>
                <div className="space-y-3">
                  {(product.reviews.length > 0
                    ? product.reviews
                    : [
                        {
                          author: 'National Shopper',
                          rating: 5,
                          comment:
                            'Very crisp packaging, same-day delivery fulfilled perfectly on schedule as estimated.',
                          date: 'May 22, 2026',
                        },
                        {
                          author: 'ValueBuyer',
                          rating: 4,
                          comment:
                            'Excellent performance with bulk savings, durable specs, and perfect fit.',
                          date: 'May 18, 2026',
                        },
                      ]
                  ).map((rev, idx) => (
                    <div key={idx} className="p-3 bg-gray-50/40 border border-gray-100 rounded-xl">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono mb-1">
                        <strong className="text-gray-700">{rev.author}</strong>
                        <span>{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400 mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-current' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 leading-normal">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
