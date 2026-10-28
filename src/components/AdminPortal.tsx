import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, User, UserRole, Department, PriorityLevel, ComplaintStatus } from '../types';
import {
  ShieldCheck,
  Users,
  Clock,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  Settings,
  ArrowRight,
  Lock,
  Plus,
  Key,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    currentUser,
    allUsers,
    complaints,
    auditLogs,
    setSelectedTicketId,
    updateComplaintStatus,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'triage' | 'users' | 'audit' | 'sla'>('triage');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering complaints for triage
  const filteredComplaints = complaints.filter((c) => {
    const matchesDept = departmentFilter === 'all' || c.department === departmentFilter;
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesPriority && matchesStatus && matchesSearch;
  });

  const urgentCount = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Resolved' && c.status !== 'Closed').length;
  const overdueCount = complaints.filter((c) => {
    const isPast = new Date() > new Date(c.targetResolutionDate);
    return isPast && c.status !== 'Resolved' && c.status !== 'Closed';
  }).length;
  const appealedCount = complaints.filter((c) => c.status === 'Appealed').length;

  return (
    <div className="space-y-6">
      {/* Admin Executive Header with Campus Background & Official Logo */}
      <div
        className="text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-800/50 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(88, 28, 135, 0.88) 60%, rgba(15, 23, 42, 0.82) 100%), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
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
              <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Dean of Student Affairs / Central Administration
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                System Administration &amp; Grievance Oversight
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Institutional governance of student concerns, departmental triage, role-based access control, and complete audit trail preservation for Eastern Mindoro College, Inc.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center min-w-[110px]">
              <div className="text-2xl font-black text-red-400">{urgentCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Urgent Tickets</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center min-w-[110px]">
              <div className="text-2xl font-black text-amber-400">{overdueCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">SLA Breaches</div>
            </div>
            <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-xl text-center min-w-[110px]">
              <div className="text-2xl font-black text-purple-400">{appealedCount}</div>
              <div className="text-[11px] text-slate-300 font-medium">Appeals Lodged</div>
            </div>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="mt-6 pt-4 border-t border-purple-900/50 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveAdminTab('triage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'triage'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Ticket Triage &amp; Queue ({complaints.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'users'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Users &amp; Role Permissions ({allUsers.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'audit'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" /> Institutional Audit Trail ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('sla')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'sla'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> SLA Policies &amp; Turnaround Rules
          </button>
        </div>
      </div>

      {/* TAB 1: TRIAGE & OVERVIEW */}
      {activeAdminTab === 'triage' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                All Institutional Complaints &amp; Concerns
              </h3>
              <p className="text-xs text-slate-500">
                Filter by department, prioritize escalations, and route tickets to responsible college units.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search code or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700"
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
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700"
              >
                <option value="all">All Priorities</option>
                <option value="Urgent">Urgent Priority</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
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

          {/* Table of all complaints */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Ticket Code</th>
                  <th className="py-3 px-3">Title &amp; Category</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Complainant</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Target SLA</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((ticket) => {
                  const targetDate = new Date(ticket.targetResolutionDate);
                  const isOverdue =
                    new Date() > targetDate && ticket.status !== 'Resolved' && ticket.status !== 'Closed';

                  return (
                    <tr
                      key={ticket.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedTicketId(ticket.id)}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-purple-900 whitespace-nowrap">
                        {ticket.ticketNumber}
                      </td>
                      <td className="py-3 px-3 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">{ticket.title}</div>
                        <div className="text-[10px] text-slate-400">{ticket.category}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-700">
                        {ticket.department}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {ticket.isAnonymous ? (
                          <span className="text-purple-600 font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Anonymous
                          </span>
                        ) : (
                          <span className="text-slate-800">{ticket.studentName}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ticket.priority === 'Urgent'
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : ticket.priority === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            ticket.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ticket.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : ticket.status === 'Appealed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}>
                          {targetDate.toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] rounded"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RBAC USER & PERMISSION MATRIX */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              <span>Role-Based Access Control (RBAC) Specification &amp; Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Rigid privilege segregation ensures students cannot tamper with faculty investigations, while protecting student anonymity.
            </p>
          </div>

          {/* Permissions Matrix */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">System Capability / Module</th>
                  <th className="py-3 px-4 text-center">Student Role</th>
                  <th className="py-3 px-4 text-center">Faculty / Staff Role</th>
                  <th className="py-3 px-4 text-center">Administrator / Dean</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Submit Grievance / Concern</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Full Access</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">-</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Track Ticket by Code / Stepper</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Review Departmental Queue</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Assigned Dept Only</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ All Depts</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Post Internal Staff Remarks (Confidential)</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Transition Status &amp; Log Action Taken</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Allowed</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Rate Resolution Satisfaction (CSAT)</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Student Complainant</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">-</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">-</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Triage &amp; Assign Handlers Across Units</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Full Authority</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-semibold">Access Institutional Analytics &amp; Reports</td>
                  <td className="py-2.5 px-4 text-center text-red-500 font-bold">✕ Denied</td>
                  <td className="py-2.5 px-4 text-center text-slate-400">Departmental Only</td>
                  <td className="py-2.5 px-4 text-center text-emerald-600 font-bold">✓ Institutional Master</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* User Directory */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              EMCI System Accounts Directory
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 truncate">{user.name}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : user.role === 'faculty'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {user.programOrDesignation || user.department}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL LOG */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <span>Immutable Institutional Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-500">
              Every transition, assignment, public remark, and rating is cryptographically logged for CHED and ISO 25010 compliance.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Ticket</th>
                  <th className="py-3 px-3">Action Event</th>
                  <th className="py-3 px-3">Performed By</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-900 whitespace-nowrap">
                      {log.ticketNumber}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-semibold border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                      {log.performedBy}
                    </td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold whitespace-nowrap">
                      {log.performedByRole}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SLA POLICIES */}
      {activeAdminTab === 'sla' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span>Service Level Agreement (SLA) &amp; Escalation Thresholds</span>
            </h3>
            <p className="text-xs text-slate-500">
              Institutional benchmark resolution turnaround times established by the Eastern Mindoro College Board of Trustees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-900 uppercase">Urgent Priority (Critical)</span>
                <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded">48 Hours (2 Days)</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                Applies to: Cashier examination permits cut-off, major power/cooling outages in computer labs during midterms, student safety or physical harassment reports.
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 uppercase">High Priority</span>
                <span className="text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded">72 Hours (3 Days)</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Applies to: Discrepancies in encoded prerequisites preventing graduation or course registration, lab projector failure, restroom water disruption.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 uppercase">Medium Priority (Standard)</span>
                <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">5 Business Days</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Applies to: Grade re-computation requests, library extended hours petitions, canteen menu/pricing reviews, non-emergency counseling appointments.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase">Low Priority (General Feedback)</span>
                <span className="text-xs font-bold bg-slate-600 text-white px-2 py-0.5 rounded">7 Business Days</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Applies to: General campus suggestions, minor locker requests, website layout suggestions, student club activity inquiries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
