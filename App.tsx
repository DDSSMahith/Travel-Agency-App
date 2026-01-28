
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { backend } from './backend_logic';
import { VisaAlert, VisaType, AlertStatus, AlertFilters } from './types';
import { AlertForm } from './components/AlertForm';
import { AlertTable } from './components/AlertTable';
import { getVisaInsights } from './geminiService';

const ITEMS_PER_PAGE = 5;

// Custom Panda Eating Bamboo Logo Component - Enhanced for better style control
export const PandaBambooLogo = ({ 
  className = "w-8 h-8", 
  bambooColor = "#4ade80", 
  faceColor = "white",
  strokeColor = "currentColor" 
}: { 
  className?: string, 
  bambooColor?: string, 
  faceColor?: string,
  strokeColor?: string 
}) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Ears */}
    <circle cx="18" cy="18" r="8" fill={strokeColor} />
    <circle cx="46" cy="18" r="8" fill={strokeColor} />
    {/* Face */}
    <circle cx="32" cy="34" r="22" fill={faceColor} stroke={strokeColor} strokeWidth="2" />
    {/* Eye Patches */}
    <ellipse cx="23" cy="32" rx="6" ry="7" fill={strokeColor} />
    <ellipse cx="41" cy="32" rx="6" ry="7" fill={strokeColor} />
    {/* Eyes */}
    <circle cx="23" cy="31" r="2" fill={faceColor} />
    <circle cx="41" cy="31" r="2" fill={faceColor} />
    {/* Nose */}
    <path d="M30 42 Q32 45 34 42" stroke={strokeColor} strokeWidth="2" fill="none" />
    {/* Bamboo */}
    <path d="M45 40 L55 60" stroke={bambooColor} strokeWidth="4" strokeLinecap="round" />
    <path d="M50 50 Q58 45 60 48" stroke={bambooColor} strokeWidth="2" fill="none" />
    <path d="M52 55 Q60 52 62 55" stroke={bambooColor} strokeWidth="2" fill="none" />
  </svg>
);

const App: React.FC = () => {
  const [alerts, setAlerts] = useState<VisaAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AlertFilters>({ country: '', status: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [insights, setInsights] = useState<string>('');
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    const response = await backend.getAlerts({ 
      country: filters.country, 
      status: filters.status 
    });
    if (response.data) {
      setAlerts(response.data);
    } else if (response.error) {
      showNotification('error', response.error);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleCreateAlert = async (data: { country: string; city: string; visaType: VisaType }) => {
    const res = await backend.createAlert(data);
    if (res.error) {
      showNotification('error', res.error);
    } else {
      showNotification('success', 'New visa slot tracked!');
      fetchAlerts();
    }
  };

  const handleUpdateStatus = async (id: string, status: AlertStatus) => {
    const res = await backend.updateStatus(id, status);
    if (res.error) {
      showNotification('error', res.error);
    } else {
      showNotification('success', 'Status updated.');
      fetchAlerts();
    }
  };

  const handleDeleteAlert = async (id: string) => {
    if (window.confirm('Delete this visa alert?')) {
      const res = await backend.deleteAlert(id);
      if (res.error) {
        showNotification('error', res.error);
      } else {
        showNotification('success', 'Alert removed.');
        fetchAlerts();
      }
    }
  };

  const generateAIInsights = async () => {
    setIsInsightsLoading(true);
    try {
      const result = await getVisaInsights(alerts);
      setInsights(result || '');
    } catch (e) {
      showNotification('error', 'AI Insights failed to load.');
    } finally {
      setIsInsightsLoading(false);
    }
  };

  const paginatedAlerts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return alerts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [alerts, currentPage]);

  const totalPages = Math.ceil(alerts.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
        }`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}`}></i>
          <span className="font-bold text-sm tracking-tight">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 rotate-3 transition-transform hover:rotate-0">
                <PandaBambooLogo className="w-10 h-10 text-white" bambooColor="#fff" faceColor="#fff" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                  PANDA <span className="text-emerald-600">VISA</span>
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 ml-0.5">Global Slot Monitor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8">
               <div className="hidden lg:flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                 <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest">Real-time Stream active</span>
               </div>
               <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                 <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-slate-800">Admin Terminal</p>
                   <p className="text-[10px] text-slate-400 font-medium">Session: active</p>
                 </div>
                 <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-inner overflow-hidden">
                   <PandaBambooLogo className="w-6 h-6 text-slate-400" faceColor="transparent" strokeColor="currentColor" bambooColor="currentColor" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input and Intelligence */}
          <div className="lg:col-span-4 space-y-8">
            <AlertForm onSubmit={handleCreateAlert} />
            
            {/* AI Insights Panel */}
            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-800">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900">
                      <i className="fa-solid fa-brain text-xs"></i>
                    </div>
                    <h3 className="text-lg font-bold">Panda AI</h3>
                  </div>
                  <span className="text-[9px] font-black bg-white/10 px-2 py-1 rounded text-emerald-400 uppercase tracking-widest">v3.0 Engine</span>
                </div>
                
                {insights ? (
                  <div className="text-sm leading-relaxed mb-8 text-slate-300 font-light bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                    {insights}
                  </div>
                ) : (
                  <div className="mb-8 p-6 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-500 text-sm text-center">
                    <i className="fa-solid fa-cloud-bolt block text-2xl mb-3 opacity-20"></i>
                    Awaiting data points for trend analysis and predictive insights.
                  </div>
                )}
                
                <button 
                  onClick={generateAIInsights}
                  disabled={isInsightsLoading || alerts.length === 0}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  {isInsightsLoading ? (
                    <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-microchip"></i>
                      Analyze Inventory
                    </>
                  )}
                </button>
              </div>
              {/* Very dull background panda to avoid dominance */}
              <div className="absolute -bottom-12 -right-12 rotate-12 pointer-events-none opacity-[0.04]">
                <PandaBambooLogo 
                  className="w-[300px] h-[300px]" 
                  bambooColor="white" 
                  faceColor="transparent" 
                  strokeColor="white"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Database Table */}
          <div className="lg:col-span-8 space-y-8">
            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[280px]">
                <label className="block text-[11px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Search Directory</label>
                <div className="relative group">
                  <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors"></i>
                  <input
                    type="text"
                    placeholder="Search by country, city or consulate..."
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>
              <div className="min-w-[180px]">
                <label className="block text-[11px] font-black text-slate-400 mb-2 ml-1 uppercase tracking-widest">Filter Status</label>
                <div className="relative">
                  <select
                    value={filters.status || ''}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as AlertStatus || undefined })}
                    className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all appearance-none cursor-pointer shadow-sm pr-10"
                  >
                    <option value="">All Statuses</option>
                    <option value={AlertStatus.ACTIVE}>Active Slots</option>
                    <option value={AlertStatus.BOOKED}>Processed</option>
                    <option value={AlertStatus.EXPIRED}>Expired</option>
                  </select>
                  <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs"></i>
                </div>
              </div>
              <button 
                onClick={() => setFilters({ country: '', status: undefined })}
                className="h-[52px] w-[52px] text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100 hover:border-rose-100 flex items-center justify-center bg-white shadow-sm"
                title="Reset Database View"
              >
                <i className="fa-solid fa-rotate-left"></i>
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <AlertTable 
                alerts={paginatedAlerts} 
                onUpdateStatus={handleUpdateStatus} 
                onDelete={handleDeleteAlert}
                isLoading={loading}
              />
              
              {/* Pagination UI */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-8 bg-slate-50/50 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Record set:</span>
                  <p className="text-sm font-bold text-slate-700">
                    {paginatedAlerts.length} <span className="text-slate-300 mx-1">/</span> {alerts.length} <span className="text-slate-400 text-[10px] ml-1">total alerts</span>
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-white hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`min-w-[40px] h-10 rounded-xl text-xs font-black transition-all ${
                          currentPage === i + 1 
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                            : 'bg-white text-slate-400 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                     onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                     disabled={currentPage === totalPages || totalPages === 0}
                     className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-white hover:border-emerald-500 hover:text-emerald-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-12 mt-10 border-t border-slate-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default group">
             <PandaBambooLogo className="w-12 h-12 text-emerald-950 group-hover:scale-110 transition-transform" faceColor="transparent" bambooColor="#052e16" />
             <div>
               <span className="text-sm font-black uppercase tracking-[0.2em] text-emerald-950 block leading-none">The Flying Panda</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Internal Logistics Division</span>
             </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-emerald-600 transition-colors">Compliance</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-emerald-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
