import { useState, useEffect } from 'react';
import { Truck, MapPin, CheckCircle, Navigation, PhoneCall, Radio, Zap, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  activeOrder: Order | null;
  onSetStatus: (status: Order['status']) => void;
}

export default function OrderTracker({ activeOrder, onSetStatus }: OrderTrackerProps) {
  const [ticker, setTicker] = useState(0);
  const [driverMessage, setDriverMessage] = useState('En-route. Preparing loadouts at regional logistics center.');
  const [coords, setCoords] = useState({ x: 15, y: 35 });
  const [etaMins, setEtaMins] = useState(25);

  // Status updates simulation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeOrder && activeOrder.status !== 'delivered') {
      interval = setInterval(() => {
        setTicker((prev) => prev + 1);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [activeOrder]);

  useEffect(() => {
    if (!activeOrder) return;

    // Define coordinate routes and messages corresponding to the ticks and states
    switch (activeOrder.status) {
      case 'ordered':
        setCoords({ x: 15, y: 35 });
        setDriverMessage('Logistics system auto-validated order items and confirmed availability.');
        setEtaMins(30);
        break;
      case 'packed':
        setCoords({ x: 30, y: 35 });
        setDriverMessage('Items packaged with biodegradable foam cushions. Package loaded onto Drone Carrier Platform.');
        setEtaMins(24);
        break;
      case 'shipped':
        setCoords({ x: 50, y: 55 });
        setDriverMessage('Carrier departed regional sorting hub. Accessing Hampons Expressway route.');
        setEtaMins(16);
        break;
      case 'out_for_delivery':
        // Animate coordinates dynamically based on ticker
        const progress = (ticker % 4) / 4;
        const currentX = Math.round(50 + progress * 35);
        const currentY = Math.round(55 - progress * 20);
        setCoords({ x: currentX, y: currentY });
        setDriverMessage('Driver Marcus near local intersection. Estimated delivery ETA is narrowing.');
        setEtaMins(Math.max(2, 6 - Math.round(progress * 4)));
        break;
      case 'delivered':
        setCoords({ x: 85, y: 35 });
        setDriverMessage('Logistics carrier package dropped at front porch. Photo uploaded to US regional server.');
        setEtaMins(0);
        break;
    }
  }, [activeOrder?.status, ticker]);

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto p-8 font-sans text-center bg-white border border-gray-150 rounded-2xl shadow-sm">
        <Truck className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-800">No active shipments logged</h2>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          You currently have no active deliveries scheduled. Head over to the primary dashboard or catalog, select some household essentials, and engage checkout!
        </p>
      </div>
    );
  }

  // Steps
  const steps: { key: Order['status']; label: string; desc: string }[] = [
    { key: 'ordered', label: 'Ordered', desc: 'System Verified' },
    { key: 'packed', label: 'Packed & Sealed', desc: 'Secure Boxing' },
    { key: 'shipped', label: 'In Transit', desc: 'Regional Sorting' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Local Carrier' },
    { key: 'delivered', label: 'Delivered', desc: 'Completed Porch Drop' },
  ];

  // Helper to determine step classes
  const getStepStatus = (stepKey: Order['status']) => {
    const orderIndex = steps.findIndex((s) => s.key === activeOrder.status);
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    if (orderIndex === -1) return 'pending';
    if (orderIndex > stepIndex) return 'completed';
    if (orderIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans" id="order-tracker-system">
      {/* Simulation Controls Sidebar for Testing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider font-mono">SIMULATED LOGISTICS CONTROLS</h3>
            <span className="block text-[10px] text-gray-400">Fast-forward timeline phases to inspect real-time dashboard responsiveness.</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((s) => (
            <button
              key={s.key}
              onClick={() => onSetStatus(s.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                activeOrder.status === s.key
                  ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {s.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Hub banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core details */}
        <div className="md:col-span-2 bg-white border border-gray-100 p-5 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-400 font-mono">ACTIVE DISPATCH ID</span>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">{activeOrder.id}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 font-mono">ESTIMATED ETA WINDOW</span>
              <p className="text-base font-black text-blue-600">
                {etaMins > 0 ? `~ ${etaMins} Minutes Remaining` : 'Package Dropped'}
              </p>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {steps.map((s) => {
              const statusType = getStepStatus(s.key);
              return (
                <div key={s.key} className="text-center relative">
                  <div className="flex items-center justify-center mb-2.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                        statusType === 'completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : statusType === 'active'
                          ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                          : 'bg-white border-gray-200 text-gray-300'
                      }`}
                    >
                      {statusType === 'completed' ? '✓' : ''}
                    </div>
                  </div>
                  <strong className={`block text-[10px] font-bold ${statusType === 'active' ? 'text-blue-600' : 'text-gray-700'}`}>
                    {s.label}
                  </strong>
                  <span className="text-[9px] text-gray-400 block font-mono leading-none mt-0.5">{s.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver contact status */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-gray-400 font-mono">LOGISTICS CARRIER IDENT</span>
            <div className="flex items-center space-x-3 pb-3 border-b border-gray-50">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                M
              </div>
              <div>
                <strong className="text-sm text-gray-800 block">Marcus Fletcher</strong>
                <span className="text-xs text-gray-400 font-mono">ID: MF_US_CH_9011</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-normal italic bg-slate-50 p-2.5 rounded-xl border border-gray-100">
              "{driverMessage}"
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-3">
            <button className="flex-grow bg-blue-50 text-blue-600 text-xs font-bold py-2 px-3 rounded-lg hover:bg-blue-100 transition flex items-center justify-center space-x-1.5">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Dispatcher</span>
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Telemetry Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Panel */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-3xl relative text-white" id="order-telemetry-map">
          <div className="absolute top-4 left-4 z-10 flex items-center bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-gray-300 font-mono">
            <Navigation className="w-3 h-3 text-blue-400 mr-2 animate-bounce" />
            <span>REAL-TIME SATELLITE DISPATCH FEED (MOCK)</span>
          </div>

          <div className="w-full aspect-video bg-indigo-950/20 rounded-2xl border border-slate-800 relative overflow-hidden">
            {/* SVG Roads & Map elements background */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-35">
              {/* Grid Lines */}
              <path d="M 0 20 L 100 20 M 0 40 L 100 40 M 0 60 L 100 60 M 0 80 L 100 80" stroke="#334155" strokeWidth="0.1" />
              <path d="M 20 0 L 20 100 M 40 0 L 40 100 M 60 0 L 60 100 M 80 0 L 80 100" stroke="#334155" strokeWidth="0.1" />

              {/* Expressways */}
              <path d="M 10 35 L 50 35 L 50 55 L 85 35" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 15 35 L 85 35" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              
              {/* Connectors */}
              <circle cx="15" cy="35" r="3" fill="#1e3a8a" />
              <circle cx="50" cy="55" r="3" fill="#0f766e" />
              <circle cx="85" cy="35" r="3" fill="#047857" />
            </svg>

            {/* Labels on Map overlay */}
            <div className="absolute top-[38%] left-[13%] text-[9px] font-mono text-gray-500 bg-slate-950/50 px-1 rounded-sm">Logistics Ctr</div>
            <div className="absolute top-[58%] left-[45%] text-[9px] font-mono text-gray-500 bg-slate-950/50 px-1 rounded-sm">Expressway Loop</div>
            <div className="absolute top-[38%] left-[82%] text-[9px] font-mono text-gray-500 bg-slate-950/50 px-1 rounded-sm">Target House</div>

            {/* Driver Indicator Vehicle Icon */}
            {activeOrder.status !== 'delivered' && (
              <div 
                className="absolute w-8 h-8 -ml-4 -mt-4 transition-all duration-1000 ease-out z-20 flex items-center justify-center"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-60" />
                  <div className="relative bg-blue-600 border border-blue-400 p-1.5 rounded-lg text-white shadow-md">
                    <Truck className="w-4.5 h-4.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Source Warehouse Marker */}
            <div className="absolute left-[15%] top-[35%] -ml-3 -mt-3 z-10 p-1 bg-indigo-500/10 border border-indigo-400 rounded-lg text-indigo-400 text-[10px]">
              <MapPin className="w-4 h-4 text-indigo-400" />
            </div>

            {/* Target Dest Marker */}
            <div className="absolute left-[85%] top-[35%] -ml-3 -mt-3 z-10 p-1 bg-emerald-500/10 border border-emerald-400 rounded-lg text-emerald-400">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Conversation / Radio logs */}
        <div className="bg-white border border-gray-1.5 p-5 rounded-3xl flex flex-col justify-between max-h-[340px] overflow-hidden">
          <div className="space-y-3.5 flex-grow truncate flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider">REGIONAL ROUTER TELEMETRY RECORDS</span>
            
            <div className="space-y-4 text-xs font-mono overflow-y-auto max-h-[220px] flex-grow pr-1 text-gray-500">
              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="block text-[10px] text-gray-400">08:35:42 AM</span>
                <p className="text-gray-700">Order successfully logged and allocated within Southlake warehouse.</p>
              </div>

              {activeOrder.status !== 'ordered' && (
                <div className="border-l-2 border-emerald-500 pl-3">
                  <span className="block text-[10px] text-gray-400">08:38:02 AM</span>
                  <p className="text-gray-700">Robot arm sorted items. Shrink wrap sealing complete. Labeled barcode OMNI_CH_9101.</p>
                </div>
              )}

              {activeOrder.status === 'packed' && (
                <div className="border-l-2 border-blue-500 pl-3">
                  <span className="block text-[10px] text-gray-400">08:39:15 AM</span>
                  <p className="text-gray-700">Awaiting secure driver loadout pickup assignment.</p>
                </div>
              )}

              {(activeOrder.status === 'shipped' || activeOrder.status === 'out_for_delivery' || activeOrder.status === 'delivered') && (
                <div className="border-l-2 border-blue-500 pl-3">
                  <span className="block text-[10px] text-gray-400">08:41:00 AM</span>
                  <p className="text-gray-700">Carrier Fletcher loaded package. GPS tracking active.</p>
                </div>
              )}

              {activeOrder.status === 'out_for_delivery' && (
                <div className="border-l-2 border-orange-500 pl-3 animate-pulse">
                  <span className="block text-[10px] text-gray-400">08:50:33 AM</span>
                  <p className="text-gray-700">Fletcher departing Hampons exit. Entering target housing area blocks.</p>
                </div>
              )}

              {activeOrder.status === 'delivered' && (
                <div className="border-l-2 border-emerald-600 pl-3 bg-emerald-50/20 p-2 rounded-lg">
                  <span className="block text-[10px] text-gray-400 font-bold">08:54:12 AM</span>
                  <p className="text-emerald-800 font-bold">Package discharged safely. Delivered confirmation uploaded.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
