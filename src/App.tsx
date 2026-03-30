/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import './core/i18n';
import { FocusProvider } from './core/FocusManager';
import { Layout } from './components/Layout';
import { MembershipList } from './modules/membership/MembershipList';
import { BillingList } from './modules/billing/BillingList';
import { CreateInvoiceForm } from './modules/billing/CreateInvoiceForm';
import { ChartOfAccounts } from './modules/accounting/ChartOfAccounts';
import { POSDashboard } from './modules/pos/POSDashboard';
import { POSOrderView } from './modules/pos/POSOrderView';
import { SmartCardIssuance } from './modules/smartcard/SmartCardIssuance';
import { InventoryList } from './modules/inventory/InventoryList';
import { FacilityBookingCalendar } from './modules/events/FacilityBookingCalendar';
import { ReportsDashboard } from './modules/reports/ReportsDashboard';
import { ReportGenerator } from './modules/reports/ReportGenerator';
import { SystemSettings } from './modules/settings/SystemSettings';
import { LoginPage } from './modules/auth/LoginPage';
import { RegisterPage } from './modules/auth/RegisterPage';
import { ForgotPasswordPage } from './modules/auth/ForgotPasswordPage';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function App() {
  return (
    <BrowserRouter>
      <FocusProvider>
        <Routes>
          {/* Auth Routes (No Layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes (With Layout) */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/membership" element={<MembershipList />} />
                <Route path="/billing" element={<BillingList />} />
                <Route path="/billing/new" element={<CreateInvoiceForm />} />
                <Route path="/accounting" element={<ChartOfAccounts />} />
                <Route path="/pos" element={<POSDashboard />} />
                <Route path="/pos/order/new" element={<POSOrderView />} />
                <Route path="/smartcard" element={<SmartCardIssuance />} />
                <Route path="/inventory" element={<InventoryList />} />
                <Route path="/events" element={<FacilityBookingCalendar />} />
                <Route path="/reports" element={<ReportsDashboard />} />
                <Route path="/reports/generate" element={<ReportGenerator />} />
                <Route path="/settings" element={<SystemSettings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </FocusProvider>
    </BrowserRouter>
  );
}

import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

const revenueData = [
  { name: 'Oct', revenue: 320000 },
  { name: 'Nov', revenue: 380000 },
  { name: 'Dec', revenue: 450000 },
  { name: 'Jan', revenue: 410000 },
  { name: 'Feb', revenue: 425000 },
  { name: 'Mar', revenue: 480000 },
];

const membershipData = [
  { name: 'Oct', new: 45, resigned: 12 },
  { name: 'Nov', new: 52, resigned: 8 },
  { name: 'Dec', new: 68, resigned: 15 },
  { name: 'Jan', new: 40, resigned: 10 },
  { name: 'Feb', new: 55, resigned: 5 },
  { name: 'Mar', new: 72, resigned: 14 },
];

const distributionData = [
  { name: 'Life', value: 400 },
  { name: 'Regular', value: 600 },
  { name: 'Corporate', value: 150 },
  { name: 'Sports', value: 90 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{t('membership.dashboard') || 'Dashboard'}</h1>
        <p className="text-slate-500 mt-1">{t('membership.dashboardDesc') || 'Real-time insights across all club modules.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title={t('membership.totalMembers')} value="1,240" trend="+12% from last month" />
        <StatCard title={t('billing.revenueMTD') || 'Revenue (MTD)'} value="₹4,25,000" trend="+5% from last month" />
        <StatCard title={t('events.activeBookings') || 'Active Bookings'} value="42" trend="8 slots available" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('membership.revenueTrends')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', color: '#4f46e5' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Growth Chart */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('membership.growth')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={membershipData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="new" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="resigned" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Membership Distribution Pie Chart */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('membership.distribution')}</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-8">
              {distributionData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{entry.name}</span>
                  <span className="text-xs font-black text-slate-900 ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity / Quick Stats */}
        <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('membership.quickInsights')}</h3>
          <div className="space-y-6">
            <InsightRow label={t('membership.highestRevenueOutlet')} value="The Lounge Bar" subValue="₹89,000 today" />
            <InsightRow label={t('membership.peakBookingTime')} value="6:00 PM - 8:00 PM" subValue="95% occupancy" />
            <InsightRow label={t('membership.upcomingEvents')} value="Annual Gala Dinner" subValue="April 12th • 250 registered" />
            <InsightRow label={t('membership.inventoryAlert')} value="Beverage Stock Low" subValue="12 items below reorder level" />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({ label, value, subValue }: { label: string, value: string, subValue: string }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{subValue}</span>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string, value: string, trend: string }) {
  return (
    <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
      <p className="text-xs text-emerald-600 font-medium mt-1">{trend}</p>
    </div>
  );
}
