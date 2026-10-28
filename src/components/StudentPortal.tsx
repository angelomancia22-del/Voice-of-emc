import React, { useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { ComplaintCategory, PriorityLevel, Department, Attachment, Complaint } from '../types';
import { TicketQRCodeModal } from './TicketQRCodeModal';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Eye,
  Lock,
  Paperclip,
  Search,
  BookOpen,
  Sparkles,
  ArrowRight,
  Filter,
  QrCode,
  Smartphone,
  Printer,
  Download,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    currentUser,
    complaints,
    submitComplaint,
    setSelectedTicketId,
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [qrModalTicket, setQrModalTicket] = useState<Complaint | null>(null);
  const [successQrUrl, setSuccessQrUrl] = useState<string>('');
  const [justCreatedTicket, setJustCreatedTicket] = useState<Complaint | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('School Facilities & Equipment');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [department, setDepartment] = useState<Department>('Physical Plant & Facilities');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [locationOrCourse, setLocationOrCourse] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [formSuccessCode, setFormSuccessCode] = useState<string | null>(null);

  // Map category to default department
  const handleCategoryChange = (cat: ComplaintCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'Academic / Grading / Instruction':
      case 'Faculty & Staff Conduct':
        setDepartment('Academic Affairs');
        break;
      case 'School Facilities & Equipment':
        setDepartment('Physical Plant & Facilities');
        break;
      case 'Enrollment & Registrar':
        setDepartment('Registrar Office');
        break;
      case 'Tuition & Financial / Cashier':
        setDepartment('Accounting & Finance');
        break;
      case 'Guidance, Discipline & Bullying':
        setDepartment('Guidance & Counseling');
        break;
      case 'Campus Safety & Sanitation':
        setDepartment('College Security & Sanitation');
        break;
      default:
        setDepartment('Office of Student Affairs (OSA)');
    }
  };

  const handleAddSampleAttachment = () => {
    const sampleFiles = [
      { fileName: 'Incident_Photo_EMC.jpg', fileSize: '1.8 MB', fileType: 'image/jpeg' },
      { fileName: 'LMS_Portal_Screenshot.png', fileSize: '950 KB', fileType: 'image/png' },
      { fileName: 'Official_Receipt_Scan.pdf', fileSize: '2.1 MB', fileType: 'application/pdf' },
    ];
    const pick = sampleFiles[attachments.length % sampleFiles.length];
    setAttachments([
      ...attachments,
      {
        id: `att-${Date.now()}`,
        fileName: pick.fileName,
        fileSize: pick.fileSize,
        fileType: pick.fileType,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const newTicket = await submitComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        department,
        isAnonymous,
        locationOrCourse: locationOrCourse.trim() || 'Eastern Mindoro College Campus',
        attachments,
      });

      setFormSuccessCode(newTicket.ticketNumber);
      setJustCreatedTicket(newTicket);

      // Generate scannable QR Code URL
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const trackingUrl = `${origin}${pathname}?track=${newTicket.ticketNumber}`;

      QRCode.toDataURL(trackingUrl, {
        width: 240,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      })
        .then((url) => setSuccessQrUrl(url))
        .catch((err) => console.error('QR code generation failed:', err));

      // Reset form
      setTitle('');
      setDescription('');
      setLocationOrCourse('');
      setAttachments([]);
      setIsAnonymous(false);
    } catch (err) {
      console.error('Error submitting complaint:', err);
    }
  };

  const [viewScope, setViewScope] = useState<'my' | 'all'>('my');

  // Student's complaints (match either student ID or email, or show all if currently viewing as student)
  const myComplaints = complaints.filter(
    (c) =>
      c.studentId === currentUser.studentId ||
      c.studentEmail === currentUser.email ||
      (!c.isAnonymous && c.studentName === currentUser.name)
  );

  const displayList = viewScope === 'my' ? myComplaints : complaints;

  const filteredComplaints = displayList.filter((c) => {
    const matchesFilter = filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const resolvedCount = myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const inProgressCount = myComplaints.filter((c) => c.status === 'In Progress' || c.status === 'Under Review' || c.status === 'Assigned').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Welcome with Campus Background & Official Logo */}
      <div
        className="rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-blue-700/50 text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(30, 58, 138, 0.85) 60%, rgba(15, 23, 42, 0.78) 100%), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-lg shadow-black/50 border-2 border-amber-400 shrink-0">
              <img
                src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
                alt="Eastern Mindoro College, Inc. Seal"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                <Shield className="w-3 h-3" /> Eastern Mindoro College Student Voice Portal
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Bongabong, Oriental Mindoro • Established 1945
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed drop-shadow-xs">
            Report academic concerns, facility issues, cashier queues, or student welfare complaints directly to college administrators. Your concerns are tracked with guaranteed Service Level Agreements (SLAs).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setIsSubmitting(true);
                setFormSuccessCode(null);
              }}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Submit New Concern / Complaint
            </button>
            <button
              onClick={() => setIsSubmitting(false)}
              className="px-5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> View My Filed Tickets ({myComplaints.length})
            </button>
          </div>
        </div>

        {/* Quick KPI badges on banner */}
        <div className="mt-6 sm:mt-0 sm:absolute right-6 top-6 bottom-6 flex sm:flex-col justify-center gap-3">
          <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-3 rounded-xl min-w-[130px] text-center">
            <div className="text-2xl font-black text-amber-400">{myComplaints.length}</div>
            <div className="text-[11px] text-slate-300">Total Filed</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-3 rounded-xl min-w-[130px] text-center">
            <div className="text-2xl font-black text-blue-400">{inProgressCount}</div>
            <div className="text-[11px] text-slate-300">Active / In Progress</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-xs border border-slate-700/60 p-3 rounded-xl min-w-[130px] text-center">
            <div className="text-2xl font-black text-emerald-400">{resolvedCount}</div>
            <div className="text-[11px] text-slate-300">Resolved Grievances</div>
          </div>
        </div>
      </div>

      {/* FORM MODAL / DRAWER IF SUBMITTING */}
      {isSubmitting && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                <span>Formal Concern &amp; Complaint Submission Form</span>
              </h3>
              <p className="text-xs text-slate-500">
                Official grievance filing under EMCI Student Code &amp; ISO 9001:2015 institutional quality process.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitting(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>

          {formSuccessCode ? (
            <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-6 sm:p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-emerald-950">
                  Complaint Lodged Successfully!
                </h4>
                <p className="text-xs text-emerald-800 max-w-md mx-auto mt-1">
                  Your ticket has been logged into the EMCI central database with SLA monitoring. Automated alerts have been dispatched to the Office of Student Affairs.
                </p>
              </div>

              {/* QR Code Pass Card */}
              <div className="bg-white border-2 border-emerald-300/80 p-5 rounded-2xl max-w-md mx-auto shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Official Mobile Tracking QR Pass
                  </span>
                  <span className="font-mono text-sm font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    {formSuccessCode}
                  </span>
                </div>

                {/* QR Code Canvas/Image */}
                <div className="flex flex-col items-center justify-center pt-1">
                  {successQrUrl ? (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-900 shadow-sm">
                      <img
                        src={successQrUrl}
                        alt={`QR Code for ${formSuccessCode}`}
                        className="w-44 h-44 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-100 rounded-xl text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-amber-600" />
                    <span>Scan with any smartphone camera to pull up live docket</span>
                  </div>
                </div>

                {/* Action Buttons for QR */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2">
                  {justCreatedTicket && (
                    <button
                      type="button"
                      onClick={() => setQrModalTicket(justCreatedTicket)}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Mobile QR Slip</span>
                    </button>
                  )}
                  {successQrUrl && (
                    <a
                      href={successQrUrl}
                      download={`EMCI_QR_${formSuccessCode}.png`}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save QR Image</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => setIsSubmitting(false)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  View My Filed Tickets
                </button>
                <button
                  onClick={() => {
                    setFormSuccessCode(null);
                    setSuccessQrUrl('');
                    setJustCreatedTicket(null);
                    setTitle('');
                    setDescription('');
                  }}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-white font-semibold text-xs rounded-xl transition-colors"
                >
                  Submit Another Concern
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Concern Classification / Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="School Facilities & Equipment">School Facilities &amp; Equipment (Aircon, Lab, Restroom)</option>
                    <option value="Academic / Grading / Instruction">Academic / Grading / Instruction / Syllabus</option>
                    <option value="Student Services & Welfare">Student Services &amp; Welfare (Library, Health, Canteen)</option>
                    <option value="Enrollment & Registrar">Enrollment, Grades, Transcript &amp; Registrar</option>
                    <option value="Tuition & Financial / Cashier">Tuition, Assessment &amp; Cashier Windows</option>
                    <option value="Faculty & Staff Conduct">Faculty &amp; Staff Conduct / Consultation</option>
                    <option value="Guidance, Discipline & Bullying">Guidance, Discipline &amp; Anti-Bullying</option>
                    <option value="Campus Safety & Sanitation">Campus Safety, Security &amp; Sanitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Routed Department (Auto-Assigned)
                  </label>
                  <div className="w-full text-xs p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-semibold flex items-center justify-between">
                    <span>{department}</span>
                    <span className="text-[10px] text-slate-400 font-mono">EMCI Office</span>
                  </div>
                </div>
              </div>

              {/* Title & Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    2. Specific Subject / Summary <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Defective projector in Room 304 during IT lecture"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Specific Room, Building, or Course
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ComLab 2 / Admin Cashier"
                    value={locationOrCourse}
                    onChange={(e) => setLocationOrCourse(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Priority & Anonymity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    3. Priority Level (Institutional SLA)
                  </label>
                  <div className="flex gap-2">
                    {(['Low', 'Medium', 'High', 'Urgent'] as PriorityLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setPriority(lvl)}
                        className={`flex-1 py-1.5 text-xs rounded-lg font-semibold border transition-all ${
                          priority === lvl
                            ? lvl === 'Urgent'
                              ? 'bg-red-600 text-white border-red-600 shadow-sm'
                              : lvl === 'High'
                              ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                              : 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {priority === 'Urgent'
                      ? 'Target SLA: 48 Hours turnaround for emergency or exam issues'
                      : priority === 'High'
                      ? 'Target SLA: 72 Hours turnaround for facility/lab impediments'
                      : 'Standard turnaround: 5-7 business days'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    4. Student Privacy &amp; Anonymity Options
                  </label>
                  <label className="flex items-start gap-2.5 p-2 bg-white rounded-lg border border-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Submit Anonymously (Identity Protected)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Your name and student number will be masked in reports. Only Dean of Student Affairs can access verification logs under strict confidentiality.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  5. Detailed Description of Concern <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Clearly explain the background, what occurred, who was involved (if applicable), and what remediation or assistance you are requesting..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Evidence Attachments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5" /> 6. Supporting Documents / Photo Proof
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSampleAttachment}
                    className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                  >
                    + Attach Evidence Proof
                  </button>
                </div>

                {attachments.length === 0 ? (
                  <div
                    onClick={handleAddSampleAttachment}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-amber-400 transition-colors"
                  >
                    <p className="text-xs text-slate-500">
                      Click to upload photos, PDF receipts, or screenshot evidence (Optional)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs flex items-center gap-2"
                      >
                        <span className="font-medium text-slate-800">{att.fileName}</span>
                        <span className="text-[10px] text-slate-400">{att.fileSize}</span>
                        <button
                          type="button"
                          onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                          className="text-slate-400 hover:text-red-600 font-bold ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitting(false)}
                  className="px-5 py-2.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <span>Submit to Grievance Committee</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* FILTER & TICKET LIST VIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Student Grievance Docket</span>
            </h3>
            <p className="text-xs text-slate-500">
              Track real-time progress, read staff investigation notes, and evaluate resolution quality.
            </p>
            <div className="flex items-center gap-1.5 mt-2.5">
              <button
                type="button"
                onClick={() => setViewScope('my')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  viewScope === 'my'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                My Filed Concerns ({myComplaints.length})
              </button>
              <button
                type="button"
                onClick={() => setViewScope('all')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                  viewScope === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Campus Concerns ({complaints.length})
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search ticket title or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-lg bg-white text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Appealed">Appealed</option>
            </select>
          </div>
        </div>

        {/* Tickets Grid / List */}
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center text-slate-400 border border-dashed rounded-xl">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700">No grievance tickets found</p>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'You have not submitted any concerns yet. Click "Submit New Concern" to begin.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredComplaints.map((ticket) => {
              const targetDate = new Date(ticket.targetResolutionDate);
              const now = new Date();
              const isOverdue =
                now > targetDate && ticket.status !== 'Resolved' && ticket.status !== 'Closed';

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200 hover:border-amber-400/80 hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
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
                      <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        {ticket.category}
                      </span>
                      {ticket.isAnonymous && (
                        <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1 border border-purple-200 font-medium">
                          <Lock className="w-2.5 h-2.5" /> Anonymous
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {ticket.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span>Submitted: {new Date(ticket.submittedAt).toLocaleDateString()}</span>
                      <span>Department: <strong className="text-slate-600">{ticket.department}</strong></span>
                      <span>Assignee: <strong className="text-slate-600">{ticket.assignedToName || 'Under Triage'}</strong></span>
                    </div>
                  </div>

                  {/* Right Action / SLA state */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                    <div
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                        isOverdue
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : ticket.status === 'Resolved' || ticket.status === 'Closed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {ticket.status === 'Resolved' || ticket.status === 'Closed'
                        ? 'Resolution Complete'
                        : isOverdue
                        ? 'SLA Overdue'
                        : `SLA: Due ${targetDate.toLocaleDateString()}`}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQrModalTicket(ticket);
                        }}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                        title="Print or scan mobile QR tracking pass"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-700" />
                        <span>QR Pass</span>
                      </button>

                      <button
                        type="button"
                        className="text-xs font-bold text-slate-800 group-hover:text-amber-600 flex items-center gap-1 px-1.5 py-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Printable Mobile QR Pass Modal */}
      {qrModalTicket && (
        <TicketQRCodeModal
          ticket={qrModalTicket}
          onClose={() => setQrModalTicket(null)}
        />
      )}
    </div>
  );
};
