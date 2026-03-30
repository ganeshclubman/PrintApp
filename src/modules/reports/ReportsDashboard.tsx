import React from 'react';
import { FileText, TrendingUp, Users, CreditCard, ShoppingCart, Calendar, ArrowRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';

const reportCategories = [
  {
    id: 'financial',
    title: 'Financial Reports',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'bg-emerald-50 text-emerald-600',
    reports: [
      'Profit & Loss Statement',
      'Balance Sheet',
      'Trial Balance',
      'Cash Flow Statement',
      'Tax Summary (GST/VAT)'
    ]
  },
  {
    id: 'membership',
    title: 'Member Analytics',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-indigo-50 text-indigo-600',
    reports: [
      'Member Aging Report',
      'Subscription Collection',
      'New Admissions vs Resignations',
      'Member Usage Statistics'
    ]
  },
  {
    id: 'operational',
    title: 'Operational Reports',
    icon: <ShoppingCart className="w-5 h-5" />,
    color: 'bg-amber-50 text-amber-600',
    reports: [
      'Daily Sales Summary',
      'Inventory Stock Position',
      'Outlet-wise Revenue',
      'Facility Occupancy Report'
    ]
  }
];

export const ReportsDashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('reports.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">Generate and export detailed business performance reports.</p>
        </div>
        <Link 
          to="/reports/generate"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Custom Report
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reportCategories.map(category => (
          <div key={category.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", category.color)}>
                {category.icon}
              </div>
              <h3 className="font-bold text-slate-900">{category.title}</h3>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-1">
                {category.reports.map(report => (
                  <li key={report}>
                    <Link 
                      to="/reports/generate"
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-sm text-slate-600 font-medium transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        {report}
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-slate-50/50 border-t border-slate-100">
              <Link 
                to="/reports/generate"
                className="w-full py-2 text-xs font-bold text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors block text-center"
              >
                View All {category.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-black mb-4">Need a Custom Report?</h2>
          <p className="text-indigo-100 mb-6">Our analytics engine can build tailored reports based on your specific club requirements. Contact the system administrator for advanced data extraction.</p>
          <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-950/20">
            Request Custom Report
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-800/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-12 w-64 h-64 bg-indigo-700/30 rounded-full translate-y-1/2 blur-2xl"></div>
      </div>
    </div>
  );
};
