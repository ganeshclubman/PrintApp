import React, { useState, useEffect } from 'react';
import { Utensils, Coffee, Beer, Plus, ChevronRight, Users, Clock } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

interface Outlet {
  id: string;
  name: string;
  type: 'Restaurant' | 'Cafe' | 'Bar';
  activeTables: number;
  revenueToday: number;
}

interface ActiveOrder {
  id: string;
  tableNo: string;
  memberNo: string;
  itemsCount: number;
  amount: number;
  timeElapsed: string;
}

export const POSDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);

  useEffect(() => {
    // Mock data for outlets
    setOutlets([
      { id: '1', name: 'Royal Dining', type: 'Restaurant', activeTables: 8, revenueToday: 45000 },
      { id: '2', name: 'Lakeside Cafe', type: 'Cafe', activeTables: 4, revenueToday: 12500 },
      { id: '3', name: 'The Lounge Bar', type: 'Bar', activeTables: 12, revenueToday: 89000 },
    ]);

    // Mock data for active orders
    setActiveOrders([
      { id: '101', tableNo: 'T-04', memberNo: 'M001', itemsCount: 5, amount: 2450, timeElapsed: '25m' },
      { id: '102', tableNo: 'T-12', memberNo: 'M085', itemsCount: 2, amount: 890, timeElapsed: '10m' },
      { id: '103', tableNo: 'T-01', memberNo: 'M234', itemsCount: 8, amount: 5600, timeElapsed: '45m' },
    ]);
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pos.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('pos.description') || 'Manage outlet orders, table service, and billing.'}</p>
        </div>
        <button 
          onClick={() => navigate('/pos/order/new')}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('pos.newOrder')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {outlets.map(outlet => (
          <div key={outlet.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl",
                outlet.type === 'Restaurant' ? "bg-orange-50 text-orange-600" :
                outlet.type === 'Cafe' ? "bg-emerald-50 text-emerald-600" :
                "bg-indigo-50 text-indigo-600"
              )}>
                {outlet.type === 'Restaurant' ? <Utensils className="w-6 h-6" /> :
                 outlet.type === 'Cafe' ? <Coffee className="w-6 h-6" /> :
                 <Beer className="w-6 h-6" />}
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{outlet.name}</h3>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Users className="w-4 h-4" />
                <span>{outlet.activeTables} {t('pos.activeTables') || 'Active Tables'}</span>
              </div>
              <span className="font-bold text-slate-900">{formatCurrency(outlet.revenueToday)}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-6">{t('pos.activeOrders') || 'Active Orders'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {activeOrders.map(order => (
          <div key={order.id} className="bg-white border-l-4 border-l-indigo-500 border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-black text-indigo-600">{order.tableNo}</span>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                <Clock className="w-3 h-3" />
                {order.timeElapsed}
              </div>
            </div>
            <p className="text-sm font-bold text-slate-900 mb-1">{order.memberNo}</p>
            <p className="text-xs text-slate-500 mb-4">{order.itemsCount} {t('pos.items') || 'Items'}</p>
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-sm font-bold text-slate-900">{formatCurrency(order.amount)}</span>
              <button className="text-xs font-bold text-indigo-600 hover:underline">View Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
