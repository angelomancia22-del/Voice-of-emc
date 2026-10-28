import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import {
  X,
  Bell,
  Mail,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedTicketId,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread' | 'email'>('all');
  const [inspectedEmail, setInspectedEmail] = useState<AppNotification | null>(null);

  if (!isOpen) return null;

  // Filter notifications for current user or show all if admin oversight
  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || currentUser.role === 'admin'
  );

  const filtered = userNotifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'email') return !!n.emailSimulated;
    return true;
  });

  const handleNotificationClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.ticketId) {
      setSelectedTicketId(n.ticketId);
      onClose();
    }
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'status_change':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'ticket_assigned':
        return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'sla_warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'rating_received':
        return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case 'ticket_submitted':
        return <Clock className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">Automated Notification Center</h3>
              <p className="text-[11px] text-slate-400">
                In-app &amp; simulated institutional email alerts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Actions Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Unread ({userNotifications.filter((n) => !n.isRead).length})
            </button>
            <button
              onClick={() => setFilter('email')}
              className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1 ${
                filter === 'email'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Mail className="w-3 h-3 text-amber-500" />
              <span>Emails</span>
            </button>
          </div>

          <button
            onClick={markAllNotificationsAsRead}
            className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
          >
            Mark all read
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">No notifications matching criteria</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl transition-all cursor-pointer border ${
                  !notif.isRead
                    ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50'
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono font-semibold text-slate-600">
                        #{notif.ticketNumber}
                      </span>
                      <span>{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Email simulation badge */}
                    {notif.emailSimulated && (
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                          <Mail className="w-3 h-3" /> Sent to {notif.emailSimulated.to}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedEmail(notif);
                          }}
                          className="text-[10px] font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded transition-colors"
                        >
                          View Email Body
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Automated triggers fire on: Submission, Assignment, Status Change, and CSAT Feedback.
        </div>
      </div>

      {/* Simulated Email Modal Inspector */}
      {inspectedEmail && inspectedEmail.emailSimulated && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-300 overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-sm">Simulated Institutional Email</h4>
              </div>
              <button
                onClick={() => setInspectedEmail(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                <div>
                  <strong className="text-slate-500">From:</strong>{' '}
                  <span className="text-slate-800">noreply-grievance@emc.edu.ph (EMCI Student Portal)</span>
                </div>
                <div>
                  <strong className="text-slate-500">To:</strong>{' '}
                  <span className="text-slate-800">{inspectedEmail.emailSimulated.to}</span>
                </div>
                <div>
                  <strong className="text-slate-500">Subject:</strong>{' '}
                  <span className="text-slate-950 font-bold">{inspectedEmail.emailSimulated.subject}</span>
                </div>
                <div>
                  <strong className="text-slate-500">Date:</strong>{' '}
                  <span className="text-slate-800">{new Date(inspectedEmail.createdAt).toUTCString()}</span>
                </div>
              </div>

              {/* Official EMCI Email Body */}
              <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-white">
                <div className="border-b pb-2 mb-2 flex items-center justify-between">
                  <span className="font-bold text-slate-900">EASTERN MINDORO COLLEGE, INC.</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    Bongabong, Oriental Mindoro
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-sans text-xs">
                  {inspectedEmail.emailSimulated.snippet}
                </p>
                <p className="text-slate-600 text-[11px]">
                  You can check live progress, chat with assigned school officers, or appeal by visiting the student portal with tracking number <strong>{inspectedEmail.ticketNumber}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedTicketId(inspectedEmail.ticketId);
                      setInspectedEmail(null);
                      onClose();
                    }}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open Grievance Ticket Online <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
