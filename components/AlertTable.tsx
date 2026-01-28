
import React from 'react';
import { VisaAlert, AlertStatus } from '../types';
import { PandaBambooLogo } from '../App';

interface AlertTableProps {
  alerts: VisaAlert[];
  onUpdateStatus: (id: string, status: AlertStatus) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export const AlertTable: React.FC<AlertTableProps> = ({ alerts, onUpdateStatus, onDelete, isLoading }) => {
  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case AlertStatus.ACTIVE: 
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 border-emerald-100 text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Active
          </span>
        );
      case AlertStatus.BOOKED: 
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-blue-50 border-blue-100 text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Booked
          </span>
        );
      case AlertStatus.EXPIRED: 
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 border-slate-200 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            Expired
          </span>
        );
      default: return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-white">
        <div className="relative flex items-center justify-center">
           <div className="w-16 h-16 rounded-2xl border-4 border-emerald-50 border-t-emerald-600 animate-spin absolute"></div>
           <PandaBambooLogo 
             className="w-8 h-8 text-emerald-600/30" 
             faceColor="transparent" 
             bambooColor="rgba(16, 185, 129, 0.2)" 
           />
        </div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-12">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Destinations</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Time Registered</th>
            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Terminal Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {alerts.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-8 py-24 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
                    <i className="fa-solid fa-folder-open text-2xl"></i>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">No records found for current selection.</p>
                </div>
              </td>
            </tr>
          ) : (
            alerts.map((alert) => (
              <tr key={alert.id} className="group hover:bg-slate-50/80 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm tracking-tight">{alert.country}</div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{alert.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                    {alert.visaType}
                  </span>
                </td>
                <td className="px-6 py-6">
                  {getStatusBadge(alert.status)}
                </td>
                <td className="px-6 py-6">
                  <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                    <i className="fa-regular fa-clock opacity-50"></i>
                    {new Date(alert.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <select
                        value={alert.status}
                        onChange={(e) => onUpdateStatus(alert.id, e.target.value as AlertStatus)}
                        className="text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 appearance-none pr-8 cursor-pointer shadow-sm"
                      >
                        <option value={AlertStatus.ACTIVE}>Active</option>
                        <option value={AlertStatus.BOOKED}>Booked</option>
                        <option value={AlertStatus.EXPIRED}>Expired</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[8px] text-slate-400 pointer-events-none"></i>
                    </div>
                    <button
                      onClick={() => onDelete(alert.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-300 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      title="Purge Record"
                    >
                      <i className="fa-solid fa-trash text-[10px]"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
