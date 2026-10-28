import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Complaint,
  ComplaintStatus,
  PriorityLevel,
  Department,
  ComplaintCategory,
  AppNotification,
  AuditLogEntry,
  SystemFeedbackEntry,
  StudentSatisfactionRating,
  Attachment,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_ISO_EVALUATIONS,
} from '../data/mockData';

interface SubmitComplaintDTO {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  department: Department;
  isAnonymous: boolean;
  locationOrCourse?: string;
  attachments?: Attachment[];
  tags?: string[];
}

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  complaints: Complaint[];
  notifications: AppNotification[];
  unreadNotifCount: number;
  auditLogs: AuditLogEntry[];
  isoEvaluations: SystemFeedbackEntry[];
  activeTab: 'student' | 'faculty' | 'admin' | 'analytics' | 'thesis' | 'track';
  setActiveTab: (tab: 'student' | 'faculty' | 'admin' | 'analytics' | 'thesis' | 'track') => void;
  selectedTicketId: string | null;
  setSelectedTicketId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Actions
  submitComplaint: (data: SubmitComplaintDTO) => Promise<Complaint>;
  updateComplaintStatus: (
    ticketId: string,
    newStatus: ComplaintStatus,
    note?: string,
    actionTaken?: string,
    resolutionRemarks?: string
  ) => void;
  assignComplaint: (ticketId: string, facultyId: string, department: Department) => void;
  addComment: (ticketId: string, content: string, isInternalOnly: boolean) => void;
  submitStudentRating: (
    ticketId: string,
    rating: number,
    feedback: string,
    criteriaRatings: { resolutionSpeed: number; staffCourtesy: number; solutionQuality: number }
  ) => void;
  submitAppeal: (ticketId: string, reason: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addISOEvaluation: (entry: Omit<SystemFeedbackEntry, 'id' | 'submittedAt'>) => void;
  resetToDefaults: () => void;
  getComplaintByTicketNumber: (num: string) => Complaint | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  COMPLAINTS: 'emci_complaints_v2',
  NOTIFICATIONS: 'emci_notifications_v2',
  AUDIT_LOGS: 'emci_audit_logs_v2',
  ISO_EVAL: 'emci_iso_evaluations_v2',
  CURRENT_USER_ID: 'emci_active_user_id_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || INITIAL_USERS[0].id;
  });

  const currentUser = allUsers.find((u) => u.id === currentUserId) || INITIAL_USERS[0];

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [isoEvaluations, setIsoEvaluations] = useState<SystemFeedbackEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISO_EVAL);
      return saved ? JSON.parse(saved) : INITIAL_ISO_EVALUATIONS;
    } catch {
      return INITIAL_ISO_EVALUATIONS;
    }
  });

  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'admin' | 'analytics' | 'thesis' | 'track'>('student');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISO_EVAL, JSON.stringify(isoEvaluations));
  }, [isoEvaluations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  // Adjust active tab when switching roles if needed
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    const targetUser = allUsers.find((u) => u.id === userId);
    if (targetUser) {
      if (targetUser.role === 'student' && activeTab !== 'student' && activeTab !== 'thesis' && activeTab !== 'track') {
        setActiveTab('student');
      } else if (targetUser.role === 'faculty' && activeTab !== 'faculty' && activeTab !== 'thesis') {
        setActiveTab('faculty');
      } else if (targetUser.role === 'admin' && activeTab !== 'admin' && activeTab !== 'analytics' && activeTab !== 'thesis') {
        setActiveTab('admin');
      }
    }
  };

  const createNotification = (
    userId: string,
    title: string,
    message: string,
    type: AppNotification['type'],
    ticketId: string,
    ticketNumber: string,
    emailSnippet?: { to: string; subject: string; snippet: string }
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      type,
      ticketId,
      ticketNumber,
      isRead: false,
      createdAt: new Date().toISOString(),
      emailSimulated: emailSnippet,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addAuditLog = (ticketId: string, ticketNumber: string, action: string, details: string) => {
    const log: AuditLogEntry = {
      id: `log-${Date.now()}`,
      ticketId,
      ticketNumber,
      action,
      performedBy: currentUser.name,
      performedByRole: currentUser.role,
      timestamp: new Date().toISOString(),
      details,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const submitComplaint = async (data: SubmitComplaintDTO): Promise<Complaint> => {
    // Generate next ticket number
    const year = new Date().getFullYear();
    const count = complaints.length + 101;
    const ticketNumber = `EMC-${year}-${count.toString().padStart(4, '0')}`;
    
    // SLA target: Urgent = 2 days, High = 3 days, Medium = 5 days, Low = 7 days
    const slaDays = data.priority === 'Urgent' ? 2 : data.priority === 'High' ? 3 : data.priority === 'Medium' ? 5 : 7;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + slaDays);

    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      ticketNumber,
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      status: 'Submitted',
      department: data.department,
      isAnonymous: data.isAnonymous,
      studentId: currentUser.studentId || '2023-01458',
      studentName: data.isAnonymous ? 'Anonymous Student (Identity Protected)' : currentUser.name,
      studentEmail: data.isAnonymous ? 'confidential@emc.edu.ph' : currentUser.email,
      program: currentUser.programOrDesignation || 'Student',
      yearLevel: 'Active Student',
      locationOrCourse: data.locationOrCourse || 'EMCI Main Campus',
      submittedAt: now,
      updatedAt: now,
      targetResolutionDate: targetDate.toISOString(),
      attachments: data.attachments || [],
      comments: [
        {
          id: `comm-${Date.now()}`,
          authorId: currentUser.id,
          authorName: data.isAnonymous ? 'Student (Anonymous)' : currentUser.name,
          authorRole: 'student',
          content: 'Concern submitted through the EMCI Online Concern & Complaint Portal.',
          createdAt: now,
          isInternalOnly: false,
        },
      ],
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: now,
          updatedBy: data.isAnonymous ? 'Student (Anonymous)' : currentUser.name,
          note: 'Ticket filed successfully in the system.',
        },
      ],
      tags: data.tags || [data.category.split(' ')[0], data.priority],
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Audit log
    addAuditLog(newComplaint.id, ticketNumber, 'TICKET_CREATED', `New ticket lodged under category ${data.category}`);

    // Trigger 1: In-app + simulated email to student
    createNotification(
      currentUser.id,
      `Complaint Received: #${ticketNumber}`,
      `Your concern regarding "${data.title}" has been recorded. Use code ${ticketNumber} to track resolution.`,
      'ticket_submitted',
      newComplaint.id,
      ticketNumber,
      {
        to: currentUser.email,
        subject: `[EMCI Ticket Acknowledgment] ${ticketNumber}: ${data.title}`,
        snippet: `Thank you for reaching out to EMCI Student Affairs. Your ticket ${ticketNumber} has been logged and assigned to the triage team with target SLA: ${slaDays} days.`,
      }
    );

    // Trigger 2: Alert Admin / OSA
    const admins = allUsers.filter((u) => u.role === 'admin');
    admins.forEach((admin) => {
      createNotification(
        admin.id,
        `New Ticket Lodged: #${ticketNumber} (${data.priority})`,
        `A new ${data.priority} concern was submitted for ${data.department}: "${data.title}"`,
        'ticket_submitted',
        newComplaint.id,
        ticketNumber,
        {
          to: admin.email,
          subject: `[ACTION REQUIRED] New Grievance #${ticketNumber} - ${data.priority} Priority`,
          snippet: `Dean Tolentino, a new grievance requires review and routing to ${data.department}.`,
        }
      );
    });

    return newComplaint;
  };

  const updateComplaintStatus = (
    ticketId: string,
    newStatus: ComplaintStatus,
    note?: string,
    actionTaken?: string,
    resolutionRemarks?: string
  ) => {
    const now = new Date().toISOString();
    let updatedTicket: Complaint | null = null;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;

        const isNowResolved = newStatus === 'Resolved' && c.status !== 'Resolved';
        const updated: Complaint = {
          ...c,
          status: newStatus,
          updatedAt: now,
          resolvedAt: isNowResolved ? now : c.resolvedAt,
          actionTaken: actionTaken || c.actionTaken,
          resolutionRemarks: resolutionRemarks || c.resolutionRemarks,
          statusHistory: [
            ...c.statusHistory,
            {
              status: newStatus,
              timestamp: now,
              updatedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
              note: note || `Status transitioned to ${newStatus}`,
            },
          ],
        };
        updatedTicket = updated;
        return updated;
      })
    );

    if (updatedTicket) {
      const ticket: Complaint = updatedTicket;
      addAuditLog(ticket.id, ticket.ticketNumber, 'STATUS_UPDATED', `Status set to ${newStatus}. ${note || ''}`);

      // Notify the student
      const student = allUsers.find((u) => u.studentId === ticket.studentId || u.email === ticket.studentEmail);
      const studentUserId = student ? student.id : 'user-std-1';

      createNotification(
        studentUserId,
        `Status Changed: #${ticket.ticketNumber} is now ${newStatus}`,
        note || `Your ticket status was updated to "${newStatus}" by ${currentUser.name}.`,
        'status_change',
        ticket.id,
        ticket.ticketNumber,
        {
          to: ticket.studentEmail,
          subject: `[EMCI Portal Update] Ticket ${ticket.ticketNumber} is now ${newStatus}`,
          snippet: `Dear student, your grievance regarding "${ticket.title}" has been moved to ${newStatus}. ${resolutionRemarks ? `Resolution remarks: ${resolutionRemarks}` : ''}`,
        }
      );

      // If resolved, invite rating
      if (newStatus === 'Resolved') {
        createNotification(
          studentUserId,
          `Rate Resolution for #${ticket.ticketNumber}`,
          `Your concern has been marked RESOLVED. Please provide feedback to help Eastern Mindoro College improve services.`,
          'rating_received',
          ticket.id,
          ticket.ticketNumber
        );
      }
    }
  };

  const assignComplaint = (ticketId: string, facultyId: string, department: Department) => {
    const assignee = allUsers.find((u) => u.id === facultyId);
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;
        const nextStatus = c.status === 'Submitted' ? 'Assigned' : c.status;
        return {
          ...c,
          department,
          assignedToId: facultyId,
          assignedToName: assignee ? assignee.name : 'Department Staff',
          status: nextStatus,
          updatedAt: now,
          statusHistory: [
            ...c.statusHistory,
            {
              status: nextStatus,
              timestamp: now,
              updatedBy: `${currentUser.name} (Admin)`,
              note: `Assigned to ${assignee ? assignee.name : 'Staff'} (${department})`,
            },
          ],
        };
      })
    );

    const targetTicket = complaints.find((c) => c.id === ticketId);
    if (targetTicket) {
      addAuditLog(
        ticketId,
        targetTicket.ticketNumber,
        'TICKET_ASSIGNED',
        `Assigned to ${assignee ? assignee.name : facultyId} (${department})`
      );

      // Notify faculty
      createNotification(
        facultyId,
        `Ticket Assigned to You: #${targetTicket.ticketNumber}`,
        `You have been assigned to handle "${targetTicket.title}" under ${department}.`,
        'ticket_assigned',
        targetTicket.id,
        targetTicket.ticketNumber,
        {
          to: assignee?.email || 'faculty@emc.edu.ph',
          subject: `[EMCI Assignment] Assigned Ticket ${targetTicket.ticketNumber}: ${targetTicket.title}`,
          snippet: `You are designated as the lead personnel to resolve this concern before SLA deadline.`,
        }
      );
    }
  };

  const addComment = (ticketId: string, content: string, isInternalOnly: boolean) => {
    const now = new Date().toISOString();
    const commentId = `comm-${Date.now()}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;
        return {
          ...c,
          updatedAt: now,
          comments: [
            ...c.comments,
            {
              id: commentId,
              authorId: currentUser.id,
              authorName: currentUser.name,
              authorRole: currentUser.role,
              content,
              createdAt: now,
              isInternalOnly,
            },
          ],
        };
      })
    );

    const ticket = complaints.find((c) => c.id === ticketId);
    if (!ticket) return;

    addAuditLog(
      ticketId,
      ticket.ticketNumber,
      isInternalOnly ? 'INTERNAL_NOTE_ADDED' : 'PUBLIC_COMMENT_POSTED',
      `Remark added by ${currentUser.name} (${currentUser.role})`
    );

    // If student posted, alert assignee and admin
    if (currentUser.role === 'student') {
      if (ticket.assignedToId) {
        createNotification(
          ticket.assignedToId,
          `Student Response on #${ticket.ticketNumber}`,
          `${currentUser.name} replied: "${content.substring(0, 75)}..."`,
          'comment_added',
          ticket.id,
          ticket.ticketNumber
        );
      }
    } else if (!isInternalOnly) {
      // If faculty/admin posted publicly, alert student
      const student = allUsers.find((u) => u.studentId === ticket.studentId || u.email === ticket.studentEmail);
      if (student) {
        createNotification(
          student.id,
          `Staff Response on Ticket #${ticket.ticketNumber}`,
          `${currentUser.name}: "${content.substring(0, 80)}..."`,
          'comment_added',
          ticket.id,
          ticket.ticketNumber,
          {
            to: ticket.studentEmail,
            subject: `[EMCI Reply] Update on Complaint ${ticket.ticketNumber}`,
            snippet: `${currentUser.name} posted an update: "${content}"`,
          }
        );
      }
    }
  };

  const submitStudentRating = (
    ticketId: string,
    rating: number,
    feedback: string,
    criteriaRatings: { resolutionSpeed: number; staffCourtesy: number; solutionQuality: number }
  ) => {
    const now = new Date().toISOString();
    const ratingObj: StudentSatisfactionRating = {
      rating,
      feedback,
      submittedAt: now,
      criteriaRatings,
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;
        return {
          ...c,
          status: 'Closed',
          rating: ratingObj,
          updatedAt: now,
          statusHistory: [
            ...c.statusHistory,
            {
              status: 'Closed',
              timestamp: now,
              updatedBy: currentUser.name,
              note: `Student rated resolution: ${rating} / 5 stars`,
            },
          ],
        };
      })
    );

    const ticket = complaints.find((c) => c.id === ticketId);
    if (ticket) {
      addAuditLog(ticketId, ticket.ticketNumber, 'CSAT_RATING_SUBMITTED', `Score: ${rating}/5. Feedback: "${feedback}"`);

      // Alert Dean / Admin of feedback
      const admins = allUsers.filter((u) => u.role === 'admin');
      admins.forEach((admin) => {
        createNotification(
          admin.id,
          `Satisfaction Feedback for #${ticket.ticketNumber}`,
          `Student provided ${rating}-star CSAT rating: "${feedback.substring(0, 60)}..."`,
          'rating_received',
          ticket.id,
          ticket.ticketNumber
        );
      });
    }
  };

  const submitAppeal = (ticketId: string, reason: string) => {
    const now = new Date().toISOString();
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== ticketId) return c;
        return {
          ...c,
          status: 'Appealed',
          appealReason: reason,
          updatedAt: now,
          statusHistory: [
            ...c.statusHistory,
            {
              status: 'Appealed',
              timestamp: now,
              updatedBy: currentUser.name,
              note: `Student appealed resolution: "${reason}"`,
            },
          ],
        };
      })
    );

    const ticket = complaints.find((c) => c.id === ticketId);
    if (ticket) {
      addAuditLog(ticketId, ticket.ticketNumber, 'APPEAL_LODGED', `Reason: ${reason}`);

      const admins = allUsers.filter((u) => u.role === 'admin');
      admins.forEach((admin) => {
        createNotification(
          admin.id,
          `Appeal Lodged: #${ticket.ticketNumber}`,
          `Student appealed resolution for "${ticket.title}". Action requested from OSA Committee.`,
          'status_change',
          ticket.id,
          ticket.ticketNumber
        );
      });
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const addISOEvaluation = (entry: Omit<SystemFeedbackEntry, 'id' | 'submittedAt'>) => {
    const newEntry: SystemFeedbackEntry = {
      ...entry,
      id: `eval-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setIsoEvaluations((prev) => [newEntry, ...prev]);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ISO_EVAL);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);

    setComplaints(INITIAL_COMPLAINTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIsoEvaluations(INITIAL_ISO_EVALUATIONS);
    setCurrentUserId(INITIAL_USERS[0].id);
  };

  const getComplaintByTicketNumber = (num: string): Complaint | undefined => {
    const clean = num.trim().toUpperCase();
    return complaints.find(
      (c) => c.ticketNumber.toUpperCase() === clean || c.id.toUpperCase() === clean
    );
  };

  const unreadNotifCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.isRead
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        complaints,
        notifications,
        unreadNotifCount,
        auditLogs,
        isoEvaluations,
        activeTab,
        setActiveTab,
        selectedTicketId,
        setSelectedTicketId,
        searchQuery,
        setSearchQuery,
        submitComplaint,
        updateComplaintStatus,
        assignComplaint,
        addComment,
        submitStudentRating,
        submitAppeal,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addISOEvaluation,
        resetToDefaults,
        getComplaintByTicketNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
