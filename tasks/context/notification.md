# Notification System Mapping

Based on your Prisma schema and notification requirements, here's a comprehensive list of all scenarios where notifications should be sent:

## 1. Student Attendance Notifications
**Trigger:** Daily attendance marked (`StudentAttendance` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Student Marked Absent | SMS, WhatsApp, Push, Email | Parent, Student | High | studentName, date, section, grade |
| Student Marked Late | SMS, WhatsApp, Push | Parent | Medium | studentName, date, lateBy |
| Low Attendance Alert (< 75%) | Email, WhatsApp | Parent, Student | High | studentName, attendancePercent, month |
| Monthly Attendance Report | Email | Parent | Low | studentName, presentDays, absentDays, percentage |

## 2. Fee Management Notifications
**Trigger:** Fee creation, payment, overdue (`Fee`, `FeePayment` models)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| New Fee Created | SMS, WhatsApp, Email | Parent | High | studentName, feeAmount, dueDate, feeCategory |
| Fee Due Reminder (7 days before) | SMS, WhatsApp, Email | Parent | High | studentName, feeAmount, dueDate, daysLeft |
| Fee Due Reminder (1 day before) | SMS, WhatsApp, Push | Parent | Urgent | studentName, feeAmount, dueDate |
| Fee Overdue Alert | SMS, WhatsApp, Push, Email | Parent | Urgent | studentName, overdueAmount, penaltyIfAny |
| Payment Successful | SMS, WhatsApp, Email | Parent, Student | Medium | receiptNumber, amount, paymentDate, receiptUrl |
| Payment Failed | SMS, WhatsApp, Push | Parent | High | studentName, amount, reason |
| Partial Payment Received | SMS, Email | Parent | Medium | paidAmount, pendingAmount, receiptUrl |
| FeeSense AI Report (Daily/Weekly) | Email | Admin, Principal | Low | totalOverdue, studentsAtRisk, collectionRate |

## 3. Notice/Circular Notifications
**Trigger:** Notice published (`Notice` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| General Notice | Email, Push | Based on targetAudience | Medium/High | title, summary, startDate, attachmentUrls |
| Urgent Notice | SMS, WhatsApp, Push, Email | Based on targetAudience | Urgent | title, summary, actionRequired |
| Event Reminder (Trip/Annual Day) | SMS, WhatsApp, Email | Parent, Student | High | eventName, date, venue, instructions |
| Holiday Announcement | Push, Email | Parent, Student, Teacher | Low | holidayName, startDate, endDate |
| Exam Schedule Notice | SMS, Email, WhatsApp | Parent, Student | High | examName, subjects, dateSheet |
| Result Published | SMS, Push, Email | Parent, Student | High | examName, resultsAvailableOn |
| Deadline Reminder (Fee/Form) | SMS, WhatsApp, Push | Parent | Urgent | deadlineFor, lastDate, penalty |

## 4. Exam Management Notifications
**Trigger:** Exam creation, hall ticket, results (`Exam`, `HallTicket`, `ExamResult` models)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Exam Schedule Created | Email, WhatsApp | Parent, Student | High | examTitle, subjects, startDate, venue |
| Hall Ticket Generated | SMS, Email, WhatsApp | Parent, Student | High | examName, hallTicketNumber, downloadUrl, examDate |
| Exam Reminder (1 day before) | SMS, WhatsApp, Push | Student | High | examName, subject, date, time, venue |
| Exam Started (Live) | Push | Student | Medium | examName, startTime, venue |
| Result Published | SMS, WhatsApp, Push, Email | Parent, Student | High | examName, percentage, grade, resultUrl |
| Report Card Available | Email, WhatsApp | Parent, Student | High | sessionName, cgpa, rank, downloadUrl |
| Student Absent in Exam | SMS, WhatsApp | Parent | High | studentName, examName, subject, date |
| Poor Performance Alert | Email, WhatsApp | Parent | Medium | studentName, examName, obtainedMarks, passingMarks |

## 5. Document Management Notifications
**Trigger:** Document upload, verification (`StudentDocument` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Document Upload Successful | Push, Email | Parent, Student | Low | documentType, uploadedAt |
| Document Pending Verification | Email | Admin | Low | studentName, documentType, uploadedDate |
| Document Verified | SMS, Email | Parent, Student | Medium | documentType, verifiedBy, verifiedAt |
| Document Rejected | SMS, WhatsApp, Email | Parent, Student | High | documentType, rejectionReason, resubmitBy |
| Document Missing/Required | SMS, WhatsApp, Email | Parent | High | documentTypes, deadlineDate |

## 6. Leave Management Notifications
**Trigger:** Leave application, approval/rejection (`Leave` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Leave Application Submitted | Email, Push | Admin, Teacher | Medium | applicantName, leaveType, startDate, endDate, reason |
| Leave Approved | SMS, WhatsApp, Email | Applicant (Parent/Teacher/Student) | Medium | leaveType, startDate, endDate, approvedBy |
| Leave Rejected | SMS, Email, WhatsApp | Applicant | High | leaveType, rejectionReason |
| Leave Starting Tomorrow | Push | Applicant, Admin | Low | applicantName, leaveType, duration |

## 7. Complaint Management Notifications
**Trigger:** Complaint submission, status change (`AnonymousComplaint` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Complaint Submitted | Email | Admin, Principal | High | trackingId, category, severity |
| Complaint Status Updated | Email | Complainant (via trackingId) | Medium | trackingId, newStatus, note |
| Complaint Resolved | Email | Complainant | Medium | trackingId, resolutionNote |
| Critical Complaint Alert | SMS, WhatsApp, Email | Admin, Principal | Urgent | trackingId, category, severity |

## 8. Teaching Assignment Notifications
**Trigger:** Teacher assignment changes (`TeachingAssignment` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| New Assignment Created | Email, Push | Teacher | High | subject, grade, section, academicYear |
| Assignment Removed | Email | Teacher | Medium | subject, grade, section, reason |
| Class Teacher Assigned | Email | Teacher, Parent (of section) | High | teacherName, grade, section |

## 9. Lead Management Notifications
**Trigger:** Lead creation, status change (`Lead` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| New Lead Assigned | SMS, Email, Push | Assigned Teacher/Admin | Medium | leadName, phone, enquiryFor |
| Lead Follow-up Reminder | Push, Email | Assigned User | High | leadName, nextFollowUpDate, lastActivity |
| Lead Converted to Student | Email | Admin, Assigned User | Medium | studentName, convertedDate |
| Lead Lost/Closed | Email | Admin | Low | leadName, closureReason |

## 10. Academic Year/Calendar Notifications
**Trigger:** Academic events (`AcademicCalendar` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Academic Year Started | Email, WhatsApp | Parent, Student, Teacher | High | yearName, startDate, endDate |
| Event Reminder (7 days before) | Email, Push | Based on event type | Medium | eventName, date, type |
| Sudden Calendar Change | SMS, WhatsApp, Push | Parent, Student, Teacher | Urgent | eventName, originalDate, newDate, reason |

## 11. Organization/Account Notifications
**Trigger:** Organization plan, limits (`Organization` model)

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Plan Expiring Soon (7 days) | Email | Admin, Owner | High | planType, expiryDate, renewalLink |
| Plan Expired | SMS, Email | Admin, Owner | Urgent | planType, expiredDate, features |
| Student Limit Reached | Email | Admin | High | currentCount, maxLimit |
| Payment Gateway Issue | SMS, Email | Admin | Urgent | issueDescription, affectedPayments |

## 12. Teacher-Specific Notifications

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Attendance Pending Reminder | Push, Email | Teacher | Medium | date, sections, deadline |
| Exam Marks Entry Reminder | Email, Push | Teacher | High | examName, subject, deadline |
| Profile Incomplete | Email | Teacher | Low | missingFields |

## 13. Student-Specific Notifications

| Scenario | Channels | Recipients | Priority | Template Variables |
| :--- | :--- | :--- | :--- | :--- |
| Welcome Message (New Admission) | SMS, WhatsApp, Email | Student, Parent | Medium | studentName, grade, section, schoolContact |
| Profile Update Required | Email, Push | Student, Parent | Medium | missingFields, deadline |
| Birthday Wishes | WhatsApp, Push | Student, Parent | Low | studentName |

```json
{
  "fallback_logic": {
    "WhatsApp": "fails -> SMS",
    "SMS": "fails -> Email",
    "Push": "always sent (free)"
  }
}
```

## Channel Usage Summary

| Notification Type | SMS | WhatsApp | Push | Email |
| :--- | :---: | :---: | :---: | :---: |
| Attendance Absent/Late | ✅ | ✅ | ✅ | ✅ |
| Fees | ✅ | ✅ | ✅ | ✅ |
FRIENDLY_REMINDER
OVERDUE_NOTICE
PAYMENT_DUE_TODAY
Payment Success
Payment Failed
| Notice | ✅ | ✅ | ✅ | ✅ |
| Urgent Notice
| Exam Created Notify | ✅ | ✅ | ✅ | ✅ |
| Exam Reminder Before 1Day| ✅ | ✅ | ✅ | ❌ |
| Exam Enroll Notify | ✅ | ✅ | ✅ | ✅ |
| Exam Download HallTicket Notify | ✅ | ✅ | ✅ | ✅ |
| Exam Result Published | ✅ | ✅ | ✅ | ✅ |
| Document Missing/Required | ✅ | ✅ | ✅ | ✅ |
| Document Verified | ✅ | ✅ | ✅ | ✅ |
| Document Rejected | ✅ | ✅ | ❌ | ✅ |
| Leave Approved | ✅ | ✅ | ❌ | ✅ |
| Leave Rejected | ✅ | ✅ | ❌ | ✅ |
| General Notice | ❌ | ❌ | ✅ | ✅ |
| Monthly Report | ❌ | ❌ | ❌ | ✅ |
| Birthday Wishes | ❌ | ✅ | ✅ | ❌ |
