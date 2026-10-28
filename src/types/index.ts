export type UserRole = 'student' | 'faculty' | 'admin';

export type Department =
  | 'Academic Affairs'
  | 'Office of Student Affairs (OSA)'
  | 'Physical Plant & Facilities'
  | 'Registrar Office'
  | 'Accounting & Finance'
  | 'Guidance & Counseling'
  | 'Library Services'
  | 'College Security & Sanitation';

export type ComplaintCategory =
  | 'Academic / Grading / Instruction'
  | 'School Facilities & Equipment'
  | 'Student Services & Welfare'
  | 'Enrollment & Registrar'
  | 'Tuition & Financial / Cashier'
  | 'Faculty & Staff Conduct'
  | 'Guidance, Discipline & Bullying'
  | 'Campus Safety & Sanitation';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Appealed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  programOrDesignation?: string;
  department?: Department;
  avatar?: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  url?: string;
}

export interface ComplaintComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
  isInternalOnly: boolean; // only visible to faculty & admin
}

export interface StatusHistoryStep {
  status: ComplaintStatus;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface StudentSatisfactionRating {
  rating: number; // 1 to 5 stars
  feedback: string;
  submittedAt: string;
  criteriaRatings: {
    resolutionSpeed: number;
    staffCourtesy: number;
    solutionQuality: number;
  };
}

export interface Complaint {
  id: string;
  ticketNumber: string; // e.g., EMC-2026-0104
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  status: ComplaintStatus;
  department: Department;
  assignedToName?: string;
  assignedToId?: string;
  isAnonymous: boolean;
  studentId: string;
  studentName: string;
  studentEmail: string;
  program: string;
  yearLevel: string;
  locationOrCourse?: string; // e.g. "Science Lab 204" or "IT 301 Data Structures"
  submittedAt: string;
  updatedAt: string;
  targetResolutionDate: string; // SLA date
  resolvedAt?: string;
  resolutionRemarks?: string;
  actionTaken?: string;
  attachments: Attachment[];
  comments: ComplaintComment[];
  statusHistory: StatusHistoryStep[];
  rating?: StudentSatisfactionRating;
  appealReason?: string;
  tags: string[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status_change' | 'ticket_assigned' | 'comment_added' | 'sla_warning' | 'ticket_submitted' | 'rating_received';
  ticketId: string;
  ticketNumber: string;
  isRead: boolean;
  createdAt: string;
  emailSimulated?: {
    to: string;
    subject: string;
    snippet: string;
  };
}

export interface AuditLogEntry {
  id: string;
  ticketId: string;
  ticketNumber: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  timestamp: string;
  details: string;
}

export interface ISOEvaluationMetric {
  id: string;
  category: 'Functionality' | 'Usability' | 'Reliability' | 'Security';
  question: string;
  score: number; // 1 to 5 Likert scale
}

export interface SystemFeedbackEntry {
  id: string;
  evaluatorName: string;
  evaluatorRole: 'Student' | 'Faculty / Dept Head' | 'Administrator' | 'IT / IS Expert';
  evaluatorOrganization: string;
  submittedAt: string;
  scores: Record<string, number>;
  qualitativeComments: string;
}
