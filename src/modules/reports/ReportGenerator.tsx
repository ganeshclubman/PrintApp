import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Printer, Download, Filter, Calendar, 
  ChevronDown, Search, ArrowLeft, Loader2, CheckCircle2,
  FileSpreadsheet, Layout, Zap
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn, formatCurrency } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportData {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

const mockReportData: ReportData[] = [
  { id: '1', date: '2024-03-01', description: 'Monthly Subscription - John Doe', category: 'Membership', amount: 1200, status: 'Paid' },
  { id: '2', date: '2024-03-02', description: 'Food & Beverage - Outlet 1', category: 'POS', amount: 4500, status: 'Paid' },
  { id: '3', date: '2024-03-05', description: 'Facility Booking - Tennis Court', category: 'Events', amount: 800, status: 'Paid' },
  { id: '4', date: '2024-03-10', description: 'Smart Card Top-up - Jane Smith', category: 'Smart Card', amount: 5000, status: 'Paid' },
  { id: '5', date: '2024-03-12', description: 'Corporate Event - Tech Corp', category: 'Events', amount: 25000, status: 'Pending' },
  { id: '6', date: '2024-03-15', description: 'Membership Renewal - Robert Brown', category: 'Membership', amount: 15000, status: 'Paid' },
  { id: '7', date: '2024-03-18', description: 'Bar Sales - Evening Session', category: 'POS', amount: 12400, status: 'Paid' },
  { id: '8', date: '2024-03-20', description: 'Guest Room Booking - Room 101', category: 'Accommodation', amount: 3500, status: 'Paid' },
];

export const ReportGenerator: React.FC = () => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [filters, setFilters] = useState({
    reportType: 'Financial Summary',
    dateFrom: '2024-03-01',
    dateTo: '2024-03-31',
    category: 'All',
    status: 'All'
  });

  const [printers] = useState<{id: string, name: string, type: string, isDefault: boolean}[]>(() => {
    const saved = localStorage.getItem('clubman_printers');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Front Desk Thermal', type: 'Thermal (POS)', isDefault: true },
      { id: '2', name: 'Office Laser Jet', type: 'Laser', isDefault: false },
    ];
  });

  const [templates] = useState<{
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
        isDefault: true 
      }
    ];
  });

  const [selectedPrinterId, setSelectedPrinterId] = useState(() => {
    return printers.find(p => p.isDefault)?.id || printers[0]?.id;
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(() => {
    return templates.find(t => t.isDefault)?.id || templates[0]?.id;
  });

  // Automatically select template linked to the report type
  useEffect(() => {
    const linkedTemplate = templates.find(t => t.appliedReports?.includes(filters.reportType));
    if (linkedTemplate) {
      setSelectedTemplateId(linkedTemplate.id);
    }
  }, [filters.reportType, templates]);

  const [branding] = useState(() => {
    const saved = localStorage.getItem('clubman_branding');
    return saved ? JSON.parse(saved) : { logo: '' };
  });

  const [isSilentPrinting, setIsSilentPrinting] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the report.');
      return;
    }

    const reportHtml = reportRef.current?.innerHTML;
    const selectedPrinter = printers.find(p => p.id === selectedPrinterId);
    const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

    // Capture all styles to ensure Tailwind classes work in the new window
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Report - ${filters.reportType}</title>
          ${styles}
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
            body { 
              background-color: white !important; 
              font-family: '${selectedTemplate.fontFamily}', sans-serif !important;
              font-size: ${selectedTemplate.fontSize} !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @page { 
              size: A4; 
              margin: 15mm; 
            }
            .print\\:hidden { display: none !important; }
            .rounded-3xl { border-radius: 0 !important; }
            .shadow-xl { box-shadow: none !important; }
            .border { border-color: #e2e8f0 !important; }
            
            .report-header {
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #000;
            }
            .header-grid {
              display: grid;
              grid-template-columns: 100px 1fr 200px;
              gap: 20px;
              align-items: start;
            }
            .header-info {
              text-align: left;
            }
            .header-meta {
              text-align: right;
              font-size: 11px;
            }
            .org-name {
              font-size: 20px;
              font-weight: 900;
              margin-bottom: 4px;
              text-transform: uppercase;
            }
            .org-details {
              font-size: 11px;
              color: #000;
              line-height: 1.4;
            }
            .report-title-box {
              text-align: center;
              margin-top: 10px;
              font-size: 16px;
              font-weight: bold;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .report-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              padding: 10px 0;
              border-top: 1px solid #000;
              font-size: 10px;
              display: flex;
              justify-content: space-between;
            }
            .report-logo {
              max-width: 100%;
              max-height: 80px;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <div class="bg-white pb-20">
            <div class="report-header">
              ${selectedTemplate.layout === 'professional' ? `
                <div class="header-grid">
                  <div class="header-logo">
                    ${(selectedTemplate.logoUrl || branding.logo) ? `<img src="${selectedTemplate.logoUrl || branding.logo}" class="report-logo" />` : ''}
                  </div>
                  <div class="header-info">
                    <div class="org-name">${selectedTemplate.orgName || 'THE ROYAL CLUB'}</div>
                    <div class="org-details">
                      ${selectedTemplate.address ? `<div>${selectedTemplate.address}</div>` : ''}
                      ${selectedTemplate.phone ? `<div>Phone No : ${selectedTemplate.phone}</div>` : ''}
                      ${selectedTemplate.gst ? `<div>GST No. : ${selectedTemplate.gst}</div>` : ''}
                    </div>
                  </div>
                  <div class="header-meta">
                    <div class="mb-1"><strong>Print Date :</strong> ${new Date().toLocaleString()}</div>
                    <div><strong>Page No :</strong> 1 of 1</div>
                  </div>
                </div>
                <div class="report-title-box">${filters.reportType}</div>
              ` : `
                <div class="text-center">
                  ${(selectedTemplate.logoUrl || branding.logo) ? `<img src="${selectedTemplate.logoUrl || branding.logo}" class="report-logo mx-auto" />` : ''}
                  <div class="text-lg font-black uppercase tracking-widest">${selectedTemplate.headerText}</div>
                  <div class="text-xs text-slate-500 mt-2">${filters.reportType} - Generated on ${new Date().toLocaleDateString()}</div>
                </div>
              `}
            </div>

            <div class="p-4 bg-slate-50 border-b border-slate-200 mb-8 print:hidden">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Printer</p>
              <p class="text-sm font-bold text-slate-900">${selectedPrinter?.name || 'System Default'}</p>
            </div>

            ${reportHtml}

            <div class="report-footer">
              <div>Printed By : <strong>Admin</strong></div>
              <div>${selectedTemplate.footerText}</div>
              <div>Page <span class="pageNumber"></span></div>
            </div>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSilentPrint = async () => {
    const apiKey = localStorage.getItem('clubman_printnode_key');
    if (!apiKey) {
      alert('Please configure your PrintNode API Key in System Settings to use Silent Printing.');
      return;
    }

    setIsSilentPrinting(true);
    try {
      const selectedPrinter = printers.find(p => p.id === selectedPrinterId);
      const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
      
      // PrintNode API expects a base64 encoded PDF or HTML
      // For this demo, we'll simulate the API call
      console.log('Sending silent print job to PrintNode...', {
        printerId: selectedPrinterId,
        printerName: selectedPrinter?.name,
        template: selectedTemplate.name
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Silent print job sent successfully to ${selectedPrinter?.name}!`);
    } catch (error) {
      console.error('Silent printing failed:', error);
      alert('Failed to send print job. Please check your PrintNode configuration.');
    } finally {
      setIsSilentPrinting(false);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add Title
    doc.setFontSize(20);
    doc.text('Clubman ERP Report', 14, 22);
    doc.setFontSize(14);
    doc.text(filters.reportType, 14, 32);
    doc.setFontSize(10);
    doc.text(`Period: ${filters.dateFrom} to ${filters.dateTo}`, 14, 40);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 46);

    // Add Table
    const tableData = mockReportData.map(item => [
      item.date,
      item.description,
      item.category,
      formatCurrency(item.amount),
      item.status
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['Date', 'Description', 'Category', 'Amount', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
    });

    // Add Total
    const finalY = (doc as any).lastAutoTable.finalY || 60;
    doc.setFontSize(12);
    doc.text(`Total Revenue: ${formatCurrency(mockReportData.reduce((acc, curr) => acc + curr.amount, 0))}`, 14, finalY + 15);

    // Open in new tab
    const pdfBlob = doc.output('bloburl');
    window.open(pdfBlob, '_blank');
  };

  const handleExportExcel = () => {
    const data = mockReportData.map(item => ({
      Date: item.date,
      Description: item.description,
      Category: item.category,
      Amount: item.amount,
      Status: item.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, `${filters.reportType.replace(/\s+/g, '_')}_Report.xlsx`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 print:hidden">
        <div className="flex items-center gap-4">
          <Link to="/reports" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Custom Report Generator</h1>
            <p className="text-slate-500 text-sm">Configure filters to generate detailed club analytics.</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {showReport && (
            <>
              <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-72">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <Printer className="w-4 h-4 text-slate-400" />
                  <select 
                    className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none"
                    value={selectedPrinterId}
                    onChange={(e) => setSelectedPrinterId(e.target.value)}
                  >
                    {printers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                  <Layout className="w-4 h-4 text-slate-400" />
                  <select 
                    className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none"
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                  >
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} {t.appliedReports?.includes(filters.reportType) ? '(Linked)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm border border-slate-100"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Preview Report
                  </button>
                  <button 
                    onClick={handleSilentPrint}
                    disabled={isSilentPrinting}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isSilentPrinting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                    Silent Print
                  </button>
                </div>
              </div>
              <button 
                onClick={handleExportPDF}
                className="w-72 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4 text-rose-500" />
                Export as PDF
              </button>
              <button 
                onClick={handleExportExcel}
                className="w-72 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                Export as Excel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-8 print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Type</label>
            <div className="relative">
              <select 
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={filters.reportType}
                onChange={(e) => setFilters({...filters, reportType: e.target.value})}
              >
                <option>Financial Summary</option>
                <option>Membership Aging</option>
                <option>Inventory Stock</option>
                <option>Outlet Revenue</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date From</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date To</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="date" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
            <select 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option>All</option>
              <option>Membership</option>
              <option>POS</option>
              <option>Events</option>
              <option>Accommodation</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {showReport ? (
        <div ref={reportRef} className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden print:border-none print:shadow-none animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Print Header */}
          <div className="p-12 border-b border-slate-100 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Clubman ERP</h2>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{filters.reportType}</h3>
              <p className="text-slate-500 text-sm mt-1">Period: {filters.dateFrom} to {filters.dateTo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generated On</p>
              <p className="text-sm font-bold text-slate-900 mt-1">{new Date().toLocaleString()}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Generated By</p>
              <p className="text-sm font-bold text-slate-900 mt-1">Ganesh Ratu (Admin)</p>
            </div>
          </div>

          {/* Report Content */}
          <div className="p-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest">Date</th>
                  <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest">Description</th>
                  <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest">Category</th>
                  <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-right">Amount</th>
                  <th className="py-4 text-xs font-black text-slate-900 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockReportData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-sm font-bold text-slate-600">{item.date}</td>
                    <td className="py-4 text-sm font-medium text-slate-900">{item.description}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-black text-slate-900 text-right">{formatCurrency(item.amount)}</td>
                    <td className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className={cn("w-3.5 h-3.5", item.status === 'Paid' ? "text-emerald-500" : "text-amber-500")} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{item.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 bg-slate-50/50">
                  <td colSpan={3} className="py-6 text-sm font-black text-slate-900 uppercase tracking-widest text-right px-4">Total Revenue</td>
                  <td className="py-6 text-xl font-black text-indigo-600 text-right">
                    {formatCurrency(mockReportData.reduce((acc, curr) => acc + curr.amount, 0))}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>

            {/* Print Footer */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Authentication</p>
                <p className="text-xs font-bold text-slate-900">Digital Signature: ERP-SEC-99283-X</p>
              </div>
              <div className="text-center w-48 border-t border-slate-900 pt-2">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl h-96 flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-12 h-12 mb-4 opacity-20" />
          <p className="font-bold">No report generated yet.</p>
          <p className="text-sm mt-1">Select filters and click "Generate" to preview the report.</p>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
          }
          .p-8 {
            padding: 0 !important;
          }
          .max-w-7xl {
            max-width: none !important;
          }
          .rounded-3xl {
            border-radius: 0 !important;
          }
          .shadow-xl {
            box-shadow: none !important;
          }
          .bg-slate-50 {
            background-color: white !important;
          }
        }
      `}</style>
    </div>
  );
};
