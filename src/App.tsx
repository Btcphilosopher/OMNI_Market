import React, { useState, useEffect } from 'react';
import { 
  Apple, Laptop, Home as HomeIcon, Shirt, Flame, Pill, HelpCircle, 
  Sparkles, Star, ChevronRight, Check, MapPin, Truck, HelpCircle as HelpIcon,
  Search, ShieldAlert, Award, Calendar, ExternalLink, Layers, Users
} from 'lucide-react';
import { Product, CartItem, HouseholdProfile, HouseholdSubscription, Order, Coupon } from './types';
import { mockProducts } from './data/products';

import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTracker from './components/OrderTracker';
import AccountPanel from './components/AccountPanel';
import DealsBoard from './components/DealsBoard';

// Sample default household profiles
const DEFAULT_PROFILES: HouseholdProfile[] = [
  {
    id: 'hp1',
    name: 'Homer Simpson',
    role: 'Primary',
    avatarColor: 'bg-blue-600',
    selectedCategories: ['Groceries', 'Electronics', 'Auto & Hardware'],
    dietaryPreferences: ['Doughnuts', 'Beer', 'Gluten-friendly'],
    frequentItems: ['g2', 'g4', 'a2'], // Milk, Eggs, Motor Oil
  },
  {
    id: 'hp2',
    name: 'Marge Simpson',
    role: 'Partner',
    avatarColor: 'bg-emerald-500',
    selectedCategories: ['Groceries', 'Home', 'Pharmacy'],
    dietaryPreferences: ['Organic', 'Low Sodium'],
    frequentItems: ['g1', 'g3', 'h2', 'p2'], // Blueberries, Bread, Pillows, Vitamins
  },
  {
    id: 'hp3',
    name: 'Bart Simpson',
    role: 'Kid',
    avatarColor: 'bg-orange-500',
    selectedCategories: ['Electronics', 'Clothing'],
    dietaryPreferences: ['Extreme sugar'],
    frequentItems: ['e2', 'c1'], // Earbuds, Activewear Shorts
  },
  {
    id: 'hp4',
    name: 'Lisa Simpson',
    role: 'Kid',
    avatarColor: 'bg-purple-500',
    selectedCategories: ['Groceries', 'Home'],
    dietaryPreferences: ['Vegetarian', 'Plant-based'],
    frequentItems: ['g1', 'g5', 'h3'], // Blueberries, Avocados, storage bins
  },
];

// Initial Starting historical invoice orders to simulate returns system on load
const INITIAL_ORDER_HISTORY = (products: Product[]): Order[] => [
  {
    id: 'OMNI-INV-8022',
    date: 'May 28, 2026',
    items: [
      { product: products[0], quantity: 2, isSubscription: false }, // Blueberries
      { product: products[11], quantity: 1, isSubscription: false }, // Tees crew pack
    ],
    subtotal: 28.46,
    tax: 2.35,
    deliveryFee: 0,
    discount: 0,
    total: 30.81,
    status: 'delivered',
    deliveryMethod: 'delivery',
    address: '742 Evergreen Terrace, Chicago, IL 60611',
    scheduledTime: 'May 28, 4:00 PM - 6:00 PM',
  },
  {
    id: 'OMNI-INV-7911',
    date: 'May 15, 2026',
    items: [
      { product: products[6], quantity: 1, isSubscription: true, subscriptionIntervalWeeks: 4 }, // Charger wireless station
    ],
    subtotal: 34.50,
    tax: 2.85,
    deliveryFee: 7.99,
    discount: 3.45,
    total: 41.89,
    status: 'delivered',
    deliveryMethod: 'delivery',
    address: '742 Evergreen Terrace, Chicago, IL 60611',
    scheduledTime: 'May 15, 8:00 AM - 10:00 AM',
  }
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'deals' | 'tracker' | 'account'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Household & Location
  const [profiles, setProfiles] = useState<HouseholdProfile[]>(DEFAULT_PROFILES);
  const [currentProfile, setCurrentProfile] = useState<HouseholdProfile>(DEFAULT_PROFILES[0]);
  const [deliveryZip, setDeliveryZip] = useState('60611');

  // Shopping Cart & Auto-ships
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<HouseholdSubscription[]>([
    {
      id: 'sub-orgmilk',
      productId: 'g2',
      productName: 'Valley Farms Grass-Fed Organic Whole Milk (1 Gal)',
      productImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=300&q=80',
      price: 4.88, // 10% sub discount applied
      intervalWeeks: 2,
      nextDeliveryDate: 'Jun 10, 2026',
      quantity: 2,
      status: 'Active',
    },
    {
      id: 'sub-vitamins',
      productId: 'p2',
      productName: 'BioDaily Smart Complete Adult Multivitamin Gummy (150ct)',
      productImage: 'https://images.unsplash.com/photo-1611010343333-b96472d2d5a1?auto=format&fit=crop&w=300&q=80',
      price: 11.03, // 15% sub discount applied
      intervalWeeks: 4,
      nextDeliveryDate: 'Jun 28, 2026',
      quantity: 1,
      status: 'Active',
    }
  ]);

  // Coupons & Deals
  const [clippedCoupons, setClippedCoupons] = useState<string[]>(['OMNISAVE']);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Modals & Panels toggle state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active Simulated Deliveries & Records
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>(INITIAL_ORDER_HISTORY(mockProducts));

  // Switch home recommendation cards on profile swap
  const [profileFavorites, setProfileFavorites] = useState<Product[]>([]);

  useEffect(() => {
    // Populate household favorites recommendation segment dynamically based on user profile index
    const favs = mockProducts.filter(p => currentProfile.frequentItems.includes(p.id));
    setProfileFavorites(favs);
  }, [currentProfile]);

  // Handler: Add item to logistics cart list
  const handleAddToCart = (product: Product, isSub: boolean, intervalWeeks?: number) => {
    setCartItems(prev => {
      const match = prev.find(item => item.product.id === product.id && item.isSubscription === isSub);
      if (match) {
        return prev.map(item => 
          (item.product.id === product.id && item.isSubscription === isSub)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, isSubscription: isSub, subscriptionIntervalWeeks: intervalWeeks || 4 }];
    });
  };

  const handleUpdateQty = (productId: string, quantity: number, isSub: boolean) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, isSub);
      return;
    }
    setCartItems(prev => prev.map(item => 
      (item.product.id === productId && item.isSubscription === isSub)
        ? { ...item, quantity }
        : item
    ));
  };

  const handleRemoveItem = (productId: string, isSub: boolean) => {
    setCartItems(prev => prev.filter(item => !(item.product.id === productId && item.isSubscription === isSub)));
  };

  // Handler: Subscriptions mutate
  const handleAddSubscription = (product: Product, quantity: number, weeks: number) => {
    const newSub: HouseholdSubscription = {
      id: `sub-${Math.random().toString(36).substring(4, 9)}`,
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price * (1 - (product.subscriptionDiscountPercent || 10) / 100),
      intervalWeeks: weeks,
      nextDeliveryDate: 'Jun 17, 2026',
      quantity,
      status: 'Active',
    };
    setSubscriptions(prev => [...prev, newSub]);
  };

  const handleToggleSubStatus = (subId: string, state: 'Active' | 'Paused') => {
    setSubscriptions(prev => prev.map(sub => sub.id === subId ? { ...sub, status: state } : sub));
  };

  const handleChangeSubInterval = (subId: string, intervalWeeks: number) => {
    setSubscriptions(prev => prev.map(sub => sub.id === subId ? { ...sub, intervalWeeks } : sub));
  };

  const handleCancelSub = (subId: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== subId));
  };

  // Add Household profile member
  const handleAddProfile = (newMemb: Omit<HouseholdProfile, 'id'>) => {
    const prof: HouseholdProfile = {
      ...newMemb,
      id: `hp-${Math.random().toString(36).substring(4, 8)}`,
    };
    setProfiles(prev => [...prev, prof]);
  };

  // Process and stamp return refund immediately
  const handleProcessRefundReturn = (orderId: string, itemIdx: number, reason: string) => {
    setOrderHistory(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'delivered' // marked returned internally or credited
        }
      }
      return order;
    }));
  };

  // Confirm Dispatch Checkout Submit
  const handleConfirmOrder = (orderData: {
    address: string;
    scheduledTime: string;
    deliveryMethod: 'delivery' | 'pickup';
    paymentMethod: string;
  }) => {
    // Collect all cart details
    const subtotal = cartItems.reduce((acc, curr) => {
      let p = curr.product.price;
      if (curr.isSubscription && curr.product.subscriptionDiscountPercent) {
        p = p * (1 - curr.product.subscriptionDiscountPercent / 100);
      }
      return acc + p * curr.quantity;
    }, 0);

    const discountAmount = appliedCoupon
      ? appliedCoupon.discountType === 'percent'
        ? (subtotal * appliedCoupon.value) / 100
        : appliedCoupon.value
      : 0;

    const deliveryFee = orderData.deliveryMethod === 'pickup' ? 0 : subtotal >= 50 ? 0 : 7.99;
    const tax = (subtotal - discountAmount) * 0.0825;
    const total = subtotal - discountAmount + deliveryFee + tax;

    const orderRecord: Order = {
      id: `OMNI-INV-${Math.round(1000 + Math.random() * 8999)}`,
      date: 'Today, Just Now',
      items: [...cartItems],
      subtotal,
      tax,
      deliveryFee,
      discount: discountAmount,
      total,
      status: 'ordered',
      deliveryMethod: orderData.deliveryMethod,
      address: orderData.address,
      scheduledTime: orderData.scheduledTime,
      driverName: 'Marcus Fletcher',
    };

    // Split out any subscriptions created inside this cart and automatically append them to user account panel!
    cartItems.forEach(item => {
      if (item.isSubscription) {
        handleAddSubscription(item.product, item.quantity, item.subscriptionIntervalWeeks || 4);
      }
    });

    setActiveOrder(orderRecord);
    setOrderHistory(prev => [orderRecord, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setActiveTab('tracker');
  };

  // Helper selectors
  const categoriesList = ['Groceries', 'Electronics', 'Home', 'Clothing', 'Pharmacy', 'Auto & Hardware'];

  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? (p.category === selectedCategory) : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* HEADER NAVIGATION HUD */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        currentProfile={currentProfile}
        profiles={profiles}
        onSelectProfile={setCurrentProfile}
        deliveryZip={deliveryZip}
        onUpdateZip={setDeliveryZip}
      />

      {/* PRIMARY VIEWS SWITCHBOARD */}
      <main className="flex-grow pb-16 md:pb-6">
        
        {/* VIEW 1: HOME PAGE (SMART RETAIL DASHBOARD) */}
        {activeTab === 'home' && (
          <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-6 py-6" id="home-dashboard-panel">
            
            {/* National OS Search-First Hero Panel */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-750 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden flex flex-col justify-between space-y-6 md:space-y-8 select-none shadow-md">
              {/* Abs decoration backdrop elements */}
              <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-indigo-200 to-slate-900 pointer-events-none" />

              <div className="space-y-3 relative z-10">
                <span className="inline-block px-3 py-1 bg-white/20 text-[10px] font-bold font-mono tracking-wider rounded-lg uppercase">
                  Logistics Node Dispatch: Chicago Metro Area
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white max-w-3xl">
                  Intelligent Direct-Refills For Everyday American Life.
                </h1>
                <p className="text-xs md:text-sm text-blue-100 max-w-xl font-sans">
                  Instantly deploy same-day home shipping or lock in automated weekly grocery deliveries tailored to your household profile configuration.
                </p>
              </div>

              {/* Sub categories shortcut grids */}
              <div>
                <h3 className="text-xs font-bold text-blue-200 font-mono uppercase mb-3 tracking-widest">
                  Quick Category Pathways
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: 'Groceries', icon: Apple, color: 'hover:bg-emerald-500' },
                    { name: 'Electronics', icon: Laptop, color: 'hover:bg-indigo-650' },
                    { name: 'Home', icon: HomeIcon, color: 'hover:bg-amber-600' },
                    { name: 'Clothing', icon: Shirt, color: 'hover:bg-pink-600' },
                    { name: 'Pharmacy', icon: Pill, color: 'hover:bg-teal-550' },
                    { name: 'Auto & Hardware', icon: Flame, color: 'hover:bg-rose-600' },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setActiveTab('catalog');
                        setSearchTerm('');
                      }}
                      className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white font-bold rounded-2xl flex items-center space-x-2.5 transition text-xs text-left"
                    >
                      <cat.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart recommendations tailored based on profile preferences */}
            <div>
              <div className="flex justify-between items-end border-b border-gray-150 pb-3 mb-5">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                    <h3 className="text-base font-bold text-gray-900 leading-none">
                      Refills Suggested For Your Household
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 font-mono uppercase mt-1">
                    AI-style inventory matching for <strong className="text-blue-600">{currentProfile.name} ({currentProfile.role})</strong>.
                  </p>
                </div>
                <button 
                  onClick={() => setActiveTab('account')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center"
                >
                  <span>Edit Household Preferences</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              {profileFavorites.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 border border-gray-150 rounded-2xl">
                  <p className="text-xs text-gray-400">Loading household favorite suggestions...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {profileFavorites.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={(prod) => setSelectedDetailProduct(prod)}
                      onAddToCart={(prod, isSub) => handleAddToCart(prod, isSub)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Localized Trending Sales banner element */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Flash Deal Circular highlight */}
              <div className="lg:col-span-2 bg-rose-50 border border-rose-100 p-5 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-rose-600 mb-2 font-mono text-xs font-bold">
                    <Flame className="w-4.5 h-4.5 animate-bounce" />
                    <span>REGIONAL WAREHOUSE CLEARANCE</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    Trending Price Reductions in ZIP Area {deliveryZip}
                  </h3>
                  <p className="text-xs text-gray-500 leading-normal max-w-md mt-1">
                    Enjoy up to 25% off high-volume electronic appliances and organizational home bins immediately.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-rose-100">
                  <span className="text-xs font-mono text-rose-600 font-bold">4 DESTRUCTIVE DISCOUNTS LOADED</span>
                  <button 
                    onClick={() => setActiveTab('deals')}
                    className="bg-rose-550 hover:bg-rose-650 text-white font-bold py-1.5 px-3.5 rounded-xl text-xs transition"
                  >
                    Load Circular Flyer
                  </button>
                </div>
              </div>

              {/* Delivery Speed / Telemetry summary poster */}
              <div className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-blue-600 mb-2 font-mono text-xs font-bold">
                    <Truck className="w-4.5 h-4.5" />
                    <span>SHIPMENT CAPACITY REAL-TIME</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 font-sans">Same-Day Delivery Status</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-normal">
                    Fulfillments are running perfectly green. Estimated local delivery dispatch takes under 2 hours.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-50 mt-4 text-[10px] text-emerald-600 font-mono font-bold uppercase flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                  <span>Carrier dispatch lanes 100% active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOG SYSTEM */}
        {activeTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6" id="catalog-system">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Category Filter Sidebar widget */}
              <aside className="lg:w-1/4 sidebar-card p-4 space-y-5 h-fit shrink-0">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 tracking-wider font-mono uppercase mb-3">Merchant Departments</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                        selectedCategory === null 
                          ? 'bg-blue-600 text-white font-bold' 
                          : 'text-gray-650 hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3.5 py-2 text-xs font-semibold rounded-xl transition ${
                          selectedCategory === cat 
                            ? 'bg-blue-600 text-white font-bold' 
                            : 'text-gray-650 hover:bg-gray-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub features overview filtering boxes */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 tracking-wider font-mono uppercase mb-2">Delivery Speed</h4>
                    <label className="flex items-center space-x-2 text-xs text-gray-750 font-medium">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-100" />
                      <span>Same-day home carrier</span>
                    </label>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-gray-400 tracking-wider font-mono uppercase mb-2">Refill Class</h4>
                    <label className="flex items-center space-x-2 text-xs text-gray-750 font-medium">
                      <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-100" />
                      <span>Autoreorder Eligible (10% discount)</span>
                    </label>
                  </div>
                </div>
              </aside>

              {/* Product Grid Panel of catalog products */}
              <div className="lg:w-3/4 space-y-5">
                <div className="flex justify-between items-center bg-white border border-gray-105 px-4 py-3 rounded-2xl text-xs text-gray-500 font-sans">
                  <span>DISCHARGING {filteredProducts.length} ITEMS MATCHED</span>
                  {selectedCategory && (
                    <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md font-mono">
                      DEPT: {selectedCategory.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl">
                    <ShieldAlert className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-700">No matching catalog items logged</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      Refit your search parameters or select a different merchant department department on the left side tracker.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onSelect={(prod) => setSelectedDetailProduct(prod)}
                        onAddToCart={(prod, isSub) => handleAddToCart(prod, isSub)}
                      />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* VIEW 3: WEEKLY DEALS + COUPON CODES */}
        {activeTab === 'deals' && (
          <DealsBoard
            onClipCoupon={(coupon) => {
              if (!clippedCoupons.includes(coupon.code)) {
                setClippedCoupons(prev => [...prev, coupon.code]);
              }
            }}
            clippedCoupons={clippedCoupons}
            onSelectProduct={(p) => setSelectedDetailProduct(p)}
          />
        )}

        {/* VIEW 4: LIVE ORDER TRACKING VEHICLE PATH */}
        {activeTab === 'tracker' && (
          <OrderTracker
            activeOrder={activeOrder}
            onSetStatus={(status) => {
              if (activeOrder) {
                const updated = { ...activeOrder, status };
                setActiveOrder(updated);
                setOrderHistory(prev => prev.map(o => o.id === activeOrder.id ? updated : o));
              }
            }}
          />
        )}

        {/* VIEW 5: USER HOUSEHOLD ACCOUNT SETTINGS */}
        {activeTab === 'account' && (
          <AccountPanel
            currentProfile={currentProfile}
            profiles={profiles}
            onSelectProfile={setCurrentProfile}
            onAddProfile={handleAddProfile}
            subscriptions={subscriptions}
            onChangeSubStatus={handleToggleSubStatus}
            onChangeSubInterval={handleChangeSubInterval}
            onCancelSub={handleCancelSub}
            orderHistory={orderHistory}
            onTriggerReturn={handleProcessRefundReturn}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-gray-400 text-xs py-10 font-sans" id="footer-superplatform">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center font-black tracking-tight text-white gap-2 mb-3.5">
              <Layers className="w-5 h-5 text-blue-500" />
              <span>OMNIMARKET OS</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-mono">
              FIPS COMPLIANT DIGITAL COMMERCE OPERATING SYSTEM FOR MASS RETAIL MANAGEMENT AND AUTOMATED HOME RESUPPLY.
            </p>
          </div>

          <div>
            <strong className="text-white block font-semibold mb-3">Departments</strong>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => { setSelectedCategory('Groceries'); setActiveTab('catalog'); }} className="hover:text-white text-left transition-colors">Bulk Groceries & Refills</button></li>
              <li><button onClick={() => { setSelectedCategory('Electronics'); setActiveTab('catalog'); }} className="hover:text-white text-left transition-colors">Tech Hardware & Immersive Displays</button></li>
              <li><button onClick={() => { setSelectedCategory('Home'); setActiveTab('catalog'); }} className="hover:text-white text-left transition-colors">Home Storage & Appliances</button></li>
              <li><button onClick={() => { setSelectedCategory('Pharmacy'); setActiveTab('catalog'); }} className="hover:text-white text-left transition-colors">BioDaily Wellness Pharmacy</button></li>
            </ul>
          </div>

          <div>
            <strong className="text-white block font-semibold mb-3">Household Profiles</strong>
            <ul className="space-y-2 text-[11px]">
              {profiles.map(p => (
                <li key={p.id}>
                  <button onClick={() => { setCurrentProfile(p); setActiveTab('home'); }} className="hover:text-white text-left transition-colors flex items-center">
                    <span className={`w-2 h-2 rounded-full ${p.avatarColor} mr-2`} />
                    <span>{p.name} ({p.role})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <strong className="text-white block font-semibold mb-3">Operational Support</strong>
            <p className="text-[11px] text-gray-500 leading-normal mb-3 font-mono">
              Regional logistics towers actively route shipments. Free standard same-day free shipment active over $50 spent.
            </p>
            <div className="flex items-center text-emerald-500 font-mono text-[10px]">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping mr-2" />
              <span>LOGISTICS GRIDS 100% ONLINE</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-mono">
          <span>© 2026 OMNIMARKET OS SYSTEM INC. LICENSED FOR US HOUSEHOLD OPERATIONS. ALL SECURITY RESERVED.</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <span className="hover:text-gray-400 cursor-pointer">PRIVACY PROTOCOL</span>
            <span>•</span>
            <span className="hover:text-gray-400 cursor-pointer">CARRIER LOG CLAUSE</span>
          </div>
        </div>
      </footer>

      {/* DETAILED DRAWERS & DIALOG MODALS POPUPS */}
      
      {/* Product Information Detail Modal */}
      {selectedDetailProduct && (
        <ProductDetailModal
          product={selectedDetailProduct}
          onClose={() => setSelectedDetailProduct(null)}
          allProducts={mockProducts}
          onSelectProduct={setSelectedDetailProduct}
          onAddToCart={(prod, isSub, interval) => {
            handleAddToCart(prod, isSub, interval);
            // Auto open the cart drawer so user gets visual validation!
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Assembly Cart Drawer sidebar */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onBeginCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Secure Checkout Screen Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          cartItems={cartItems}
          appliedCoupon={appliedCoupon}
          onClose={() => setIsCheckoutOpen(false)}
          deliveryZip={deliveryZip}
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {/* Touch-Friendly bottom navbar on mobile devices */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2.5 px-6 flex justify-between items-center z-45" id="mobile-bottom-tabs">
        <button 
          onClick={() => { setActiveTab('home'); setSelectedCategory(null); }}
          className={`flex flex-col items-center text-[10px] uppercase font-bold transition ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-450'}`}
        >
          <HomeIcon className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => { setActiveTab('catalog'); }}
          className={`flex flex-col items-center text-[10px] uppercase font-bold transition ${activeTab === 'catalog' ? 'text-blue-600' : 'text-gray-450'}`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Catalog</span>
        </button>

        <button 
          onClick={() => { setActiveTab('deals'); }}
          className={`flex flex-col items-center text-[10px] uppercase font-bold transition ${activeTab === 'deals' ? 'text-blue-600' : 'text-gray-450'}`}
        >
          <Flame className="w-5 h-5 mb-0.5 text-rose-500 animate-pulse" />
          <span>Deals</span>
        </button>

        <button 
          onClick={() => { setActiveTab('account'); }}
          className={`flex flex-col items-center text-[10px] uppercase font-bold transition ${activeTab === 'account' ? 'text-blue-600' : 'text-gray-450'}`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span>Users</span>
        </button>
      </div>

    </div>
  );
}
