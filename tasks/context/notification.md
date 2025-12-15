Notification System Mapping
Based on your Prisma schema and notification requirements, here's a comprehensive list of all scenarios where notifications should be sent:
1. Student Attendance Notifications
Trigger: Daily attendance marked (StudentAttendance model)
ScenarioChannelsRecipientsPriorityTemplate VariablesStudent Marked AbsentSMS, WhatsApp, Push, EmailParent, StudentHighstudentName, date, section, gradeStudent Marked LateSMS, WhatsApp, PushParentMediumstudentName, date, lateByLow Attendance Alert (< 75%)Email, WhatsAppParent, StudentHighstudentName, attendancePercent, monthMonthly Attendance ReportEmailParentLowstudentName, presentDays, absentDays, percentage

2. Fee Management Notifications
Trigger: Fee creation, payment, overdue (Fee, FeePayment models)
ScenarioChannelsRecipientsPriorityTemplate VariablesNew Fee CreatedSMS, WhatsApp, EmailParentHighstudentName, feeAmount, dueDate, feeCategoryFee Due Reminder (7 days before)SMS, WhatsApp, EmailParentHighstudentName, feeAmount, dueDate, daysLeftFee Due Reminder (1 day before)SMS, WhatsApp, PushParentUrgentstudentName, feeAmount, dueDateFee Overdue AlertSMS, WhatsApp, Push, EmailParentUrgentstudentName, overdueAmount, penaltyIfAnyPayment SuccessfulSMS, WhatsApp, EmailParent, StudentMediumreceiptNumber, amount, paymentDate, receiptUrlPayment FailedSMS, WhatsApp, PushParentHighstudentName, amount, reasonPartial Payment ReceivedSMS, EmailParentMediumpaidAmount, pendingAmount, receiptUrlFeeSense AI Report (Daily/Weekly)EmailAdmin, PrincipalLowtotalOverdue, studentsAtRisk, collectionRate

3. Notice/Circular Notifications
Trigger: Notice published (Notice model)
ScenarioChannelsRecipientsPriorityTemplate VariablesGeneral NoticeEmail, PushBased on targetAudienceMedium/Hightitle, summary, startDate, attachmentUrlsUrgent NoticeSMS, WhatsApp, Push, EmailBased on targetAudienceUrgenttitle, summary, actionRequiredEvent Reminder (Trip/Annual Day)SMS, WhatsApp, EmailParent, StudentHigheventName, date, venue, instructionsHoliday AnnouncementPush, EmailParent, Student, TeacherLowholidayName, startDate, endDateExam Schedule NoticeSMS, Email, WhatsAppParent, StudentHighexamName, subjects, dateSheetResult PublishedSMS, Push, EmailParent, StudentHighexamName, resultsAvailableOnDeadline Reminder (Fee/Form)SMS, WhatsApp, PushParentUrgentdeadlineFor, lastDate, penalty

4. Exam Management Notifications
Trigger: Exam creation, hall ticket, results (Exam, HallTicket, ExamResult models)
ScenarioChannelsRecipientsPriorityTemplate VariablesExam Schedule CreatedEmail, WhatsAppParent, StudentHighexamTitle, subjects, startDate, venueHall Ticket GeneratedSMS, Email, WhatsAppParent, StudentHighexamName, hallTicketNumber, downloadUrl, examDateExam Reminder (1 day before)SMS, WhatsApp, PushStudentHighexamName, subject, date, time, venueExam Started (Live)PushStudentMediumexamName, startTime, venueResult PublishedSMS, WhatsApp, Push, EmailParent, StudentHighexamName, percentage, grade, resultUrlReport Card AvailableEmail, WhatsAppParent, StudentHighsessionName, cgpa, rank, downloadUrlStudent Absent in ExamSMS, WhatsAppParentHighstudentName, examName, subject, datePoor Performance AlertEmail, WhatsAppParentMediumstudentName, examName, obtainedMarks, passingMarks

5. Document Management Notifications
Trigger: Document upload, verification (StudentDocument model)
ScenarioChannelsRecipientsPriorityTemplate VariablesDocument Upload SuccessfulPush, EmailParent, StudentLowdocumentType, uploadedAtDocument Pending VerificationEmailAdminLowstudentName, documentType, uploadedDateDocument VerifiedSMS, EmailParent, StudentMediumdocumentType, verifiedBy, verifiedAtDocument RejectedSMS, WhatsApp, EmailParent, StudentHighdocumentType, rejectionReason, resubmitByDocument Missing/RequiredSMS, WhatsApp, EmailParentHighdocumentTypes, deadlineDate

6. Leave Management Notifications
Trigger: Leave application, approval/rejection (Leave model)
ScenarioChannelsRecipientsPriorityTemplate VariablesLeave Application SubmittedEmail, PushAdmin, TeacherMediumapplicantName, leaveType, startDate, endDate, reasonLeave ApprovedSMS, WhatsApp, EmailApplicant (Parent/Teacher/Student)MediumleaveType, startDate, endDate, approvedByLeave RejectedSMS, Email, WhatsAppApplicantHighleaveType, rejectionReasonLeave Starting TomorrowPushApplicant, AdminLowapplicantName, leaveType, duration

7. Complaint Management Notifications
Trigger: Complaint submission, status change (AnonymousComplaint model)
ScenarioChannelsRecipientsPriorityTemplate VariablesComplaint SubmittedEmailAdmin, PrincipalHightrackingId, category, severityComplaint Status UpdatedEmailComplainant (via trackingId)MediumtrackingId, newStatus, noteComplaint ResolvedEmailComplainantMediumtrackingId, resolutionNoteCritical Complaint AlertSMS, WhatsApp, EmailAdmin, PrincipalUrgenttrackingId, category, severity

8. Teaching Assignment Notifications
Trigger: Teacher assignment changes (TeachingAssignment model)
ScenarioChannelsRecipientsPriorityTemplate VariablesNew Assignment CreatedEmail, PushTeacherHighsubject, grade, section, academicYearAssignment RemovedEmailTeacherMediumsubject, grade, section, reasonClass Teacher AssignedEmailTeacher, Parent (of section)HighteacherName, grade, section

9. Lead Management Notifications
Trigger: Lead creation, status change (Lead model)
ScenarioChannelsRecipientsPriorityTemplate VariablesNew Lead AssignedSMS, Email, PushAssigned Teacher/AdminMediumleadName, phone, enquiryForLead Follow-up ReminderPush, EmailAssigned UserHighleadName, nextFollowUpDate, lastActivityLead Converted to StudentEmailAdmin, Assigned UserMediumstudentName, convertedDateLead Lost/ClosedEmailAdminLowleadName, closureReason

10. Academic Year/Calendar Notifications
Trigger: Academic events (AcademicCalendar model)
ScenarioChannelsRecipientsPriorityTemplate VariablesAcademic Year StartedEmail, WhatsAppParent, Student, TeacherHighyearName, startDate, endDateEvent Reminder (7 days before)Email, PushBased on event typeMediumeventName, date, typeSudden Calendar ChangeSMS, WhatsApp, PushParent, Student, TeacherUrgenteventName, originalDate, newDate, reason

11. Organization/Account Notifications
Trigger: Organization plan, limits (Organization model)
ScenarioChannelsRecipientsPriorityTemplate VariablesPlan Expiring Soon (7 days)EmailAdmin, OwnerHighplanType, expiryDate, renewalLinkPlan ExpiredSMS, EmailAdmin, OwnerUrgentplanType, expiredDate, featuresStudent Limit ReachedEmailAdminHighcurrentCount, maxLimitPayment Gateway IssueSMS, EmailAdminUrgentissueDescription, affectedPayments

12. Teacher-Specific Notifications
ScenarioChannelsRecipientsPriorityTemplate VariablesAttendance Pending ReminderPush, EmailTeacherMediumdate, sections, deadlineExam Marks Entry ReminderEmail, PushTeacherHighexamName, subject, deadlineProfile IncompleteEmailTeacherLowmissingFields

13. Student-Specific Notifications
ScenarioChannelsRecipientsPriorityTemplate VariablesWelcome Message (New Admission)SMS, WhatsApp, EmailStudent, ParentMediumstudentName, grade, section, schoolContactProfile Update RequiredEmail, PushStudent, ParentMediummissingFields, deadlineBirthday WishesWhatsApp, PushStudent, ParentLowstudentName

Notification Priority Cost Optimization
typescriptconst NOTIFICATION_RULES = {
  // High-cost channels (SMS, WhatsApp) only for critical/urgent
  URGENT: ['SMS', 'WhatsApp', 'Push'],
  HIGH: ['SMS', 'WhatsApp', 'Email', 'Push'],
  MEDIUM: ['WhatsApp', 'Email', 'Push'],
  LOW: ['Email', 'Push'],
  
  // Fallback logic
  // If WhatsApp fails → SMS
  // If SMS fails → Email
  // Push always sent (free)
}

Channel Usage Summary
Notification TypeSMSWhatsAppPushEmailAttendance Absent✅✅✅✅Fee Overdue✅✅✅✅Urgent Notice✅✅✅✅Exam Reminder✅✅✅❌Result Published✅✅✅✅Document Rejected✅✅❌✅Leave Approved✅✅❌✅General Notice❌❌✅✅Monthly Report❌❌❌✅Birthday Wishes❌✅✅❌
