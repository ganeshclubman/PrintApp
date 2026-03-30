import React, { useState } from 'react';
import { CreditCard, Search, User, ShieldCheck, Save, RefreshCcw } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';

export const SmartCardIssuance: React.FC = () => {
  const [memberId, setMemberId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [memberData, setMemberData] = useState<any>(null);

  const handleSearch = () => {
    setIsSearching(true);
    // Mock search
    setTimeout(() => {
      setMemberData({
        id: 'M001',
        name: 'John Doe',
        category: 'Life Member',
        status: 'Active',
        existingCard: null
      });
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Card Issuance</h1>
          <p className="text-slate-500 text-sm mt-1">Issue, replace, or top-up member smart cards.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
          <ShieldCheck className="w-4 h-4" />
          Secure Card Protocol v2.4
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Search & Member Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <label className="text-sm font-bold text-slate-700 mb-2 block">Search Member</label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Enter Member ID (e.g. M001)" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                  value={memberId}
                  onChange={e => setMemberId(e.target.value)}
                />
              </div>
              <button 
                onClick={handleSearch}
                disabled={!memberId || isSearching}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {memberData && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <User className="w-12 h-12" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-black text-slate-900">{memberData.name}</h2>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-widest">
                      {memberData.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 mb-4">{memberData.id} • {memberData.category}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Card</p>
                      <p className="text-sm font-bold text-slate-900">{memberData.existingCard || "No Card Issued"}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wallet Balance</p>
                      <p className="text-sm font-bold text-slate-900">{formatCurrency(0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Card Preview & Action */}
        <div className="space-y-6">
          <div className="aspect-[1.586/1] w-full bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl p-6 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <CreditCard className="w-8 h-8 text-white/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Clubman Smart Card</span>
              </div>
              <div>
                <p className="text-xs font-medium text-white/60 mb-1">Card Number</p>
                <p className="text-lg font-mono tracking-[0.2em] font-bold">XXXX XXXX XXXX XXXX</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Member Name</p>
                  <p className="text-sm font-bold uppercase tracking-wider">{memberData?.name || "Member Name"}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Expiry</p>
                  <p className="text-sm font-bold">12/30</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Initial Top-up (₹)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
            <button 
              disabled={!memberData}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
            >
              <Save className="w-4 h-4" />
              Issue New Card
            </button>
            <button 
              disabled={!memberData}
              className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <RefreshCcw className="w-4 h-4" />
              Replace Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
