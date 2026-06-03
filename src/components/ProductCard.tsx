import { Star, ShoppingCart, Truck, Zap, Calendar } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, isSub: boolean) => void;
  key?: string;
}

export default function ProductCard({ product, onSelect, onAddToCart }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const isLowStock = product.stock <= 10;

  return (
    <div 
      className="product-card group flex flex-col h-full font-sans cursor-pointer relative hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-slate-300"
      onClick={() => onSelect(product)}
      id={`prod-card-${product.id}`}
    >
      {/* Banner / Deal Badges */}
      <div className="absolute top-2 left-2 {`*z-10`} flex flex-col gap-1.5 z-10 select-none">
        {product.bestseller && (
          <span className="status-badge bg-blue-600 text-white shadow-xs font-mono">
            Bestseller
          </span>
        )}
        {hasDiscount && (
          <span className="status-badge savings-pill font-mono">
            -{discountPercent}% TODAY
          </span>
        )}
        {product.isSubscriptionEligible && (
          <span className="status-badge bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1 font-mono">
            <Calendar className="w-2.5 h-2.5" />
            REFILLABLE
          </span>
        )}
      </div>

      {/* Product Image Section */}
      <div className="relative w-full h-44 bg-slate-50 flex items-center justify-center overflow-hidden p-4 select-none border-b border-slate-100">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />
        {/* Quick specs pill */}
        <div className="absolute bottom-2 right-2 bg-slate-800 text-[10px] font-semibold text-slate-100 px-2 py-0.5 rounded font-mono select-none">
          {product.brand}
        </div>
      </div>

      {/* Item Info section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Sub-category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-slate-450 uppercase tracking-wider mb-2 font-mono">
          <span>{product.category}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="font-bold text-slate-700">{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-tight flex-grow mb-3 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>

        {/* Logistics estimates */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center text-[11px] text-slate-500 font-medium">
            <Truck className="w-3.5 h-3.5 text-blue-500 mr-2 flex-shrink-0" />
            <span className="leading-none">{product.deliveryEstimate}</span>
          </div>
          {product.pickupAvailable && (
            <div className="flex items-center text-[10px] text-emerald-600 font-semibold font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 flex-shrink-0" />
              <span>PICKUP COMPLIANT</span>
            </div>
          )}
          {isLowStock ? (
            <span className="inline-block text-[10px] font-bold text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded font-mono mt-1 uppercase tracking-wide">
              Low Stock: {product.stock} units
            </span>
          ) : (
            <span className="inline-block text-[10px] font-bold text-slate-400 font-mono tracking-wider mt-1 uppercase">
              ID: {product.id.toUpperCase()}
            </span>
          )}
        </div>

        {/* Price & Action Section */}
        <div className="pt-3.5 border-t border-slate-100 flex items-end justify-between" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through font-mono leading-none mb-1">
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
            <span className="text-xl price-font text-slate-900 leading-none">
              ${product.price.toFixed(2)}
            </span>
            <span className="status-badge delivery-pill w-fit mt-1.5 uppercase font-mono py-0.5">
              Refill Eligible
            </span>
          </div>

          <button
            onClick={() => onAddToCart(product, false)}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-full font-bold transition-all active:scale-90 shadow-sm focus:outline-none"
            title="Add instant delivery item"
          >
            <span className="text-lg leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  );
}
