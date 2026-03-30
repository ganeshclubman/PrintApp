import React, { useState } from 'react';
import { Settings, Globe, Shield, CreditCard, Bell, Database, Save, User, Building, Palette, Printer, LogOut, Type, Image as ImageIcon, Layout, Plus, Trash2, Star, Loader2, RefreshCw, ExternalLink, Download, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils';

const settingTabs = (t: any) => [
  { id: 'general', label: t('settings.general'), icon: <Building className="w-4 h-4" /> },
  { id: 'branding', label: t('settings.branding'), icon: <Palette className="w-4 h-4" /> },
  { id: 'printers', label: t('settings.printers'), icon: <Printer className="w-4 h-4" /> },
  { id: 'templates', label: t('settings.templates'), icon: <Layout className="w-4 h-4" /> },
  { id: 'security', label: t('settings.security'), icon: <Shield className="w-4 h-4" /> },
  { id: 'notifications', label: t('settings.notifications'), icon: <Bell className="w-4 h-4" /> },
  { id: 'billing', label: t('settings.billing'), icon: <CreditCard className="w-4 h-4" /> },
  { id: 'backup', label: t('settings.backup'), icon: <Database className="w-4 h-4" /> },
];

export const SystemSettings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [printers, setPrinters] = useState<{id: string, name: string, type: string, isDefault: boolean}[]>(() => {
    const saved = localStorage.getItem('clubman_printers');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Remove previously added mock printers if they exist
      return parsed.filter((p: any) => p.id !== '1' && p.id !== '2');
    }
    return [];
  });

  const [templates, setTemplates] = useState<{
    id: string, 
    name: string, 
    headerText: string, 
    footerText: string, 
    logoUrl: string,
    fontFamily: string,
    fontSize: string,
    isDefault: boolean,
    orgName?: string,
    address?: string,
    phone?: string,
    gst?: string,
    layout?: 'standard' | 'professional',
    appliedReports?: string[]
  }[]>(() => {
    const saved = localStorage.getItem('clubman_report_templates');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'default', 
        name: 'Standard Corporate', 
        headerText: 'The Royal Club - Official Report', 
        footerText: 'Confidential - For Internal Use Only', 
        logoUrl: '',
        fontFamily: 'Inter',
        fontSize: '12px',
        isDefault: true,
        orgName: 'THE ROYAL CLUB & RESORTS',
        address: 'N/6, IRC Village, Nayapalli, Khorda, Odisha - 751014',
        phone: '7008985883',
        gst: '253698785',
        layout: 'professional',
        appliedReports: ['Financial Summary', 'Membership Aging', 'Inventory Stock', 'Outlet Revenue']
      }
    ];
  });

  const [printNodeKey, setPrintNodeKey] = useState(() => localStorage.getItem('clubman_printnode_key') || '');
  const [isConfigured, setIsConfigured] = useState(!!localStorage.getItem('clubman_printnode_key'));
  const [isScanning, setIsScanning] = useState(false);

  const [branding, setBranding] = useState(() => {
    const saved = localStorage.getItem('clubman_branding');
    return saved ? JSON.parse(saved) : {
      logo: '',
      primaryColor: '#4f46e5',
      secondaryColor: '#10b981'
    };
  });

  const saveBranding = (newBranding: typeof branding) => {
    setBranding(newBranding);
    localStorage.setItem('clubman_branding', JSON.stringify(newBranding));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        saveBranding({ ...branding, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateLogoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updateTemplate(id, 'logoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanPrinters = async () => {
    if (!printNodeKey) {
      alert('Please enter a PrintNode API Key to scan for printers.');
      return;
    }

    setIsScanning(true);
    try {
      const response = await fetch('https://api.printnode.com/printers', {
        headers: {
          'Authorization': 'Basic ' + btoa(printNodeKey + ':')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch printers from PrintNode');
      }

      const data = await response.json();
      const newPrinters = data.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        type: p.description || 'Network Printer',
        isDefault: false
      }));

      if (newPrinters.length > 0) {
        // Keep existing printers but avoid duplicates by ID
        const existingIds = new Set(printers.map(p => p.id));
        const uniqueNewPrinters = newPrinters.filter((p: any) => !existingIds.has(p.id));
        
        if (uniqueNewPrinters.length === 0) {
          alert('All found printers are already in your list.');
        } else {
          savePrinters([...printers, ...uniqueNewPrinters]);
          alert(`Found and added ${uniqueNewPrinters.length} new printers!`);
        }
      } else {
        alert('No printers found in your PrintNode account.');
      }
    } catch (error) {
      console.error('Scanning failed:', error);
      alert('Failed to scan for printers. Please check your API Key and internet connection.');
    } finally {
      setIsScanning(false);
    }
  };

  const deletePrinter = (id: string) => {
    const printerToDelete = printers.find(p => p.id === id);
    if (printerToDelete?.isDefault) {
      alert('Cannot delete the default printer. Set another printer as default first.');
      return;
    }
    savePrinters(printers.filter(p => p.id !== id));
  };

  const savePrinters = (newPrinters: typeof printers) => {
    setPrinters(newPrinters);
    localStorage.setItem('clubman_printers', JSON.stringify(newPrinters));
  };

  const saveTemplates = (newTemplates: typeof templates) => {
    setTemplates(newTemplates);
    localStorage.setItem('clubman_report_templates', JSON.stringify(newTemplates));
  };

  const toggleDefaultTemplate = (id: string) => {
    const updated = templates.map(t => ({
      ...t,
      isDefault: t.id === id
    }));
    saveTemplates(updated);
  };

  const addTemplate = () => {
    const newTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Template',
      headerText: 'Header Content',
      footerText: 'Footer Content',
      logoUrl: '',
      fontFamily: 'Inter',
      fontSize: '12px',
      isDefault: false,
      orgName: '',
      address: '',
      phone: '',
      gst: '',
      layout: 'standard' as const,
      appliedReports: []
    };
    saveTemplates([...templates, newTemplate]);
  };

  const deleteTemplate = (id: string) => {
    if (id === 'default') return;
    saveTemplates(templates.filter(t => t.id !== id));
  };

  const updateTemplate = (id: string, field: string, value: string) => {
    saveTemplates(templates.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const toggleDefault = (id: string) => {
    const updated = printers.map(p => ({
      ...p,
      isDefault: p.id === id
    }));
    savePrinters(updated);
  };

  return (
    <div className="p-8">
      {/* ... existing header ... */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('settings.title')}</h1>
          <p className="text-slate-500 text-sm mt-1">{t('settings.description')}</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95">
          <Save className="w-4 h-4" />
          {t('settings.saveChanges')}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-64 space-y-1">
          {settingTabs(t).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg",
                activeTab === tab.id ? "bg-indigo-50" : "bg-slate-50"
              )}>
                {tab.icon}
              </div>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-6">{t('settings.clubInfo')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <SettingInput label={t('settings.clubName')} placeholder="The Royal Club" value="The Royal Club" />
                  <SettingInput label={t('settings.regNo')} placeholder="RC-123456" value="RC-123456" />
                  <SettingInput label={t('settings.primaryEmail')} placeholder="admin@royalclub.com" value="admin@royalclub.com" />
                  <SettingInput label={t('settings.phone')} placeholder="+91 98765 43210" value="+91 98765 43210" />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 mb-6">{t('settings.localization')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <SettingSelect 
                    label={t('settings.language')} 
                    options={['English', 'Hindi', 'Spanish', 'Tamil', 'Odia']} 
                    value={
                      i18n.language === 'hi' ? 'Hindi' : 
                      i18n.language === 'es' ? 'Spanish' : 
                      i18n.language === 'ta' ? 'Tamil' :
                      i18n.language === 'or' ? 'Odia' :
                      'English'
                    } 
                    onChange={(val) => {
                      const langMap: Record<string, string> = {
                        'English': 'en',
                        'Hindi': 'hi',
                        'Spanish': 'es',
                        'Tamil': 'ta',
                        'Odia': 'or'
                      };
                      i18n.changeLanguage(langMap[val]);
                    }}
                  />
                  <SettingSelect label={t('settings.currency')} options={['₹ (INR)', '$ (USD)', '€ (EUR)']} value="₹ (INR)" />
                  <SettingSelect label={t('settings.timezone')} options={['(GMT+05:30) Mumbai', '(GMT+00:00) London']} value="(GMT+05:30) Mumbai" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'printers' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {!isConfigured ? (
                <div className="space-y-8">
                  <div className="text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Printer className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">Connect Your Local Printers</h3>
                    <p className="text-slate-500 leading-relaxed">
                      To enable silent, direct printing from the cloud, we use PrintNode. 
                      Follow these simple steps to get your hardware connected.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Download className="w-7 h-7 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">1. Install Client</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Download and install the PrintNode client on the computer connected to your printers.
                      </p>
                      <a 
                        href="https://www.printnode.com/en/download" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        Download Client <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <Key className="w-7 h-7 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">2. Get API Key</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Log in to your PrintNode dashboard and generate a new API Key from the settings.
                      </p>
                      <a 
                        href="https://app.printnode.com/settings/api-keys" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="mt-auto flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        API Dashboard <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-7 h-7 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2">3. Link Account</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Enter your API Key in the field below to start scanning for your local hardware.
                      </p>
                      <div className="mt-auto flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                        Ready to Sync
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                      <h4 className="text-xl font-black mb-2">Enter API Key</h4>
                      <p className="text-indigo-100 text-sm mb-8 max-w-md">Paste your PrintNode API Key here to establish a secure connection with your local printers.</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <input 
                            type="password" 
                            placeholder="Your PrintNode API Key"
                            value={printNodeKey}
                            onChange={(e) => setPrintNodeKey(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:bg-white/20 placeholder:text-white/40 transition-all"
                          />
                        </div>
                        <button 
                          onClick={() => {
                            if (!printNodeKey) return;
                            localStorage.setItem('clubman_printnode_key', printNodeKey);
                            setIsConfigured(true);
                            scanPrinters();
                          }}
                          className="px-10 py-4 bg-white text-indigo-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-lg shadow-black/10"
                        >
                          Connect & Scan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Printer Fleet</h3>
                      <p className="text-slate-500 text-sm mt-1">Manage and monitor your connected printing hardware.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => {
                          setPrintNodeKey('');
                          setIsConfigured(false);
                          localStorage.removeItem('clubman_printnode_key');
                        }}
                        className="px-4 py-2 text-slate-500 text-xs font-black uppercase tracking-widest hover:text-red-600 transition-colors"
                      >
                        Disconnect
                      </button>
                      <button 
                        onClick={scanPrinters}
                        disabled={isScanning}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95"
                      >
                        {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        Refresh Fleet
                      </button>
                    </div>
                  </div>
                  
                  {printers.length === 0 ? (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <AlertCircle className="w-10 h-10 text-slate-300" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">No Printers Found</h4>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">We couldn't find any printers linked to your account. Make sure your PrintNode client is running.</p>
                      <button 
                        onClick={scanPrinters}
                        className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                      >
                        Try Scanning Again
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {printers.map(printer => (
                        <div key={printer.id} className={cn(
                          "group flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300",
                          printer.isDefault 
                            ? "border-indigo-200 bg-indigo-50/30 shadow-lg shadow-indigo-100/20" 
                            : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/30"
                        )}>
                          <div className="flex items-center gap-6">
                            <div className={cn(
                              "p-4 rounded-2xl transition-all duration-300",
                              printer.isDefault ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
                            )}>
                              <Printer className="w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-900">{printer.name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{printer.type}</p>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Online</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {printer.isDefault ? (
                              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-indigo-200">
                                <Star className="w-3 h-3 fill-current" />
                                Default Printer
                              </div>
                            ) : (
                              <button 
                                onClick={() => toggleDefault(printer.id)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                              >
                                Set as Default
                              </button>
                            )}
                            <button 
                              onClick={() => deletePrinter(printer.id)}
                              className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                              title="Remove Printer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-12 pt-12 border-t border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Print Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Auto-print Receipts</p>
                          <p className="text-xs text-slate-500 mt-1">Trigger print immediately after billing.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-12 h-6 appearance-none bg-slate-300 rounded-full checked:bg-indigo-600 transition-all relative cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-6 before:transition-all" />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-900">Digital Signature</p>
                          <p className="text-xs text-slate-500 mt-1">Include QR code for digital verification.</p>
                        </div>
                        <input type="checkbox" className="w-12 h-6 appearance-none bg-slate-300 rounded-full checked:bg-indigo-600 transition-all relative cursor-pointer before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-6 before:transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Report Templates</h3>
                  <p className="text-xs text-slate-500 mt-1">Design customized headers and footers for your reports.</p>
                </div>
                <button 
                  onClick={addTemplate}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {templates.map(template => (
                  <div key={template.id} className="border border-slate-200 rounded-3xl p-6 space-y-6 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={template.name}
                          onChange={(e) => updateTemplate(template.id, 'name', e.target.value)}
                          className="bg-transparent border-b border-slate-300 font-bold text-slate-900 outline-none focus:border-indigo-600 px-1"
                        />
                        {template.isDefault && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full">
                            <Star className="w-3 h-3 fill-amber-700" />
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!template.isDefault && (
                          <button 
                            onClick={() => toggleDefaultTemplate(template.id)}
                            className="p-2 text-slate-400 hover:text-amber-500 transition-colors"
                            title="Set as Default"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteTemplate(template.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout Style</label>
                            <select 
                              value={template.layout || 'standard'}
                              onChange={(e) => updateTemplate(template.id, 'layout', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option value="standard">Standard (Single Line)</option>
                              <option value="professional">Professional (Multi-line Grid)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization Name</label>
                            <input 
                              type="text" 
                              value={template.orgName || ''}
                              onChange={(e) => updateTemplate(template.id, 'orgName', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="e.g. THE ROYAL CLUB"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</label>
                          <textarea 
                            value={template.address || ''}
                            onChange={(e) => updateTemplate(template.id, 'address', e.target.value)}
                            className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Full address..."
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                            <input 
                              type="text" 
                              value={template.phone || ''}
                              onChange={(e) => updateTemplate(template.id, 'phone', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="Phone..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Number</label>
                            <input 
                              type="text" 
                              value={template.gst || ''}
                              onChange={(e) => updateTemplate(template.id, 'gst', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="GST..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Apply to Reports</label>
                          <div className="flex flex-wrap gap-2">
                            {['Financial Summary', 'Membership Aging', 'Inventory Stock', 'Outlet Revenue'].map(report => (
                              <button
                                key={report}
                                onClick={() => {
                                  const current = template.appliedReports || [];
                                  const updated = current.includes(report)
                                    ? current.filter(r => r !== report)
                                    : [...current, report];
                                  updateTemplate(template.id, 'appliedReports', updated);
                                }}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border",
                                  (template.appliedReports || []).includes(report)
                                    ? "bg-indigo-600 text-white border-indigo-600"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300"
                                )}
                              >
                                {report}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Header Content (Fallback/Custom)</label>
                          <textarea 
                            value={template.headerText}
                            onChange={(e) => updateTemplate(template.id, 'headerText', e.target.value)}
                            className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Enter header text or HTML..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Footer Content</label>
                          <textarea 
                            value={template.footerText}
                            onChange={(e) => updateTemplate(template.id, 'footerText', e.target.value)}
                            className="w-full h-20 bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="Enter footer text or HTML..."
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Family</label>
                            <select 
                              value={template.fontFamily}
                              onChange={(e) => updateTemplate(template.id, 'fontFamily', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option>Inter</option>
                              <option>Georgia</option>
                              <option>Courier New</option>
                              <option>Playfair Display</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Size</label>
                            <select 
                              value={template.fontSize}
                              onChange={(e) => updateTemplate(template.id, 'fontSize', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                            >
                              <option>10px</option>
                              <option>12px</option>
                              <option>14px</option>
                              <option>16px</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logo</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={template.logoUrl}
                              onChange={(e) => updateTemplate(template.id, 'logoUrl', e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                              placeholder="https://example.com/logo.png or upload..."
                            />
                            <input 
                              type="file" 
                              id={`template-logo-${template.id}`} 
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => handleTemplateLogoUpload(template.id, e)}
                            />
                            <label 
                              htmlFor={`template-logo-${template.id}`}
                              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                              {template.logoUrl ? <img src={template.logoUrl} alt="Logo" className="w-full h-full object-contain" /> : <ImageIcon className="w-4 h-4 text-slate-300" />}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-6">Visual Identity</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                      {branding.logo ? (
                        <img src={branding.logo} alt="Club Logo" className="w-full h-full object-contain" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        id="logo-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <label 
                        htmlFor="logo-upload"
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 cursor-pointer inline-block"
                      >
                        Upload New Logo
                      </label>
                      <p className="text-xs text-slate-400 mt-2">Recommended size: 512x512px. Max 2MB.</p>
                      {branding.logo && (
                        <button 
                          onClick={() => saveBranding({ ...branding, logo: '' })}
                          className="text-xs text-red-500 font-bold mt-2 hover:underline"
                        >
                          Remove Logo
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={branding.primaryColor}
                          onChange={(e) => saveBranding({ ...branding, primaryColor: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={branding.primaryColor}
                          onChange={(e) => saveBranding({ ...branding, primaryColor: e.target.value })}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Secondary Color</label>
                      <div className="flex gap-3">
                        <input 
                          type="color" 
                          value={branding.secondaryColor}
                          onChange={(e) => saveBranding({ ...branding, secondaryColor: e.target.value })}
                          className="w-12 h-10 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                        />
                        <input 
                          type="text" 
                          value={branding.secondaryColor}
                          onChange={(e) => saveBranding({ ...branding, secondaryColor: e.target.value })}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function SettingInput({ label, placeholder, value, type = 'text' }: { label: string, placeholder?: string, value?: string, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type={type} 
        defaultValue={value}
        placeholder={placeholder} 
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
      />
    </div>
  );
}

function SettingSelect({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange?: (val: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
