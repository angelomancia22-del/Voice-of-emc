import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { StudentPortal } from './components/StudentPortal';
import { FacultyPortal } from './components/FacultyPortal';
import { AdminPortal } from './components/AdminPortal';
import { AnalyticsModule } from './components/AnalyticsModule';
import { TrackTicketView } from './components/TrackTicketView';
import { ResearchThesisView } from './components/ResearchThesisView';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    selectedTicketId,
    setSelectedTicketId,
    getComplaintByTicketNumber,
    complaints,
  } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Auto-load ticket when scanned from mobile QR code URL (?track=EMC-2026-XXXX)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const trackCode = params.get('track');
      if (trackCode) {
        const ticket = getComplaintByTicketNumber(trackCode);
        if (ticket) {
          setSelectedTicketId(ticket.id);
        }
      }
    }
  }, [complaints, getComplaintByTicketNumber, setSelectedTicketId]);

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-200 selection:text-slate-900 bg-slate-900 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.94)), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
      }}
    >
      {/* Institutional Navigation Header */}
      <Header onToggleNotifications={() => setIsNotifOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'student' && <StudentPortal />}
        {activeTab === 'faculty' && <FacultyPortal />}
        {activeTab === 'admin' && <AdminPortal />}
        {activeTab === 'analytics' && <AnalyticsModule />}
        {activeTab === 'track' && <TrackTicketView />}
        {activeTab === 'thesis' && <ResearchThesisView />}
      </main>

      {/* Notification Drawer with Simulated Email Preview */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Active Ticket Detail Modal */}
      {selectedTicketId && (
        <ComplaintDetailModal
          complaintId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
        />
      )}

      {/* Institutional Footer */}
      <footer className="bg-slate-950/95 backdrop-blur-md text-slate-400 text-xs border-t border-slate-800 mt-12 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2.5 text-white font-bold text-sm">
                <img
                  src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                  alt="Eastern Mindoro College, Inc. Seal"
                  className="w-8 h-8 rounded-full bg-white p-0.5 object-contain border border-amber-400 shrink-0 shadow-sm"
                />
                <span>Eastern Mindoro College, Inc.</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                Established 1945. Committed to academic excellence, moral integrity, and student-centered service in Bongabong and Oriental Mindoro.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-400/90 pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>e-Reklamo Grievance Redress System • ISO 25010 Evaluated</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Student Welfare Contacts
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Bagumbayan, Bongabong, Or. Mindoro</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>OSA Grievance Hotline: (043) 283-5120</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>osa@emc.edu.ph</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Legal &amp; Accreditation
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Commission on Higher Education (CHED) Recognized. Operating under R.A. 10627 (Anti-Bullying Act) and R.A. 10173 (Data Privacy Act of 2012).
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 Eastern Mindoro College, Inc. All rights reserved. Design &amp; Development of a Web-Based Student Concern and Complaint Management System.
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
              <span>System Build: v2.4-Production</span>
              <span>•</span>
              <span className="text-emerald-400">RBAC Enforced</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
