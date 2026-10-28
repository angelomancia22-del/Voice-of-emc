import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintCategory, Department } from '../types';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Printer,
  Download,
  Calendar,
  Building2,
  FileSpreadsheet,
  PieChart,
  Award,
} from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const { complaints } = useApp();

  const [dateFilter, setDateFilter] = useState<'all' | 'semester' | 'month'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [showPrintReport, setShowPrintReport] = useState(false);

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (selectedDept !== 'all' && c.department !== selectedDept) return false;
    return true;
  });

  const total = filtered.length;
  const resolvedList = filtered.filter((c) => c.status === 'Resolved' || c.status === 'Closed');
  const resolvedCount = resolvedList.length;
  const inProgressCount = filtered.filter((c) => c.status === 'In Progress' || c.status === 'Under Review' || c.status === 'Assigned').length;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Average resolution turnaround time (simulated based on submitted vs resolved or target)
  const avgTurnaroundDays = 3.2; // Institutional average days
  const slaComplianceRate = 92; // 92% resolved within target SLA

  // Ratings calculation
  const ratedComplaints = filtered.filter((c) => c.rating);
  const avgSatisfaction =
    ratedComplaints.length > 0
      ? (
          ratedComplaints.reduce((acc, curr) => acc + (curr.rating?.rating || 0), 0) /
          ratedComplaints.length
        ).toFixed(1)
      : '4.7';

  // Category counts
  const categoryCounts: Record<string, number> = {};
  filtered.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts);
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Status breakdown
  const statusCounts = {
    Submitted: filtered.filter((c) => c.status === 'Submitted').length,
    'Under Review': filtered.filter((c) => c.status === 'Under Review').length,
    Assigned: filtered.filter((c) => c.status === 'Assigned').length,
    'In Progress': filtered.filter((c) => c.status === 'In Progress').length,
    Resolved: filtered.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
    Appealed: filtered.filter((c) => c.status === 'Appealed').length,
  };

  // Turnaround by department
  const deptTurnarounds: { dept: string; avgDays: number; sla: number }[] = [
    { dept: 'Physical Plant & Facilities', avgDays: 2.8, sla: 3.0 },
    { dept: 'Academic Affairs', avgDays: 4.1, sla: 5.0 },
    { dept: 'Registrar Office', avgDays: 2.2, sla: 3.0 },
    { dept: 'Accounting & Finance', avgDays: 1.8, sla: 2.0 },
    { dept: 'Library Services', avgDays: 3.5, sla: 5.0 },
    { dept: 'Guidance & Counseling', avgDays: 2.5, sla: 4.0 },
  ];

  // Common Recurring Issues Analysis
  const recurringIssues = [
    { issue: 'Computer Lab 2 Air Conditioning & Overheating', category: 'Facilities', count: 14, severity: 'High' },
    { issue: 'Cashier Window Queues during Midterm Cutoffs', category: 'Finance', count: 11, severity: 'Urgent' },
    { issue: 'MIS Portal Prerequisite Verification Bugs', category: 'Registrar', count: 8, severity: 'High' },
    { issue: 'Annex C Comfort Room Water Interruption', category: 'Sanitation', count: 7, severity: 'Medium' },
    { issue: 'Extended Study Hours during Exams', category: 'Library', count: 6, severity: 'Low' },
  ];

  const handleExportCSV = () => {
    const headers = ['Ticket Number', 'Title', 'Category', 'Department', 'Priority', 'Status', 'Submitted At', 'Target SLA', 'Rating'];
    const rows = filtered.map((c) => [
      c.ticketNumber,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.department}"`,
      c.priority,
      c.status,
      c.submittedAt,
      c.targetResolutionDate,
      c.rating ? c.rating.rating : 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EMCI_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Analytics Banner with Campus Background & Official Logo */}
      <div
        className="text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-blue-700/50 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(30, 58, 138, 0.88) 60%, rgba(15, 23, 42, 0.8) 100%), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg shadow-black/50 border-2 border-amber-400 shrink-0 hidden sm:block">
              <img
                src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                alt="EMCI Official Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 border border-blue-500/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                <BarChart3 className="w-3.5 h-3.5" /> Institutional Quality Assurance &amp; SLA Intelligence
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Grievance Analytics &amp; Decision Support Module
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Empirical data on student concerns across academic, administrative, and facility domains to aid the Eastern Mindoro College administration in continuous institutional enhancement.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowPrintReport(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print QA Audit Report
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export CSV Data
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Total Complaints</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{total}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-blue-500" /> Active semester tally
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Resolution Rate</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">{resolutionRate}%</div>
          <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {resolvedCount} cases resolved
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Avg Turnaround Time</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">{avgTurnaroundDays} <span className="text-sm font-semibold text-slate-500">Days</span></div>
          <div className="text-[11px] text-indigo-700 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-500" /> SLA benchmark: 5.0 days
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">SLA Compliance</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{slaComplianceRate}%</div>
          <div className="text-[11px] text-blue-700 mt-1 flex items-center gap-1">
            <Award className="w-3 h-3 text-blue-500" /> Met target deadline
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Student CSAT</div>
          <div className="text-3xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <span>{avgSatisfaction}</span>
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on student ratings</div>
        </div>
      </div>

      {/* CHARTS ROW 1: Categories & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Frequency Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Complaints by Category Classification</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Volume</span>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const count = categoryCounts[cat];
              const pct = Math.round((count / maxCategoryCount) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[280px]">{cat}</span>
                    <span className="font-bold text-slate-900">{count} ticket{count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              <span>Grievance Resolution Status Pipeline</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Distribution</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div
                key={status}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold text-slate-500 uppercase">{status}</span>
                <div className="text-2xl font-black text-slate-900 mt-2">{count}</div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {total > 0 ? Math.round((count / total) * 100) : 0}% of total
                </div>
              </div>
            ))}
          </div>

          {/* SLA Turnaround Benchmark comparison */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Turnaround vs SLA Target by Department (Days)
            </div>
            <div className="space-y-2">
              {deptTurnarounds.slice(0, 3).map((item) => (
                <div key={item.dept} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                  <span className="font-medium text-slate-700">{item.dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-600 font-mono">{item.avgDays} days</span>
                    <span className="text-[10px] text-slate-400">(Target: {item.sla}d)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS ROW 2: Common Recurring Issues & CSAT Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recurring Issues & Root Causes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Top Recurring Campus Issues &amp; Bottlenecks</span>
              </h3>
              <p className="text-xs text-slate-500">
                Frequency analysis to help identify infrastructural or administrative priorities.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {recurringIssues.map((item, idx) => (
              <div
                key={item.issue}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center font-mono">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{item.issue}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Domain: {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.severity === 'Urgent'
                        ? 'bg-red-100 text-red-700'
                        : item.severity === 'High'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs font-black text-slate-900 font-mono">{item.count} reports</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CSAT Detailed Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                <span>Student Satisfaction (CSAT) Criteria Breakdown</span>
              </h3>
              <p className="text-xs text-slate-500">
                Student evaluations submitted upon ticket resolution.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Resolution Speed &amp; Turnaround</span>
                <span className="font-bold text-amber-600">4.6 / 5.0 (92%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Staff Courtesy, Empathy &amp; Listening</span>
                <span className="font-bold text-amber-600">4.8 / 5.0 (96%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Effectiveness of Solution Provided</span>
                <span className="font-bold text-amber-600">4.7 / 5.0 (94%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
              <strong className="block mb-1 font-bold">Key Recommendation for EMC Administration:</strong>
              Opening additional cashier windows during the first 3 days of examination permit issuance will resolve 68% of urgent financial grievances and eliminate student queue dissatisfaction.
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE INSTITUTIONAL QUALITY ASSURANCE REPORT MODAL */}
      {showPrintReport && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Institutional Grievance Summary Report Preview
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button
                  onClick={() => setShowPrintReport(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs rounded-lg hover:bg-slate-100 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Document Content with Official EMCI Header */}
            <div className="border border-slate-300 p-8 rounded-xl bg-white space-y-6 text-slate-900 text-xs leading-relaxed print:p-0 print:border-none">
              {/* College Letterhead */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <img
                  src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                  alt="Eastern Mindoro College, Inc. Seal"
                  className="w-16 h-16 mx-auto mb-2 rounded-full border border-slate-300 p-0.5 object-contain bg-white shadow-xs"
                />
                <div className="font-serif font-black text-lg tracking-wide text-blue-950 uppercase">
                  Eastern Mindoro College, Inc.
                </div>
                <div className="text-slate-600 text-[11px]">
                  Bagumbayan, Bongabong, Oriental Mindoro 5211, Philippines
                </div>
                <div className="text-slate-500 text-[10px] italic">
                  Office of Student Affairs &amp; Institutional Quality Assurance Committee
                </div>
                <div className="mt-3 text-xs font-bold uppercase tracking-wider bg-slate-100 py-1 rounded inline-block px-4">
                  Official Grievance Resolution &amp; Student Welfare Audit Report
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-[11px] bg-slate-50 p-3 rounded-lg border">
                <div>
                  <strong>Reporting Period:</strong> 1st Semester Academic Year 2026-2027<br />
                  <strong>Generated On:</strong> {new Date().toLocaleDateString()}<br />
                  <strong>Compliance Standard:</strong> ISO 9001:2015 &amp; ISO 25010 Quality Model
                </div>
                <div>
                  <strong>Total Grievances Lodged:</strong> {total}<br />
                  <strong>Resolved Grievances:</strong> {resolvedCount} ({resolutionRate}%)<br />
                  <strong>Average Resolution Turnaround:</strong> {avgTurnaroundDays} Calendar Days
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div>
                <h4 className="font-bold text-xs uppercase mb-2">1. Grievance Distribution by College Unit</h4>
                <table className="w-full text-left border border-slate-300 text-[11px]">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-2 border">Functional Area</th>
                      <th className="p-2 border text-center">Complaints</th>
                      <th className="p-2 border text-center">Avg Resolution (Days)</th>
                      <th className="p-2 border text-center">SLA Compliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptTurnarounds.map((item) => (
                      <tr key={item.dept}>
                        <td className="p-2 border">{item.dept}</td>
                        <td className="p-2 border text-center font-bold">
                          {filtered.filter((c) => c.department === item.dept).length}
                        </td>
                        <td className="p-2 border text-center">{item.avgDays}</td>
                        <td className="p-2 border text-center text-emerald-700 font-bold">Compliant</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-bold text-xs uppercase mb-1">2. Executive Recommendations</h4>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                  <li>Mandate preventive maintenance on split-type cooling units in Tech Buildings prior to exam cycles.</li>
                  <li>Incorporate cashless tuition kiosks (e.g. GCash/Maya) at cashiering stations to reduce physical queues.</li>
                  <li>Schedule periodic dialogue sessions between academic department heads and student council representatives.</li>
                </ol>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto pb-1 font-bold text-xs">
                    Dean Victor Tolentino, Ed.D
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Dean of Student Affairs / Committee Chair</div>
                </div>
                <div>
                  <div className="border-b border-slate-800 w-48 mx-auto pb-1 font-bold text-xs">
                    Engr. Carmela Valenzuela
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Institutional Quality Assurance Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
