import React from 'react';
import { Search, Plus, ChevronRight, FolderTree } from 'lucide-react';

const accounts = [
  { code: '1000', name: 'ASSETS', type: 'Group', balance: 4500000 },
  { code: '1100', name: 'Current Assets', type: 'Sub-Group', parent: '1000', balance: 1200000 },
  { code: '1110', name: 'Cash in Hand', type: 'Ledger', parent: '1100', balance: 50000 },
  { code: '1120', name: 'Bank - HDFC', type: 'Ledger', parent: '1100', balance: 1150000 },
  { code: '2000', name: 'LIABILITIES', type: 'Group', balance: 2500000 },
  { code: '3000', name: 'INCOME', type: 'Group', balance: 8500000 },
  { code: '3100', name: 'Membership Fees', type: 'Ledger', parent: '3000', balance: 6500000 },
  { code: '4000', name: 'EXPENSES', type: 'Group', balance: 6500000 },
];

export const ChartOfAccounts: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chart of Accounts</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your club's financial hierarchy and ledgers.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            <Search className="w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Filter accounts..." className="text-sm outline-none w-full" />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <FolderTree className="w-5 h-5" />
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Code</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Account Name</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Type</th>
              <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {accounts.map(acc => (
              <tr key={acc.code} className={cn(
                "hover:bg-slate-50 transition-colors",
                acc.type === 'Group' ? "bg-slate-50/30 font-bold" : ""
              )}>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{acc.code}</td>
                <td className="px-6 py-4 text-sm flex items-center gap-2">
                  {acc.parent && <span className="w-4 h-px bg-slate-200 ml-2"></span>}
                  {acc.type !== 'Ledger' && <ChevronRight className="w-4 h-4 text-slate-400" />}
                  {acc.name}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded uppercase border",
                    acc.type === 'Group' ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                    acc.type === 'Sub-Group' ? "bg-slate-50 text-slate-600 border-slate-200" :
                    "bg-white text-slate-400 border-slate-100"
                  )}>
                    {acc.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right font-mono">
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(acc.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
