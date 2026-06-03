import React, { useState } from 'react';
import { Users, Calendar, Inbox, CreditCard, ShieldAlert, Check, RefreshCcw, UserPlus, Trash, ChevronDown } from 'lucide-react';
import { HouseholdProfile, HouseholdSubscription, Order } from '../types';
import { mockProducts } from '../data/products';

interface AccountPanelProps {
  currentProfile: HouseholdProfile;
  profiles: HouseholdProfile[];
  onSelectProfile: (p: HouseholdProfile) => void;
  onAddProfile: (profile: Omit<HouseholdProfile, 'id'>) => void;
  subscriptions: HouseholdSubscription[];
  onChangeSubStatus: (id: string, state: 'Active' | 'Paused') => void;
  onChangeSubInterval: (id: string, intervalWeeks: number) => void;
  onCancelSub: (id: string) => void;
  orderHistory: Order[];
  onTriggerReturn: (orderId: string, itemIdx: number, reason: string) => void;
}

export default function AccountPanel({
  currentProfile,
  profiles,
  onSelectProfile,
  onAddProfile,
  subscriptions,
  onChangeSubStatus,
  onChangeSubInterval,
  onCancelSub,
  orderHistory,
  onTriggerReturn,
}: AccountPanelProps) {
  const [activeAccountSubTab, setActiveAccountSubTab] = useState<'profiles' | 'subs' | 'history' | 'payment'>('subs');
  
  // State for creating new profile
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState<'Primary' | 'Partner' | 'Kid' | 'Guest'>('Partner');
  const [newProfileColor, setNewProfileColor] = useState('bg-purple-500');

  // State for refund trigger
  const [selectedHistOrderId, setSelectedHistOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('Arrived Late');
  const [refundDoneMsg, setRefundDoneMsg] = useState('');

  const handleAddProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onAddProfile({
      name: newProfileName,
      role: newProfileRole,
      avatarColor: newProfileColor,
      selectedCategories: ['Groceries'],
      dietaryPreferences: [],
      frequentItems: [],
    });
    setNewProfileName('');
  };

  const handleReturnSubmit = (orderId: string, itemIdx: number) => {
    onTriggerReturn(orderId, itemIdx, refundReason);
    setRefundDoneMsg(`Refund successful! $${orderHistory.find(o => o.id === orderId)?.items[itemIdx].product.price.toFixed(2)} credited back to your account.`);
    setTimeout(() => {
      setRefundDoneMsg('');
    }, 4000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left sidebar subtabs navigation */}
        <div className="lg:w-1/4 sidebar-card p-4 space-y-1.5 h-fit shrink-0">
          <span className="block text-[10px] font-bold text-slate-400 font-mono mb-2 uppercase tracking-wider">Account Dashboard Node</span>
          
          <button
            onClick={() => setActiveAccountSubTab('subs')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all ${
              activeAccountSubTab === 'subs' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Recurring Auto-Ships</span>
            {subscriptions.length > 0 && (
              <span className="ml-auto font-mono text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-sm font-bold">
                {subscriptions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAccountSubTab('profiles')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all ${
              activeAccountSubTab === 'profiles' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Household Profiles</span>
          </button>

          <button
            onClick={() => setActiveAccountSubTab('history')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all ${
              activeAccountSubTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Invoices & Returns</span>
          </button>

          <button
            onClick={() => setActiveAccountSubTab('payment')}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 transition-all ${
              activeAccountSubTab === 'payment' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Secure Wallets</span>
          </button>
        </div>

        {/* Right subtab content container */}
        <div className="lg:w-3/4 sidebar-card p-5 md:p-6 min-h-[440px]">
          {activeAccountSubTab === 'subs' && (
            // SUBSCRIPTIONS PANEL
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Essentials Auto-Ship Subscriptions</h2>
                <p className="text-xs text-gray-400 font-mono uppercase mt-0.5">Recurring automated kitchen & medicine refill locks.</p>
              </div>

              {subscriptions.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/40">
                  <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-gray-600">No active grocery subscriptions</p>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
                    Select dairy, grocery essentials, or vitamins in our catalog, config 'Subscribe & Save' and unlock automated weekly deliveries with up to 15% discount.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="p-4 bg-white border border-gray-150 hover:border-blue-200 rounded-2xl transition shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Header banner */}
                        <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                            sub.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-850'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">{sub.id.toUpperCase()}</span>
                        </div>

                        {/* Product reference thumbnail */}
                        <div className="flex items-center space-x-3 mb-3.5">
                          <img
                            src={sub.productImage}
                            alt={sub.productName}
                            className="w-12 h-12 object-contain bg-gray-50 p-1 border border-gray-100 rounded-lg"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{sub.productName}</h4>
                            <span className="text-xs font-semibold text-blue-600 font-mono">${sub.price.toFixed(2)}/ea</span>
                          </div>
                        </div>

                        {/* Interval selector controls */}
                        <div className="bg-gray-50 p-2.5 rounded-xl text-xs space-y-1.5 border border-gray-100 mb-4 font-mono">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Qty:</span>
                            <span className="font-bold text-gray-700">{sub.quantity} units</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Interval:</span>
                            <select
                              value={sub.intervalWeeks}
                              onChange={(e) => onChangeSubInterval(sub.id, Number(e.target.value))}
                              className="bg-white border border-gray-200 rounded font-bold px-1.5 py-0.5 focus:outline-none"
                            >
                              <option value={1}>1 Week</option>
                              <option value={2}>2 Weeks</option>
                              <option value={4}>4 Weeks</option>
                              <option value={8}>8 Weeks</option>
                            </select>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Next Ship Date:</span>
                            <span className="font-semibold text-gray-800">{sub.nextDeliveryDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action links */}
                      <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                        <button
                          onClick={() => onChangeSubStatus(sub.id, sub.status === 'Active' ? 'Paused' : 'Active')}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          {sub.status === 'Active' ? 'Pause Refills' : 'Resume Refills'}
                        </button>
                        <button
                          onClick={() => onCancelSub(sub.id)}
                          className="text-xs font-semibold text-rose-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAccountSubTab === 'profiles' && (
            // HOUSEHOLD PROFILES PANEL
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Manage Household Shopping Profiles</h2>
                <p className="text-xs text-gray-400 font-mono uppercase mt-0.5">Let family members log and configure personalized item lists securely.</p>
              </div>

              {/* Profiles list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profiles.map((prof) => (
                  <div
                    key={prof.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      prof.id === currentProfile.id
                        ? 'border-blue-500 bg-blue-50/10'
                        : 'border-gray-150 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-10 h-10 rounded-xl ${prof.avatarColor} flex items-center justify-center text-white text-base font-black`}>
                        {prof.name[0]}
                      </div>
                      <div>
                        <strong className="text-sm text-gray-800 block">{prof.name}</strong>
                        <span className="text-[10px] uppercase font-bold text-blue-650 bg-blue-100/50 px-1.5 py-0.2 rounded font-mono">
                          {prof.role}
                        </span>
                      </div>
                    </div>
                    {prof.id !== currentProfile.id && (
                      <button
                        onClick={() => onSelectProfile(prof)}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Switch To
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add member form */}
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                <h3 className="text-xs font-bold text-gray-450 uppercase mb-3 flex items-center">
                  <UserPlus className="w-4 h-4 text-blue-500 mr-1.5" />
                  Add Household Carrier
                </h3>
                <form onSubmit={handleAddProfileSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-450 mb-1">Carrier Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lisa"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-450 mb-1">Household Role</label>
                    <select
                      value={newProfileRole}
                      onChange={(e) => setNewProfileRole(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="Partner">Partner / Spouse</option>
                      <option value="Kid">Kid / Minor</option>
                      <option value="Guest">Guest / Cousin</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                  >
                    Add Member
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeAccountSubTab === 'history' && (
            // INVOICES & RETURNS PANEL
            <div className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-gray-900">Historical Invoices & Returns System</h2>
                <p className="text-xs text-gray-400 font-mono uppercase mt-0.5">Automated prompt refunds under the American retail operating security act.</p>
              </div>

              {refundDoneMsg && (
                <div className="p-3 bg-emerald-600 text-white font-sans text-xs font-bold rounded-xl shadow-md animate-bounce">
                  {refundDoneMsg}
                </div>
              )}

              {orderHistory.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl bg-gray-50/40">
                  <Inbox className="w-10 h-10 text-gray-300 mx-auto mb-2.5" />
                  <p className="text-xs font-bold text-gray-600 font-sans">No previous invoices found</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mt-1">Place shipping items to populated records here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orderHistory.map((invoice) => (
                    <div key={invoice.id} className="p-4 bg-white border border-gray-200 rounded-2xl">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2.5 mb-3 font-mono text-[11px] text-gray-400">
                        <span>Invoice: <strong>{invoice.id}</strong></span>
                        <span>Date: {invoice.date}</span>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {invoice.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center space-x-2.5">
                              <img
                                src={it.product.image}
                                alt={it.product.name}
                                className="w-7 h-7 object-contain rounded"
                              />
                              <span className="font-semibold text-gray-850 line-clamp-1 max-w-[280px]">
                                {it.quantity}x {it.product.name}
                              </span>
                            </div>

                            {/* Return action button trigger */}
                            <div className="flex items-center space-x-3.5 font-mono">
                              <span className="font-bold text-gray-700">${(it.product.price * it.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => setSelectedHistOrderId(invoice.id === selectedHistOrderId ? null : invoice.id)}
                                className="text-[10px] text-rose-505 font-bold hover:underline py-1 px-2 border border-rose-100 bg-rose-50/20 rounded-md"
                              >
                                Trigger Return
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Refund selector dropdown */}
                      {selectedHistOrderId === invoice.id && (
                        <div className="mt-4 p-3 bg-rose-50/40 border border-rose-100 rounded-xl space-y-3">
                          <span className="text-[10px] font-bold text-rose-800 font-mono flex items-center">
                            <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />
                            SECURE AUTOMATED RETURN PROCESS
                          </span>
                          <div className="flex gap-2 items-end">
                            <div className="flex-grow">
                              <label className="block text-[9px] font-bold text-gray-400 mb-1 font-mono">REASON FOR RETURN</label>
                              <select
                                value={refundReason}
                                onChange={(e) => setRefundReason(e.target.value)}
                                className="w-full text-xs font-bold py-1 px-2 bg-white border border-gray-200 rounded-lg focus:outline-none"
                              >
                                <option value="Arrived Late / Damaged">Arrived Late / Damaged</option>
                                <option value="Wrong Item Dispatched">Wrong Item Dispatched</option>
                                <option value="Accidental Purchase">Accidental Purchase</option>
                                <option value="Quality Unsatisfactory">Quality Unsatisfactory</option>
                              </select>
                            </div>
                            <button
                              onClick={() => handleReturnSubmit(invoice.id, 0)}
                              className="bg-rose-500 hover:bg-rose-605 text-white font-bold py-1 px-3 rounded-lg text-xs transition"
                            >
                              Deploy Refund
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Financial wrap */}
                      <div className="flex justify-between items-center text-xs text-gray-400 font-mono mt-3 pt-3 border-t border-gray-100">
                        <span>ESTIMATE CODELOCK: MD_OS_{invoice.id.slice(-4)}</span>
                        <span className="font-extrabold text-blue-600 text-sm font-mono">Total Paid: ${invoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeAccountSubTab === 'payment' && (
            // SECURE PAYMENTS PANEL
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-bold text-gray-900">Registered Secured Payment Methods</h2>
                <p className="text-xs text-gray-400 font-mono uppercase mt-0.5">Compliant with US national high-security shopping acts.</p>
              </div>

              <div className="p-5 border border-blue-50 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-750 text-white space-y-6 max-w-sm select-none shadow-md">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[10px] tracking-widest font-bold">OMNI_OS EXPRESS PASS</span>
                  <div className="w-5 h-5 rounded-full bg-orange-500 border-2 border-white scale-125" />
                </div>

                <div className="space-y-1 font-mono">
                  <span className="text-gray-200 text-[10px]">REGISTERED USER REF_ID</span>
                  <p className="text-lg font-black tracking-widest">Homer Simpson</p>
                </div>

                <div className="flex justify-between items-center font-mono text-xs">
                  <span>TOKEN: •••• •••• 8011</span>
                  <span className="font-bold text-[9px] bg-white/20 px-1.5 py-0.5 rounded">FIPS VALIDATED</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl">
                <strong className="block text-xs text-gray-800">Direct wallet linkage complete</strong>
                <p className="text-xs text-gray-400 mt-1">
                  You can register multiple debit cards, bank checking connections, or local merchant coupons into your OMNI checkout profile for lightning-quick purchases.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
