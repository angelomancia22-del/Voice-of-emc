import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, PriorityLevel, Department, UserRole } from '../types';
import {
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Shield,
  Send,
  Lock,
  Printer,
  Star,
  FileText,
  Paperclip,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  QrCode,
} from 'lucide-react';
import { TicketQRCodeModal } from './TicketQRCodeModal';

interface ComplaintDetailModalProps {
  complaintId: string;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({ complaintId, onClose }) => {
  const {
    complaints,
    currentUser,
    allUsers,
    updateComplaintStatus,
    assignComplaint,
    addComment,
    submitStudentRating,
    submitAppeal,
  } = useApp();

  const complaint = complaints.find((c) => c.id === complaintId);

  // Comment state
  const [newComment, setNewComment] = useState('');
  const [isInternalOnly, setIsInternalOnly] = useState(false);

  // Admin / Faculty action states
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint?.status || 'Submitted');
  const [statusNote, setStatusNote] = useState('');
  const [actionTakenText, setActionTakenText] = useState(complaint?.actionTaken || '');
  const [resolutionRemarksText, setResolutionRemarksText] = useState(complaint?.resolutionRemarks || '');
  const [assigneeId, setAssigneeId] = useState(complaint?.assignedToId || '');
  const [assigneeDept, setAssigneeDept] = useState<Department>(complaint?.department || 'Academic Affairs');

  // Rating state (for student when resolved)
  const [ratingStars, setRatingStars] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [speedRating, setSpeedRating] = useState(5);
  const [courtesyRating, setCourtesyRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);

  // Appeal state
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealReason, setAppealReason] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  if (!complaint) return null;

  const isStudent = currentUser.role === 'student';
  const isFaculty = currentUser.role === 'faculty';
  const isAdmin = currentUser.role === 'admin';

  // Calculate SLA status
  const targetDate = new Date(complaint.targetResolutionDate);
  const now = new Date();
  const isOverdue = now > targetDate && complaint.status !== 'Resolved' && complaint.status !== 'Closed';
  const daysLeft = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(complaint.id, newComment.trim(), isInternalOnly && !isStudent);
    setNewComment('');
    setIsInternalOnly(false);
  };

  const handleUpdateStatusSubmit = () => {
    updateComplaintStatus(
      complaint.id,
      selectedStatus,
      statusNote,
      actionTakenText,
      resolutionRemarksText
    );
    setStatusNote('');
  };

  const handleAssignSubmit = () => {
    if (assigneeId) {
      assignComplaint(complaint.id, assigneeId, assigneeDept);
    }
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitStudentRating(complaint.id, ratingStars, feedbackText, {
      resolutionSpeed: speedRating,
      staffCourtesy: courtesyRating,
      solutionQuality: qualityRating,
    });
  };

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    submitAppeal(complaint.id, appealReason.trim());
    setShowAppealForm(false);
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500/10 text-red-600 border-red-300 font-bold';
      case 'High':
        return 'bg-amber-500/10 text-amber-700 border-amber-300 font-semibold';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-700 border-blue-300';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-300';
    }
  };

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Closed':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Assigned':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Appealed':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const statusSteps: ComplaintStatus[] = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];
  const currentStepIndex = statusSteps.indexOf(
    complaint.status === 'Closed' ? 'Resolved' : complaint.status === 'Appealed' ? 'Under Review' : complaint.status
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
              alt="EMCI Seal"
              className="w-7 h-7 rounded-full bg-white p-0.5 object-contain border border-amber-400 shrink-0 shadow-xs"
            />
            <span className="font-mono text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
              {complaint.ticketNumber}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusBadge(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityBadge(complaint.priority)}`}>
              {complaint.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="p-1.5 text-amber-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 px-2 text-xs font-semibold"
              title="Print or view Mobile QR Pass"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile QR</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print Incident Resolution Slip"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Core Meta */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{complaint.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Department: <strong className="text-slate-700">{complaint.department}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Submitted: {new Date(complaint.submittedAt).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Assignee: <strong className="text-slate-700">{complaint.assignedToName || 'Unassigned'}</strong>
              </span>
            </div>
          </div>

          {/* SLA Indicator Banner */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              isOverdue
                ? 'bg-red-50 border-red-200 text-red-800'
                : complaint.status === 'Resolved' || complaint.status === 'Closed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : daysLeft <= 1
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" />
              <div>
                <span className="font-semibold">Institutional SLA Target: </span>
                {new Date(complaint.targetResolutionDate).toLocaleDateString()} (
                {complaint.status === 'Resolved' || complaint.status === 'Closed'
                  ? 'Resolved within SLA target'
                  : isOverdue
                  ? `Overdue by ${Math.abs(daysLeft)} days`
                  : `${daysLeft} days remaining`}
                )
              </div>
            </div>
            {complaint.isAnonymous && (
              <span className="flex items-center gap-1 font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                <Lock className="w-3 h-3" /> Anonymous Submission
              </span>
            )}
          </div>

          {/* Progress Timeline Stepper */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Resolution Progress Milestones
            </h4>
            <div className="grid grid-cols-5 gap-2 text-center">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium ${
                        isCurrent ? 'text-amber-700 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student & Complaint Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Concern Description
                </h4>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line shadow-xs">
                  {complaint.description}
                </div>
              </div>

              {complaint.actionTaken && (
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900">
                  <h5 className="font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Action Taken by Personnel
                  </h5>
                  <p>{complaint.actionTaken}</p>
                  {complaint.resolutionRemarks && (
                    <p className="mt-2 text-slate-600">
                      <strong>Remarks: </strong> {complaint.resolutionRemarks}
                    </p>
                  )}
                </div>
              )}

              {/* Attachments */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Paperclip className="w-3.5 h-3.5" /> Evidence &amp; Attached Files ({complaint.attachments.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {complaint.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg text-xs text-slate-700 font-medium transition-colors"
                      >
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>{att.fileName}</span>
                        <span className="text-[10px] text-slate-400">({att.fileSize})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Meta Info */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Student Identity</div>
                <div className="font-semibold text-slate-800">
                  {complaint.isAnonymous && isStudent && currentUser.studentId !== complaint.studentId
                    ? 'Protected Student'
                    : complaint.studentName}
                </div>
                {!complaint.isAnonymous && (
                  <div className="text-slate-500 text-[11px]">{complaint.program}</div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Specific Location / Course</div>
                <div className="text-slate-700 font-medium">{complaint.locationOrCourse || 'General Campus'}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Category Tag</div>
                <div className="inline-block bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium mt-0.5">
                  {complaint.category}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-slate-400">Assigned Department</div>
                <div className="font-semibold text-slate-800">{complaint.department}</div>
              </div>

              {complaint.rating && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Student Satisfaction Rating</div>
                  <div className="flex items-center gap-1 mt-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= complaint.rating!.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                    <span className="text-xs font-bold text-slate-800 ml-1">{complaint.rating.rating}/5</span>
                  </div>
                  {complaint.rating.feedback && (
                    <p className="text-[11px] text-slate-600 italic mt-1 bg-white p-2 rounded border border-slate-200">
                      "{complaint.rating.feedback}"
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Student Resolution Satisfaction Rating Widget (If Resolved & Not Yet Rated & viewed by student) */}
          {isStudent && (complaint.status === 'Resolved' || complaint.status === 'Closed') && !complaint.rating && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold">
                <Star className="w-5 h-5 text-amber-600 fill-amber-400" />
                <span>Rate Your Satisfaction with this Resolution</span>
              </div>
              <p className="text-xs text-amber-800 mb-4">
                Eastern Mindoro College values student voice and continuous institutional improvement under ISO 25010 quality standards. How was your experience?
              </p>

              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Satisfaction:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setRatingStars(s)}
                        className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                      >
                        <Star className={`w-6 h-6 ${s <= ratingStars ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {ratingStars === 5
                        ? 'Very Satisfied'
                        : ratingStars === 4
                        ? 'Satisfied'
                        : ratingStars === 3
                        ? 'Neutral'
                        : ratingStars === 2
                        ? 'Dissatisfied'
                        : 'Very Dissatisfied'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block">Resolution Speed (1-5)</label>
                    <select
                      value={speedRating}
                      onChange={(e) => setSpeedRating(Number(e.target.value))}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Fair</option>
                      <option value="2">2 - Slow</option>
                      <option value="1">1 - Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Staff Courtesy &amp; Care</label>
                    <select
                      value={courtesyRating}
                      onChange={(e) => setCourtesyRating(Number(e.target.value))}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="5">5 - Highly Respectful</option>
                      <option value="4">4 - Respectful</option>
                      <option value="3">3 - Neutral</option>
                      <option value="2">2 - Needs Improvement</option>
                      <option value="1">1 - Unsatisfactory</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block">Solution Quality</label>
                    <select
                      value={qualityRating}
                      onChange={(e) => setQualityRating(Number(e.target.value))}
                      className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                    >
                      <option value="5">5 - Completely Fixed</option>
                      <option value="4">4 - Substantially Fixed</option>
                      <option value="3">3 - Partially Fixed</option>
                      <option value="2">2 - Temporary Fix</option>
                      <option value="1">1 - Not Fixed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Provide any comments or suggestions regarding the action taken..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Submit Official CSAT Feedback
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAppealForm(!showAppealForm)}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Not satisfied with the resolution? File an Appeal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Student Appeal Form */}
          {showAppealForm && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4">
              <h5 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-1">
                Lodge Grievance Appeal to Dean / OSA Committee
              </h5>
              <p className="text-xs text-red-700 mb-3">
                If the action taken was ineffective or the problem persists, describe the grounds for your appeal:
              </p>
              <form onSubmit={handleAppealSubmit} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why the resolution was insufficient..."
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  className="w-full text-xs p-2.5 border border-red-300 rounded-lg bg-white"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg"
                  >
                    Submit Grievance Appeal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppealForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ROLE-SPECIFIC ADMINISTRATIVE / FACULTY ACTIONS */}
          {(isAdmin || isFaculty) && (
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold tracking-tight">
                    {isAdmin ? 'Administrative & Grievance Committee Controls' : 'Faculty / Department Resolution Controls'}
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Role: {currentUser.role.toUpperCase()}
                </span>
              </div>

              {/* Status & Resolution Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Transition Ticket Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 font-medium"
                  >
                    <option value="Submitted">Submitted (New)</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned to Personnel</option>
                    <option value="In Progress">In Progress / Investigation</option>
                    <option value="Resolved">Resolved (Action Finalized)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Status Transition Note</label>
                  <input
                    type="text"
                    placeholder="Brief public note for timeline (e.g. Parts arrived)"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              {/* Action Taken & Remarks */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Action Taken (Official Institutional Remediation)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detail the concrete steps completed (e.g., HVAC team installed replacement fan, instructor revised quiz ledger, etc.)"
                  value={actionTakenText}
                  onChange={(e) => setActionTakenText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleUpdateStatusSubmit}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Status &amp; Action Taken
                </button>
              </div>

              {/* ADMIN-ONLY ROUTING & ASSIGNMENT */}
              {isAdmin && (
                <div className="pt-4 border-t border-slate-800">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Triage &amp; Assign to Department Staff
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Target Department</label>
                      <select
                        value={assigneeDept}
                        onChange={(e) => setAssigneeDept(e.target.value as Department)}
                        className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        <option value="Academic Affairs">Academic Affairs</option>
                        <option value="Physical Plant & Facilities">Physical Plant & Facilities</option>
                        <option value="Office of Student Affairs (OSA)">Office of Student Affairs (OSA)</option>
                        <option value="Registrar Office">Registrar Office</option>
                        <option value="Accounting & Finance">Accounting & Finance</option>
                        <option value="Guidance & Counseling">Guidance & Counseling</option>
                        <option value="Library Services">Library Services</option>
                        <option value="College Security & Sanitation">College Security & Sanitation</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Designated Faculty / Staff</label>
                      <select
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        <option value="">Select Personnel...</option>
                        {allUsers
                          .filter((u) => u.role === 'faculty' || u.role === 'admin')
                          .map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.department || f.role})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAssignSubmit}
                    className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> Confirm Assignment &amp; Send Automated Alert
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Discussion & Audit Trail Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Communication Thread &amp; Audit Log</span>
              <span className="text-[11px] font-normal text-slate-400">
                {(complaint.comments || []).length} message{(complaint.comments || []).length !== 1 ? 's' : ''}
              </span>
            </h4>

            {/* Comment List */}
            <div className="space-y-3">
              {(complaint.comments || []).map((comm) => {
                // Hide internal remarks from students
                if (comm.isInternalOnly && isStudent) return null;

                return (
                  <div
                    key={comm.id}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                      comm.isInternalOnly
                        ? 'bg-amber-50/90 border-amber-300 text-amber-950 ring-1 ring-amber-200'
                        : comm.authorRole === 'student'
                        ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comm.authorName}</span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-mono font-bold ${
                            comm.authorRole === 'admin'
                              ? 'bg-purple-100 text-purple-700'
                              : comm.authorRole === 'faculty'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {comm.authorRole}
                        </span>
                        {comm.isInternalOnly && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-200/80 px-1.5 py-0.2 rounded">
                            <Lock className="w-2.5 h-2.5" /> Staff Internal Note
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(comm.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-line">{comm.content}</p>
                  </div>
                );
              })}
            </div>

            {/* New Comment Input */}
            <form onSubmit={handlePostComment} className="pt-2">
              <div className="relative">
                <textarea
                  rows={2}
                  required
                  placeholder={
                    isStudent
                      ? 'Ask a question or provide follow-up information...'
                      : 'Post response to student or internal remark...'
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white shadow-xs"
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                {!isStudent ? (
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternalOnly}
                      onChange={(e) => setIsInternalOnly(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      <Lock className="w-3 h-3 text-amber-600" /> Internal Investigation Note (Hidden from student)
                    </span>
                  </label>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Your reply will immediately notify the assigned school department.
                  </div>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Post Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Eastern Mindoro College Grievance Resolution Protocol • ISO 9001:2015 Compliant</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Printable Mobile QR Pass Modal */}
      {showQrModal && (
        <TicketQRCodeModal
          ticket={complaint}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
};
