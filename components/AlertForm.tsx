
import React, { useState } from 'react';
import { VisaType } from '../types';

interface AlertFormProps {
  onSubmit: (data: { country: string; city: string; visaType: VisaType }) => Promise<void>;
}

export const AlertForm: React.FC<AlertFormProps> = ({ onSubmit }) => {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [visaType, setVisaType] = useState<VisaType>(VisaType.TOURIST);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ country, city, visaType });
    setCountry('');
    setCity('');
    setVisaType(VisaType.TOURIST);
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <i className="fa-solid fa-plus text-lg"></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Track New Slot</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Destination Country</label>
          <input
            type="text"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. France, Italy, Germany"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">City / Consulate</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
            placeholder="e.g. Paris, Milan, Berlin"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Visa Category</label>
          <div className="relative">
            <select
              value={visaType}
              onChange={(e) => setVisaType(e.target.value as VisaType)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value={VisaType.TOURIST}>Tourist Visa</option>
              <option value={VisaType.BUSINESS}>Business Visa</option>
              <option value={VisaType.STUDENT}>Student Visa</option>
            </select>
            <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs"></i>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <>
              <span>Initialize Monitor</span>
              <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
