import React, { useEffect, useState } from 'react';
import { Plus, Download, Search, Filter, Package, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: string;
  uom: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
}

export const InventoryList: React.FC = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/inventory/items')
      .then(res => res.json())
      .then(data => {
        setItems(data.items);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('inventory.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('inventory.description') || 'Manage raw materials, F&B stock, and procurement.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download className="w-4 h-4" />
            {t('common.export') || 'Export'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            {t('common.create')} {t('inventory.item') || 'Item'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title={t('inventory.totalItems') || "Total Items"} value={items.length.toString()} icon={<Package className="w-5 h-5" />} color="text-indigo-600" />
        <SummaryCard title={t('inventory.lowStockAlerts') || "Low Stock Alerts"} value={items.filter(i => i.currentStock <= i.reorderLevel).length.toString()} icon={<AlertTriangle className="w-5 h-5" />} color="text-red-600" />
        <SummaryCard title={t('inventory.inventoryValue') || "Inventory Value"} value={formatCurrency(items.reduce((acc, i) => acc + (i.currentStock * i.unitPrice), 0))} icon={<ArrowUpRight className="w-5 h-5" />} color="text-emerald-600" />
        <SummaryCard title={t('inventory.pendingPOs') || "Pending POs"} value="8" icon={<Package className="w-5 h-5" />} color="text-amber-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="flex-1 flex items-center gap-3 bg-white border border-slate-200 px-3 py-1.5 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder={t('inventory.searchPlaceholder') || "Search by item name or code..."} className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Filter className="w-4 h-4 text-slate-400" />
            {t('common.filters') || 'Filters'}
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('inventory.itemCode') || 'Item Code'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('inventory.itemName') || 'Item Name'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('inventory.category') || 'Category'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('inventory.stock') || 'Stock'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('inventory.uom') || 'UOM'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('inventory.unitPrice') || 'Unit Price'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                </tr>
              ))
            ) : (
              items.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-semibold">{item.code}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-bold",
                        item.currentStock <= item.reorderLevel ? "text-red-600" : "text-slate-900"
                      )}>
                        {item.currentStock}
                      </span>
                      {item.currentStock <= item.reorderLevel && (
                        <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-100 uppercase">Low</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.uom}</td>
                  <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">{formatCurrency(item.unitPrice)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function SummaryCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex items-center gap-4">
      <div className={cn("p-3 rounded-lg bg-slate-50", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className={cn("text-xl font-black mt-0.5", color)}>{value}</p>
      </div>
    </div>
  );
}
