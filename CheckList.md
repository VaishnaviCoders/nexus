# Check List Before we Deliver To School

- Delete Upload Things Files / Cloudinary / Clerk Orgs/User

- Set Active Organization to user
- Clerk Webhooks => SYNC Database
- Errors
- Database Organization And Clerk Organization Are Same ?
- Welcome Guest Issues
- Student Creating Is Proper ? || Create Membership || DB Adding Parent Connection|| Clerk DB Sync
- When Student Create send Automated Email to Parents And Student
- Grade And Section Name is Proper ?
- Added Current Academic Year Properly ?
- Roles Error
- Payment Is Working in UAT / PRODUCTION
- Cloudinary Is Working
- Upload Thing Is working ?
- Payment Status Is changing by Automation
- After Payment Form PhonePe => Store in Database Properly
- Receipts Are Generate Properly after Payment SUCCESS / FAILED / COMPLETED
- Push Notification Are sending Properly => Fee Reminders / Notice
- Email Sending Properly => FEE Reminder / Notice / Attendance Report / Fees Receipts
- Whats-Up Message Sending Properly => FEE Reminder / Urgent Notice / Daily Live Attendance / Fees Receipts

# High Priority Issues

- USER onboarding Issue : Mail Not send /
- No Active Organization Found
- Fees Management Slow Opening
- Roles Are not Sync Properly

# Errors:

1. fetchGradesAndSections

Invalid `prisma.grade.findMany()` invocation:

Engine is not yet connected:Application error: a server-side exception has occurred while loading localhost (see the server logs for more information).
Digest: 1786913895

2. FilterStudents

Error filtering students: Error [PrismaClientUnknownRequestError]:
Invalid `prisma.student.findMany()` invocation:

Response from the Engine was empty

# Checks with Status

Dashboard : Quick Action => Success
Grade and Section => Success
Student Management : Add Student => Success

- Bug[Click On Calendar Then we goes Up ]

Fee Management : Assign Fees => Success

# Pending 17-7-20025

Class Management : Responsive GradeList

Student Management :

- Student Documents Option Enable for Create Student
- Student Delete Option

Fee Management :

- Export Data
- Print Report
- Send Reminder : Schedule For Later || SMS || WhatsApp || Fee Reminder Templates

Holidays Management :

- Import Holidays Make Responsive

Notice Management :

- Change Name : Announcement/
- Change or Enhance Schema And remove Json
- Notice Template

Attendance Templates
Notification Badge In Sidebar

Promise Them

- Ones App Stable we can enable Payment / Download Reports / Whatsapp Verification / SMS DLT
- Reminders Send
- RFID

Fee Management

| Category                              | Status     |
| ------------------------------------- | ---------- |
| Fee Collection (Core)                 | ✅ DONE    |
| Multi-Mode Payment                    | ✅ DONE    |
| Offline/Online Payment                | ✅ DONE    |
| Fee Categories & Structures           | ✅ DONE    |
| Payment Fee Details                   | ✅ DONE    |
| Payment Receipts                      | ✅ DONE    |
| Reports / Analytics                   | ✅ DONE    |
| Notifications                         | ✅ DONE    |
| Schedule Reminders with Ingest        | ✅ PENDING |
| Send Reminders                        | ✅ DONE    |
| Email Reminder Template               | ✅ PENDING |
| SMS Reminder Template                 | ✅ PENDING |
| WhatsApp Reminder Template            | ✅ PENDING |
| AI Voice Reminder Call                | ✅ PENDING |
| Role-Based Permissions                | ✅ DONE    |
| Refunds / Adjustments                 | ❌ MISSING |
| Installments / Auto-Penalty           | ❌ MISSING |
| Discounts / Scholarships              | ❌ MISSING |
| Student Ledger                        | ❌ MISSING |
| Invoice Scheduling                    | ❌ MISSING |
| Financial Audit Logs                  | ❌ MISSING |
| Fee Concession / Scholarship Types    | ❌ MISSING |
| Carry Forward / Advance Payments      | ❌ MISSING |
| Payment Certificates / Acknowledgment | ❌ MISSING |

Attendance Management

| Category                                  | Status     | Notes                                        |
| ----------------------------------------- | ---------- | -------------------------------------------- |
| Daily Attendance Recording                | ✅ DONE    | `StudentAttendance` model present            |
| Record by Section / Grade                 | ✅ DONE    | Via `sectionId`, `gradeId` in model          |
| Track Present/Absent/Late Status          | ✅ DONE    | `AttendanceStatus` enum                      |
| Academic Year Association                 | ✅ DONE    | Linked via `academicYearId`                  |
| Record By (Teacher/Admin)                 | ✅ DONE    | Field: `recordedBy`                          |
| Realtime Attendance Dashboard             | ✅ DONE    | Chart-based dashboard per class/date         |
| Bulk Upload / Import Attendance           | ❌ MISSING | Support CSV/Excel + validation UI            |
| Monthly Attendance Reports (AI Summary)   | ❌ MISSING | Add `MonthlyAttendanceReport` model          |
| SMS Notification for Absentees            | ✅ PENDING | Powered by `NotificationLog` + channel logic |
| WhatsApp Notification for Absentees       | ✅ PENDING |                                              |
| Email Notification for Absentees          | ✅ PENDING |                                              |
| Attendance Alerts Template (SMS/WA/Email) | ✅ PENDING | Need editable templates                      |
| Excused / Unexcused Leave Types           | ✅ PENDING | Expand `AttendanceStatus` enum               |
| Leave Integration                         | ❌ MISSING | Add `Leave` model (as per your comment)      |
| Generate Attendance Certificates          | ❌ MISSING | For term/year-end attendance                 |
| Teacher-wise Attendance Report            | ✅ PENDING | Group by `TeachingAssignment.teacherId`      |
| Section-wise Attendance Analytics         | ✅ PENDING | Group by `sectionId`                         |
| Auto-Mark Holiday (Based on Calendar)     | ✅ PENDING | Use `AcademicCalendar` to skip days          |
| Attendance Lock (Post X days)             | ❌ MISSING | Lock editing after cutoff period             |
| Attendance Audit Trail                    | ❌ MISSING | Track who edited what/when                   |
| Student Attendance Ledger                 | ❌ MISSING | Per-student record with month-wise view      |
| Auto-Absent Alert to Parent               | ✅ DONE    | Logic available via `NotificationLog`        |
| Role-Based Permissions                    | ✅ DONE    | Handled via `User.role` and page guards      |
| Attendance History Filtering              | ✅ DONE    | Schema allows query by student/date          |
| Custom Attendance Notes                   | ✅ DONE    | Field: `note` in `StudentAttendance`         |
