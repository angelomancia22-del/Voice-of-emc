import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, Department } from '../types';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export const FacultyPortal: React.FC = () => {
  const {
    currentUser,
    complaints,
    updateComplaintStatus,
    setSelectedTicketId,
  } = useApp();

  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>(currentUser.department || 'all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Determine tickets relevant to this faculty
  const relevantComplaints = complaints.filter((c) => {
    // If user is a faculty member, match either their department or assigned to them, or let them filter by department
    const matchesDept =
      selectedDeptFilter === 'all'
        ? true
        : c.department.toLowerCase() === selectedDeptFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  const assignedToMeCount = complaints.filter((c) => c.assignedToId === currentUser.id).length;
  const inProgressCount = relevantComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Under Review').length;
  const resolvedCount = relevantComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Faculty / Department Head Header with Campus Background & Official Logo */}
      <div
        className="text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-800/50 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(6, 78, 59, 0.88) 60%, rgba(15, 23, 42, 0.8) 100%), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg shadow-black/50 border-2 border-amber-400 shrink-0 hidden sm:block">
              <img
                src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                alt="Eastern Mindoro College, Inc. Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <Building2 className="w-3.5 h-3.5" /> Departmental Resolution &amp; Investigation Portal
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Faculty / Department Inbox
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Review assigned student complaints, conduct investigations, post internal staff directives, and log formal remediation actions within institutional SLA timeframes.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center min-w-[120px]">
              <div className="text-2xl font-black text-amber-400">{inProgressCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Pending Action</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center min-w-[120px]">
              <div className="text-2xl font-black text-emerald-400">{resolvedCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Cases Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Inbox Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Departmental Grievance Docket</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any ticket to view student attachments, communicate securely, or mark as resolved.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Department Filter Selector */}
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
            >
              <option value="all">All Departments</option>
              <option value="Academic Affairs">Academic Affairs</option>
              <option value="Physical Plant & Facilities">Physical Plant &amp; Facilities</option>
              <option value="Office of Student Affairs (OSA)">Office of Student Affairs (OSA)</option>
              <option value="Registrar Office">Registrar Office</option>
              <option value="Accounting & Finance">Accounting &amp; Finance</option>
              <option value="Guidance & Counseling">Guidance &amp; Counseling</option>
              <option value="Library Services">Library Services</option>
              <option value="College Security & Sanitation">College Security &amp; Sanitation</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted (New)</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Appealed">Appealed</option>
            </select>
          </div>
        </div>

        {/* Complaints Table / List */}
        {relevantComplaints.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed rounded-xl">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">No active tickets for this department filter</p>
            <p className="text-xs text-slate-500 mt-1">
              Select "All Departments" or reset status filter to browse other active grievances.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {relevantComplaints.map((ticket) => {
              const targetDate = new Date(ticket.targetResolutionDate);
              const now = new Date();
              const isOverdue =
                now > targetDate && ticket.status !== 'Resolved' && ticket.status !== 'Closed';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          ticket.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ticket.status === 'In Progress'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {ticket.status}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {ticket.department}
                      </span>
                      {ticket.priority === 'Urgent' && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          URGENT
                        </span>
                      )}
                      {ticket.isAnonymous && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1 border border-purple-200">
                          <Lock className="w-2.5 h-2.5" /> Anonymous Student
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {ticket.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Complainant: <strong className="text-slate-700">{ticket.studentName}</strong></span>
                      <span>Assigned: <strong className="text-slate-700">{ticket.assignedToName || 'Unassigned'}</strong></span>
                      <span>Target SLA: {targetDate.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                        isOverdue
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : ticket.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ticket.status === 'Resolved'
                        ? 'Resolved'
                        : isOverdue
                        ? 'SLA Overdue'
                        : 'On Schedule'}
                    </span>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>Act on Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
