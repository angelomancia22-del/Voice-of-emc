import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Clock, CheckCircle2, Shield, Lock, FileText, ArrowRight } from 'lucide-react';

export const TrackTicketView: React.FC = () => {
  const { getComplaintByTicketNumber, setSelectedTicketId } = useApp();
  const [codeInput, setCodeInput] = useState('');
  const [foundTicket, setFoundTicket] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;
    const ticket = getComplaintByTicketNumber(codeInput.trim());
    setFoundTicket(ticket || null);
    setHasSearched(true);
  };

  const sampleCodes = ['EMC-2026-0101', 'EMC-2026-0102', 'EMC-2026-0103', 'EMC-2026-0104'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner */}
      <div
        className="text-white rounded-2xl p-6 sm:p-8 shadow-2xl text-center border border-slate-700 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.96)), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
        }}
      >
        <div className="w-16 h-16 rounded-full bg-white p-1 mx-auto mb-3 shadow-lg border-2 border-amber-400">
          <img
            src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
            alt="Eastern Mindoro College, Inc. Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-2">
          <Search className="w-3.5 h-3.5" /> Instant Grievance Tracking Engine
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Track Your Concern by Reference Code</h2>
        <p className="text-xs text-slate-300 max-w-lg mx-auto mt-2">
          Eastern Mindoro College, Inc. • Enter your reference code (e.g. EMC-2026-0101) issued during submission to view current stage, staff investigation notes, and SLA status.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto relative flex items-center">
          <input
            type="text"
            required
            placeholder="e.g. EMC-2026-0101"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl pl-4 pr-24 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick sample chips */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <span>Try demo codes:</span>
          {sampleCodes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setCodeInput(code);
                const ticket = getComplaintByTicketNumber(code);
                setFoundTicket(ticket || null);
                setHasSearched(true);
              }}
              className="font-mono text-amber-400 hover:underline hover:text-amber-300"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div>
          {foundTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                    {foundTicket.ticketNumber}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                      foundTicket.status === 'Resolved'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : foundTicket.status === 'In Progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {foundTicket.status}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTicketId(foundTicket.id)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <span>Open Full Docket &amp; Discussion</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{foundTicket.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {foundTicket.description}
                </p>
              </div>

              {/* Status Milestones */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Lifecycle Milestones
                </h4>
                <div className="space-y-3">
                  {(foundTicket.statusHistory || []).map((step: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{step.status}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(step.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {step.note || 'Milestone recorded.'} — By {step.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Taken if resolved */}
              {foundTicket.actionTaken && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Action Taken by EMCI Personnel
                  </div>
                  <p>{foundTicket.actionTaken}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center text-slate-500">
              <FileText className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Record Found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No complaint matches reference code "{codeInput.toUpperCase()}". Please verify the code or check with the Office of Student Affairs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
