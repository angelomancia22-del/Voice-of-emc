import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Complaint } from '../types';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Shield,
  Clock,
  Building,
} from 'lucide-react';

interface TicketQRCodeModalProps {
  ticket: Complaint;
  onClose: () => void;
}

export const TicketQRCodeModal: React.FC<TicketQRCodeModalProps> = ({ ticket, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate mobile tracking URL
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const trackingUrl = `${origin}${pathname}?track=${ticket.ticketNumber}`;

  useEffect(() => {
    QRCode.toDataURL(trackingUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0f172a', // slate-900
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [trackingUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `EMCI_QR_${ticket.ticketNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in duration-150">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white p-0.5 border border-amber-400 shrink-0">
              <img
                src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                alt="EMCI Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h3 className="font-bold text-xs">Mobile QR Tracking Pass</h3>
              <p className="text-[10px] text-slate-400">Eastern Mindoro College, Inc.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Area */}
        <div className="p-6 text-center space-y-4 print:p-8">
          {/* Official Pass Header */}
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-serif font-black text-sm tracking-wide text-slate-900 uppercase">
                Eastern Mindoro College, Inc.
              </span>
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              Office of Student Affairs • Grievance Tracking Slip
            </div>
          </div>

          {/* Ticket Reference Badge */}
          <div className="inline-block bg-amber-50 border border-amber-300 px-3.5 py-1 rounded-xl">
            <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider block">
              Reference Ticket
            </span>
            <span className="font-mono text-lg font-black text-amber-700 tracking-wider">
              {ticket.ticketNumber}
            </span>
          </div>

          {/* High-Definition QR Code Image */}
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md inline-block relative group">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code for ${ticket.ticketNumber}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-100 text-xs text-slate-400">
                  Generating QR Code...
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-600 font-medium">
              <Smartphone className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>Scan with camera to pull up status on phone</span>
            </div>
          </div>

          {/* Ticket Information Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-2">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[11px] text-slate-500 font-medium">Concern Title:</span>
              <span className="text-right font-bold text-slate-900 max-w-[200px] truncate">
                {ticket.title}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Complainant:</span>
              <span className="font-semibold text-slate-800">
                {ticket.isAnonymous ? 'Protected Student (Anonymous)' : ticket.studentName}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Department:</span>
              <span className="font-semibold text-slate-800">{ticket.department}</span>
            </div>

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-medium">Current Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  ticket.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : ticket.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {ticket.status}
              </span>
            </div>

            <div className="flex justify-between items-center text-[11px] border-t border-slate-200 pt-1.5">
              <span className="text-slate-500 font-medium">Target SLA Date:</span>
              <span className="font-semibold text-slate-700">
                {new Date(ticket.targetResolutionDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Direct Link Box */}
          <div className="bg-slate-100 border border-slate-200 rounded-lg p-2 flex items-center justify-between gap-2 text-[11px] text-slate-600 font-mono">
            <span className="truncate max-w-[240px] text-slate-700">{trackingUrl}</span>
            <button
              onClick={handleCopyLink}
              type="button"
              className="px-2 py-1 bg-white hover:bg-slate-200 border border-slate-300 rounded font-sans text-[10px] font-bold text-slate-800 shrink-0 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={handleDownload}
              type="button"
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save PNG</span>
            </button>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
