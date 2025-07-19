# Check List Before we Deliver To School

- Delete Upload Things Files / Cloudinary / Clerk Orgs/User

- Set Active Organization to user
- Clerk Webhooks => SYNC Database
- Errors
- Database Organization And Clerk Organization Are Same ?
- Welcome Guest Issues
- Student Creating Is Proper
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
