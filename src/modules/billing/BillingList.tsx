import React, { useEffect, useState } from 'react';
import { Plus, Download, Search, Filter, FileText } from 'lucide-react';
import { cn, formatCurrency } from '@/src/lib/utils';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface Invoice {
  id: string;
  invoiceNo: string;
  memberName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export const BillingList: React.FC = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/billing/invoices')
      .then(res => res.json())
      .then(data => {
        setInvoices(data.items);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('billing.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('billing.description') || 'Manage member subscriptions and facility invoices.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download className="w-4 h-4" />
            {t('common.export') || 'Export'}
          </button>
          <Link 
            to="/billing/new"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200"
          >
            <Plus className="w-4 h-4" />
            {t('billing.newInvoice')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard title={t('billing.totalOutstanding') || "Total Outstanding"} value={formatCurrency(125400)} color="text-amber-600" />
        <SummaryCard title={t('billing.collectedMTD') || "Collected (MTD)"} value={formatCurrency(845000)} color="text-emerald-600" />
        <SummaryCard title={t('billing.overdueInvoices') || "Overdue Invoices"} value="12" color="text-red-600" />
        <SummaryCard title={t('billing.pendingApprovals') || "Pending Approvals"} value="5" color="text-indigo-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('billing.invoiceNo')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('billing.member') || 'Member'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('billing.amount')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('billing.dueDate')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('common.status')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                </tr>
              ))
            ) : (
              invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-semibold">{invoice.invoiceNo}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{invoice.memberName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{invoice.dueDate}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border",
                      invoice.status === 'Paid' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      invoice.status === 'Overdue' ? "bg-red-50 text-red-700 border-red-100" :
                      "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function SummaryCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className={cn("text-xl font-black mt-1", color)}>{value}</p>
    </div>
  );
}
