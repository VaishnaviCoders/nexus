# Lead Management – Testsprite Report

---

## 1) Document Metadata

- Project: nexus
- Date: 2025-10-28
- Prepared by: Testsprite AI (curated)

---

## 2) Requirements and Test Results

### R1. Authentication & Organization Context Availability

- Description: Dashboard pages under `/dashboard/leads*` require an authenticated session and a valid organization context (Clerk OrganizationSwitcher or equivalent fallback) to render.
- Business Value: Without a valid org context, no lead management feature is usable; this is a system-level gate.
- Tests:
  - TC001 Create Lead with Valid Data → Failed (page crashes due to disabled OrganizationSwitcher)
  - TC002 Create Lead with Missing Required Fields → Failed (blocked by same crash)
  - TC003 View Leads Table Data and UI Elements → Failed (blocked)
  - TC004 View Lead Details and Activity Timeline → Failed (blocked)
  - TC005 Add Lead Activity via Popover/Modal → Failed (blocked)
  - TC006 Assign Lead to Counsellor and Notification → Failed (blocked)
  - TC007 Unassign Lead from Counsellor → Failed (blocked)
  - TC008 Single Lead Deletion with Confirmation and RBAC → Failed (blocked)
  - TC009 Bulk Delete Leads with Confirmation and RBAC → Failed (blocked)
  - TC010 Lead Assignment Notification Trigger → Failed (blocked)
  - TC011 UI Responsiveness and Element Integrity → Failed (blocked)
  - TC012 Lead Activity Data Validation and Error Handling → Failed (blocked)
  - TC013 Leads Table Sorting Stability on Edge Data → Failed (blocked)
  - TC014 Database Consistency After Lead Conversion → Failed (blocked)
  - TC015 Access Control Enforcement on Lead Actions → Failed (blocked)

Evidence (from raw report): repeated browser console 400s to Clerk environment endpoint and explicit mention that `<OrganizationSwitcher/>` feature is disabled.

Links (visualizations):

- See raw report references within `testsprite_tests/tmp/raw_report.md` (e.g., TC001: https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/523ce04b-5000-4597-b76c-fc89097c1c64)

---

### R2. Leads – Create

- Description: Users can create a lead with valid data; validation errors appear for missing/invalid fields.
- Tests: TC001, TC002 → Failed (blocked by R1)

### R3. Leads – Read/List/Details

- Description: Leads table renders, supports sorting/filtering; details page displays fields and activity timeline.
- Tests: TC003, TC004, TC013 → Failed (blocked by R1)

### R4. Lead Activities

- Description: Add activity via dialog/modal with validation; timeline updates.
- Tests: TC005, TC012 → Failed (blocked by R1)

### R5. Lead Assignment

- Description: Assign/unassign lead to counsellor; notifications are triggered; UI reflects assignee.
- Tests: TC006, TC007, TC010 → Failed (blocked by R1)

### R6. Lead Deletion

- Description: Single and bulk delete with confirmation; RBAC enforced.
- Tests: TC008, TC009 → Failed (blocked by R1)

### R7. Lead Conversion

- Description: Convert lead and maintain DB consistency (lead → student or appropriate record), audit events created.
- Tests: TC014 → Failed (blocked by R1)

### R8. Access Control

- Description: Role-based permissions enforced for lead actions (create, assign, delete, convert).
- Tests: TC015 → Failed (blocked by R1)

---

## 3) Coverage & Metrics

- Total Tests: 15
- Passed: 0
- Failed: 15

| Requirement                  | Total | Passed | Failed |
| ---------------------------- | ----- | ------ | ------ |
| R1 Auth & Org Context        | 15    | 0      | 15     |
| R2 Leads – Create            | 2     | 0      | 2      |
| R3 Leads – Read/List/Details | 3     | 0      | 3      |
| R4 Lead Activities           | 2     | 0      | 2      |
| R5 Lead Assignment           | 3     | 0      | 3      |
| R6 Lead Deletion             | 2     | 0      | 2      |
| R7 Lead Conversion           | 1     | 0      | 1      |
| R8 Access Control            | 1     | 0      | 1      |

Note: All failures share a single root cause in R1; once resolved, other requirements should execute.

---

## 4) Root Cause Analysis (Primary)

- Immediate Cause: Client-side runtime error on `/dashboard/leads` due to disabled Clerk Organizations feature, causing `<OrganizationSwitcher/>` to fail.
- Technical Indicators:
  - 400 errors from Clerk environment endpoint in console logs.
  - Explicit error message in raw report indicating disabled OrganizationSwitcher feature.

---

## 5) Recommendations and Next Actions

1. Enable Clerk Organizations

- In Clerk dashboard, enable Organizations (and Organization Switcher) for the instance backing this environment.
- Verify environment keys and domain match local runtime; ensure network access.

2. Defensive Rendering for Organization Context

- Wrap usage of `<OrganizationSwitcher/>` and org-dependent logic with guards and fallbacks:
  - If organizations are disabled or no active org, default to a single-tenant flow (use `user.publicMetadata.defaultOrgId` or app-configured org) or show a clear empty-state instead of throwing.
  - Example guard (conceptual):
    - Check Clerk `organization` and `__experimental_enableClerkMiddlewareUrl` features only when available.

3. Local/Test Environment Strategy

- Provide a test mode for CI/tests to bypass OrganizationSwitcher by:
  - Using a mock or feature flag (e.g., `NEXT_PUBLIC_ENABLE_ORGS=false`) that swaps OrganizationSwitcher with a no-op selector and sets a deterministic `activeOrganizationId` in context.
  - Mock Clerk in E2E with a stable authenticated session and seeded org.

4. Health Checks Before Page Render

- Add lightweight client/server checks to surface a friendly error card if Clerk org context is unavailable, rather than triggering a rendering exception.

5. Re-run Testsprite

- After implementing the above, re-run the frontend plan to validate all lead flows (create/list/details/activity/assign/delete/convert/RBAC/responsiveness).

---

## 6) Risks

- If organizations remain disabled in some environments, lead management becomes inaccessible; implement robust fallbacks.
- Tight coupling to Clerk org features may reduce portability and complicate local/test setups.

---

## 7) Appendix

- Raw report: `testsprite_tests/tmp/raw_report.md`
- Code summary: `testsprite_tests/tmp/code_summary.json`
- Test plan: `testsprite_tests/testsprite_frontend_test_plan.json`
