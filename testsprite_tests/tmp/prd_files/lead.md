Perfect — here’s a clean, PRD (Product Requirements Document) section for your Lead Management Module, formatted exactly for inclusion in a .docx or Google Docs file.

PRD: Lead Management Module
Feature Owner: CRM Team
Module: Leads
Last Updated: 28 Oct 2025
Version: v1.0

1. Overview

The Lead Management module allows school admins and counsellors to manage prospective student enquiries efficiently.
It includes creating, viewing, updating, deleting, assigning, and tracking leads — along with activity timelines and communication tracking.

2. Objectives

Enable staff to create and manage leads from the dashboard.

Provide a centralized view of all leads and their statuses.

Support lead assignment, activity tracking, and conversion to students.

3. Key Features
   3.1 Create Lead

Action: Clicking the “Create Lead” button on /dashboard/leads navigates to /dashboard/leads/create.

Fields:

Student Name (required)

Parent Name

Phone (required)

Email

Enquiry For (grade)

Source (Website, Referral, Call, etc.)

Notes (optional)

Expected Behavior:

On form submission, a new Lead record is created in the database.

The user is redirected back to the leads table with a success toast.

3.2 Leads Table

Route: /dashboard/leads

Displays:

Column Description
Student Name Full name of student
Parent Name Optional
Phone Clickable to call
Status NEW / FOLLOW_UP / CONVERTED / NOT_INTERESTED
Source Lead source
Next Follow-up Date of next planned contact
Assigned To Counselor name

Actions:

View Lead Details → navigates to /dashboard/leads/[id]

Delete Lead (single)

Bulk Delete (multiple selection)

Assign/Unassign lead

3.3 Lead Details Page

Route: /dashboard/leads/[id]

Sections:

Lead Info — All core fields

Activity Timeline — Chronological list of interactions

Assignment Info — Assigned user, timestamp

Next Follow-up Reminder

3.4 Lead Activity (Popover Create)

Trigger: “+ Add Activity” button in Lead Details Page.

UI: Opens as a small popover or modal.

Fields:

Title (e.g., “Called Parent”, “Shared Brochure”)

Type (Call, Message, Meeting, Email)

Description

Outcome

Next Follow-up (optional)

Behavior:

Activity saved under the lead.

Updates “Last Contacted At” and increments followUpCount.

3.5 Lead Activity Timeline

Displays: All past activities in reverse chronological order.

Each Entry Includes:

Activity Type icon (call, message, visit, etc.)

Title & Description

Outcome

Created by + Timestamp

Purpose: Gives the counsellor full history of engagement.

3.6 Lead Assign / Unassign

Assign:

Admin can assign a lead to a specific user.

assignedToUserId and assignedAt fields updated.

Unassign:

Clears assignment fields.

Lead returns to unassigned pool.

UX: Dropdown in Leads Table or Details Page.

Notifications: Assigned user receives notification or email.

3.7 Delete Lead / Bulk Delete

Single Delete: From lead details or table row action.

Bulk Delete: From table selection.

Confirmation: Modal confirmation with text "Are you sure you want to delete selected lead(s)?"

Behavior: Soft delete (optional) or permanent delete as per role permissions.

4. Success Metrics

Reduced average lead response time.

Increased follow-up completion rate.

Higher lead-to-student conversion ratio.

5. Future Enhancements

Lead import via Excel or CSV.

Lead scoring automation (AI-based).

Integration with WhatsApp / Twilio API.

Automatic reminders and notifications.
