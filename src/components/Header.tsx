import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, MapPin, Users, Flame, Gift, RefreshCw, Layers, ShieldCheck, Check } from 'lucide-react';
import { CartItem, HouseholdProfile } from '../types';
import { mockProducts } from '../data/products';

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  activeTab: 'home' | 'catalog' | 'deals' | 'tracker' | 'account';
  setActiveTab: (tab: 'home' | 'catalog' | 'deals' | 'tracker' | 'account') => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  currentProfile: HouseholdProfile;
  profiles: HouseholdProfile[];
  onSelectProfile: (profile: HouseholdProfile) => void;
  deliveryZip: string;
  onUpdateZip: (zip: string) => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  setActiveTab,
  cartItems,
  onOpenCart,
  currentProfile,
  profiles,
  onSelectProfile,
  deliveryZip,
  onUpdateZip,
}: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showZipModal, setShowZipModal] = useState(false);
  const [zipInput, setZipInput] = useState(deliveryZip);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute search suggestions based on input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Show trending suggestions
      setSuggestions(['Organic fruit', '4K Smart TV', 'Memory Foam Pillows', 'Activewear', 'Acetaminophen']);
    } else {
      const query = searchTerm.toLowerCase();
      const filtered = mockProducts
        .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))
        .map(p => p.name)
        .slice(0, 5);
      
      // Also add category matches
      const catMatch = mockProducts
        .filter(p => p.category.toLowerCase().includes(query))
        .map(p => p.category);
      const uniqueSuggestions = Array.from(new Set([...catMatch, ...filtered]));
      setSuggestions(uniqueSuggestions.slice(0, 6));
    }
  }, [searchTerm]);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/^\d{5}$/.test(zipInput)) {
      onUpdateZip(zipInput);
      setShowZipModal(false);
    } else {
      alert('Please enter a valid 5-digit US ZIP Code.');
    }
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel shadow-sm">
      {/* Top Banner: Futuristic US Logistics Telemetry */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4 flex justify-between items-center tracking-wide font-mono select-none">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-2" />
            <span className="text-gray-450 uppercase">NODE_US_CHICAGO_01 // ONLINE</span>
          </div>
          <span className="hidden md:inline text-gray-700">|</span>
          <span className="hidden md:inline text-gray-400 uppercase">CAPACITY COUPLING: 100% OPERATIONAL</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>SECURE ENCRYPTED OS RUNNING</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row items-center md:space-x-6 space-y-3 md:space-y-0">
        {/* Logo Element */}
        <div 
          onClick={() => { setActiveTab('home'); setSelectedCategory(null); setSearchTerm(''); }}
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
          id="hdr-logo-container"
        >
          <div className="relative p-2 bg-blue-600 text-white rounded-lg shadow-xs group-hover:bg-blue-700 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center font-black text-slate-900 tracking-tight text-xl leading-none uppercase">
              OMNI<span className="text-blue-600">CORE</span>
            </div>
          </div>
        </div>

        {/* Location Selector */}
        <button 
          onClick={() => setShowZipModal(true)}
          className="flex items-center text-left text-sm text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-white transition-all select-none self-start md:self-center"
          id="btn-location-selector"
        >
          <MapPin className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
          <div className="leading-tight text-xs">
            <span className="text-slate-400 font-medium block uppercase text-[9px] tracking-wide">DELIVERING TO</span>
            <div className="font-bold text-slate-800 font-mono text-[11px] uppercase">CHICAGO, IL {deliveryZip}</div>
          </div>
        </button>

        {/* Unified Search Engine */}
        <div ref={searchRef} className="relative flex-1 w-full" id="search-box-container">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you shopping for today? (Groceries, Electronics, Essentials)"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setActiveTab('catalog');
              }}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-10 pr-12 py-2 bg-slate-100 border border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg text-sm transition-all text-slate-800 placeholder-slate-400"
              id="search-input"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-450" />
            {searchTerm && (
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                className="absolute right-12 top-2 p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
            <button 
              onClick={() => setActiveTab('catalog')}
              className="absolute right-1.5 top-1 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-xs"
              id="btn-search-trigger"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Autocomplete suggestions popup */}
          {searchFocused && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden font-sans">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs font-medium text-gray-400">
                <span>SIMULATED SMART SUGGESTIONS</span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-sm">Instant</span>
              </div>
              <ul className="divide-y divide-gray-50">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        setSearchTerm(suggestion);
                        setSearchFocused(false);
                        setActiveTab('catalog');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 text-gray-700 font-medium flex items-center transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 mr-2.5 text-blue-500 opacity-60" />
                      <span>{suggestion}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Widgets */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Quick Tabs */}
          <nav className="flex space-x-1" id="primary-navigation-tabs">
            <button
              onClick={() => { setActiveTab('deals'); setSelectedCategory(null); }}
              className={`p-2 rounded-xl flex items-center space-x-1 text-xs font-semibold tracking-tight transition-all ${
                activeTab === 'deals' 
                  ? 'bg-rose-550 border-rose-550 text-white shadow-xs' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
              id="tab-deals"
            >
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="hidden lg:inline">Deals & Coupons</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`p-2 rounded-xl flex items-center space-x-1 text-xs font-semibold tracking-tight transition-all ${
                activeTab === 'tracker' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="tab-tracker"
            >
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <span className="hidden lg:inline">Track Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('account')}
              className={`p-2 rounded-xl flex items-center space-x-1 text-xs font-semibold tracking-tight transition-all ${
                activeTab === 'account' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              id="tab-account"
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span className="hidden lg:inline">Household</span>
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Household Profile switcher */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 bg-gray-50/50"
                id="btn-profile-dropdown"
              >
                <div className={`w-7 h-7 rounded-lg ${currentProfile.avatarColor} flex items-center justify-center text-white text-xs font-bold leading-none`}>
                  {currentProfile.name[0]}
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className="text-gray-400 text-[10px] uppercase font-mono tracking-widest">{currentProfile.role}</div>
                  <div className="font-semibold text-gray-800 mt-1">{currentProfile.name}</div>
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1.5 font-sans">
                  <div className="px-3.5 py-1.5 border-b border-gray-50">
                    <span className="text-[10px] font-semibold text-gray-400 tracking-wider font-mono">HOUSEHOLD PROFILE SELECT</span>
                  </div>
                  {profiles.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        onSelectProfile(profile);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-gray-50 flex items-center justify-between text-sm transition-colors text-gray-700"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-6 h-6 rounded-md ${profile.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                          {profile.name[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 leading-none">{profile.name}</div>
                          <span className="text-[10px] text-gray-400 font-mono leading-none">{profile.role}</span>
                        </div>
                      </div>
                      {profile.id === currentProfile.id && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-gray-50 mt-1.5 pt-1.5 px-3">
                    <button 
                      onClick={() => { setActiveTab('account'); setShowProfileDropdown(false); }}
                      className="w-full text-center py-1.5 text-xs font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-colors border border-blue-50"
                    >
                      Manage Household
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Indicator */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-2 select-none"
              id="hdr-btn-cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <>
                  <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-mono animate-bounce">
                    {cartCount}
                  </span>
                  <span className="hidden lg:inline text-xs font-mono font-bold">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ZIP Selector Modal */}
      {showZipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-gray-100 shadow-xl max-h-full overflow-y-auto">
            <h3 className="text-base font-bold text-gray-900 mb-1">Set Delivery Location</h3>
            <p className="text-xs text-gray-400 mb-4">Enter standard 5-digit US Zip Code to adjust same-day inventory capacity.</p>
            <form onSubmit={handleZipSubmit}>
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider font-mono mb-1">ZIP CODE</label>
                <input
                  type="text"
                  maxLength={5}
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-center text-lg font-mono tracking-widest font-bold"
                  placeholder="60611"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowZipModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                >
                  Apply ZIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
