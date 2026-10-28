import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  BookOpen,
  Building2,
  ShieldCheck,
  BarChart3,
  SearchCode,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  onToggleNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleNotifications }) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeTab,
    setActiveTab,
    unreadNotifCount,
    searchQuery,
    setSearchQuery,
    getComplaintByTicketNumber,
    setSelectedTicketId,
    resetToDefaults,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) return;
    const ticket = getComplaintByTicketNumber(quickSearchInput.trim());
    if (ticket) {
      setSelectedTicketId(ticket.id);
      setSearchFeedback(null);
      setQuickSearchInput('');
    } else {
      setSearchFeedback(`Ticket "${quickSearchInput.trim().toUpperCase()}" not found.`);
      setTimeout(() => setSearchFeedback(null), 3500);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'faculty':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      {/* Topmost Institutional Strip */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 px-4 py-1.5 border-b border-blue-900/50 text-xs flex flex-wrap items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 tracking-wide uppercase">Eastern Mindoro College, Inc.</span>
          <span className="text-slate-500">•</span>
          <span className="hidden sm:inline">Bagumbayan, Bongabong, Oriental Mindoro, Philippines</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 text-[11px] hidden md:inline">CHED Recognized Higher Education Institution</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset system data to initial Eastern Mindoro College demonstration state?')) {
                resetToDefaults();
              }
            }}
            title="Reset demonstration data"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo DB</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-amber-300 font-mono font-medium">EMC-VOICE v2.4</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & College Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('student')}>
            <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-lg shadow-black/40 border-2 border-amber-400 flex items-center justify-center shrink-0 overflow-hidden hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                alt="Eastern Mindoro College, Inc. Official Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-1.5">
                  <span>Student Concern &amp; Complaint System</span>
                </h1>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                  ISO 25010
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Eastern Mindoro College, Inc. — Grievance Redressal &amp; Quality Assurance
              </p>
            </div>
          </div>

          {/* Quick Ticket Lookup Search Form */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full">
            <form onSubmit={handleQuickLookup} className="w-full relative">
              <input
                type="text"
                placeholder="Track code e.g. EMC-2026-0101"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg pl-9 pr-14 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition-colors"
              >
                Find
              </button>
            </form>
            {searchFeedback && (
              <div className="absolute -bottom-8 left-0 text-[11px] text-red-400 bg-red-950/90 border border-red-800 px-2 py-0.5 rounded shadow">
                {searchFeedback}
              </div>
            )}
          </div>

          {/* User Role Switcher & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="View automated notifications & email alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Quick RBAC Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors text-left"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400/50"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                    <span>{currentUser.name}</span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold border ${getRoleBadgeColor(
                        currentUser.role
                      )}`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                    {currentUser.programOrDesignation || currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3.5 py-2">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Role-Based Access Control (RBAC) Switcher
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Instantly test distinct permissions for Students, Faculty, and Admins.
                    </p>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-blue-400 uppercase">Students</div>
                    {allUsers
                      .filter((u) => u.role === 'student')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => switchUser(u.id)}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            u.id === currentUser.id ? 'bg-blue-950/60 border-l-2 border-amber-400' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.programOrDesignation}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{u.studentId}</span>
                        </button>
                      ))}
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase">
                      Faculty &amp; Department Heads
                    </div>
                    {allUsers
                      .filter((u) => u.role === 'faculty')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => switchUser(u.id)}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            u.id === currentUser.id ? 'bg-emerald-950/60 border-l-2 border-emerald-400' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.department}</p>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400">Staff</span>
                        </button>
                      ))}
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-purple-400 uppercase">
                      Administrators &amp; Grievance Committee
                    </div>
                    {allUsers
                      .filter((u) => u.role === 'admin')
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => switchUser(u.id)}
                          className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-slate-800 transition-colors ${
                            u.id === currentUser.id ? 'bg-purple-950/60 border-l-2 border-purple-400' : ''
                          }`}
                        >
                          <div>
                            <p className="text-xs font-semibold text-slate-200">{u.name}</p>
                            <p className="text-[11px] text-slate-400">{u.programOrDesignation}</p>
                          </div>
                          <span className="text-[10px] font-mono text-purple-400 font-bold">Admin</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="mt-3.5 pt-2 border-t border-slate-800 flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'student'
                  ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              onClick={() => setActiveTab('faculty')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'faculty'
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Faculty / Dept Inbox</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin &amp; Oversight</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics &amp; Reports</span>
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'track'
                  ? 'bg-slate-700 text-amber-300 border border-amber-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <SearchCode className="w-4 h-4" />
              <span>Track Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('thesis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === 'thesis'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Thesis &amp; ISO 25010</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
