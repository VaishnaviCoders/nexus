 <!-- PROMPT  -->

Generate a modern, high-performance Next.js 15 application using server actions, client components, and server components where necessary. Follow a design system inspired by Vercel, ShadCN, Clerk, Neon, and Supabase—clean UI, minimal aesthetics, and well-structured components. Ensure seamless authentication handling (Clerk), database integration (Neon/Supabase), and responsive UI. Code should be modular, maintainable, and optimized for production.

Lead Management : https://tnks-data-table.vercel.app/
For Big Calender: https://big-calendar.vercel.app/month-view
Need To Buy : RFID biometric retina reader
Alpha shop Pimpri arket

- Pending Work

Attendance Table =>

// FilterAttendance: Date , DateRange

- Middleware TO Check ADMIN ACCESS / TEACHER ACCESS
    <!-- FEATURES -->

- Sortable Columns (Date, Name, Roll Number, Status)
- Export to CSV/Excel (Download attendance data)
- Sticky Table Headers (Helpful when scrolling)
- Server-Side Pagination (Instead of fetching everything at once)
- Add Notes for Each Attendance Record (Why a student was absent/late)
- Delete single And Bulk Delete

Attendance Mark =>

- Middleware TO Check ADMIN ACCESS / TEACHER ACCESS
- Slow Navigation After mark attendance

Attendance Dashboard =>

- Middleware TO Check ADMIN ACCESS / TEACHER ACCESS
- Slow Navigation After mark attendance
- Reported by Issue , Getting multiple Names
- Date Issue , Not Showing Date IST Format

Grade =>

- Need Solution : If Section Delete then Attendance Data will Delete {SOFT DELETE}
- Rules for create grade and section for structure and uniqueness :
  Don't use Section- A, sectionA
  Use only Section name like : A B C CUBE, CHESS

<!-- FEATURES -->

- Empty State For section and grade
- Assign Teacher
- Delete Click Issue
- Slow Loading
- Search Function
- Validation To Create And Delete
- Grade ID showing on breadcrumbs But Want Grade Name

Fees Management=>

- Need Solution : If Section Delete then Attendance Data will Delete {SOFT DELETE}
-

<!-- FEATURES -->

- Empty State For Fees and Assign Students to fees

Editor Or Designer Work

Have to create short tutorials on how to use software
Hints : Use public Questions on Quora and twitter post snippets

Attendance is very big problem in all the medical college so there is only one solution that anyhow complete the attendance.

Unused Components / Pages :
http://localhost:3000/dashboard/fees

Pending Pages :

Dashboard For each Role

Setting Page For each Role

Admin

Fee Category Edit Page : Completed But make to modal for Better UX / performance
Delete Fee Category Page : Completed but if have data in fees then show error Foreign key constraint violated: `Fee_feeCategoryId_fkey (index)`
Record Fee with Payment
Send Reminder (SMS, Whatsapp Mail )
Download Fees Details
Download Receipt
Do Something to SEND REMINDER HISTORY Component

Attendance
Date Range is not working
Export Is not working

Parent

Remark Page -
My Children Page : Proper Error Handling : No children found Then Give option to create :Done

Fees Page : No data found for this parent.
Notice : If not Notice found
Attendance Monitoring Page : Calendar || Monthly Attendance || Recent Attendance . : Done

Student Page

Assignments Page
Attendance Page : Show only Own Attendance
Teacher Feedback
My Documents
Update Profile

Feature List

- Not boring UI like PHP : Build With Latest Stack Premium Technology Nextjs
- School / Collage/ Coaching Classes Easy Onboarding
- Role Base Access [TEACHER,ADMIN,STUDENT,PARENT]
- MultiTenant Platform
- Fee Management System : Monthly Collection /
- Fee Reminders Sender (Manual/Automated)
- Online Fee Payment Option : Get Receipts by email / SMS / Whatsapp or Direct Download
- Students / Parents : Track There Own All Fees
- Teacher / Admin : Manage all Fees
-

- Dashboard All Roles

- Class Management
- Add Grade/Class - Delete Grades
- Add Section/Stream - Delete Section
- Assign Teacher to Section / Stream

- Student Management
- Create Student
- Manage Student / Delete Student

- Holiday Management
- Emergency Holiday Declaration
- Import by Google Sheet / Single Holiday / Bulk Import / Template base Copy Paste CSV
- Delete Holidays

- Attendance Management
- Section Wise Attendance Analytics : Section overview / Student History with Status
- Take Attendance with one Click Ai suggestion for Late and Absent
- All Students History

- Complaint Management
- Anonymous Complaint for Student And Parent
- Teacher Can Investigation and Update Complaint Status
- Track Complaint Status ?
-

- Notice Board
- Notice Approve and reject System
- Received by Mail , Whats app / SMS
- Push Notification

- Setting Page
- Organization Config
- Student can Edit profile
- Teacher Can Update Profile
- Parent Can See Child Parents Connected and Update IsPrimary Parent
