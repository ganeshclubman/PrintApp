import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ReceiptIndianRupee, 
  BookOpenText, 
  Utensils,
  CreditCard,
  Settings,
  Bell,
  Search,
  User,
  LogIn,
  Package,
  Calendar,
  FileText,
  Shield,
  ChevronDown,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const navItems = (t: any) => [
  { icon: LayoutDashboard, label: t('membership.dashboard') || 'Dashboard', path: '/' },
  { icon: Utensils, label: t('pos.title'), path: '/pos' },
  { icon: FileText, label: t('reports.title'), path: '/reports' },
  { icon: Settings, label: t('settings.title'), path: '/settings' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'New Member Joined', time: '5m ago', type: 'info' },
    { id: 2, title: 'Low Stock: Premium Whiskey', time: '1h ago', type: 'warning' },
    { id: 3, title: 'Invoice #INV-2024-001 Paid', time: '2h ago', type: 'success' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Clubman ERP</span>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems(t).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">GR</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate">Ganesh Ratu</p>
              <p className="text-[10px] font-bold text-slate-400 truncate">{t('common.administrator')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder={t('common.quickSearch')} 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all relative group"
              >
                <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest">{t('common.notifications')}</h4>
                    <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">{t('common.markAllRead')}</button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="flex gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-1.5 shrink-0",
                          n.type === 'warning' ? "bg-amber-500" : n.type === 'success' ? "bg-emerald-500" : "bg-indigo-500"
                        )}></div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 hover:text-indigo-600 transition-colors">
                    {t('common.viewAllNotifications')}
                  </button>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">GR</div>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isProfileOpen && "rotate-180")} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-sm font-black text-slate-900">Ganesh Ratu</p>
                    <p className="text-xs text-slate-500">ganesh.ratu@gmail.com</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                      <User className="w-4 h-4" />
                      {t('common.myProfile')}
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                      <Settings className="w-4 h-4" />
                      {t('common.accountSettings')}
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all">
                      <HelpCircle className="w-4 h-4" />
                      {t('common.supportCenter')}
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <Link to="/login" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50 transition-all">
                      <LogOut className="w-4 h-4" />
                      {t('common.logout')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};
