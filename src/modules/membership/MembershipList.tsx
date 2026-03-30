import React, { useEffect, useState, useRef } from 'react';
import { Plus, Filter, Download, Printer, MoreVertical, Search } from 'lucide-react';
import { useFocusNavigation } from '@/src/core/FocusManager';
import { cn } from '@/src/lib/utils';

import { useTranslation } from 'react-i18next';

interface Member {
  id: string;
  name: string;
  memberNo: string;
  status: string;
}

export const MembershipList: React.FC = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, unregister } = useFocusNavigation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    register('member-search', searchRef);
    fetch('/api/v1/membership/members')
      .then(res => res.json())
      .then(data => {
        setMembers(data.items);
        setLoading(false);
      });
    
    return () => unregister('member-search');
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('membership.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('membership.description') || 'Manage club members, family profiles, and arrears.'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download className="w-4 h-4" />
            {t('common.export') || 'Export'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">
            <Plus className="w-4 h-4" />
            {t('membership.newMember')}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            ref={searchRef}
            type="text" 
            placeholder={t('common.searchPlaceholder') || "Search by name, member no, or card..."}
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4 text-slate-400" />
          {t('common.filters') || 'Filters'}
        </button>
      </div>

      {/* Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('membership.memberNo') || 'Member No'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('common.fullName') || 'Full Name'}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('common.status')}</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-4 bg-slate-100 rounded w-8 ml-auto"></div></td>
                </tr>
              ))
            ) : (
              members.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-mono text-indigo-600 font-semibold">{member.memberNo}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{member.name}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter",
                      member.status === 'Active' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                    )}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">Showing 1 to {members.length} of {members.length} members</p>
          <div className="flex items-center gap-2">
            <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-50">Previous</button>
            <button disabled className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
