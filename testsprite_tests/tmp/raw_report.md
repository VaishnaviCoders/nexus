
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** nexus
- **Date:** 2025-10-28
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Create Lead with Valid Data
- **Test Code:** [TC001_Create_Lead_with_Valid_Data.py](./TC001_Create_Lead_with_Valid_Data.py)
- **Test Error:** Testing cannot proceed because the leads dashboard page fails to load due to a client-side runtime error caused by a disabled feature 'OrganizationSwitcher'. This blocks access to the Create Lead form and lead management functionality. Please fix this issue to enable further testing.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmEkWrDDLILcSRFElsmtS6NH:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/523ce04b-5000-4597-b76c-fc89097c1c64
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Create Lead with Missing Required Fields
- **Test Code:** [TC002_Create_Lead_with_Missing_Required_Fields.py](./TC002_Create_Lead_with_Missing_Required_Fields.py)
- **Test Error:** Testing stopped due to runtime error on leads dashboard page caused by disabled OrganizationSwitcher feature. Unable to verify Create Lead form validation as the page does not load. Please resolve the issue to continue testing.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmFJT1OtO3T4wYh8bwHz8uCD:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/07132d58-d5f8-45c1-8569-69f92bbff0d8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** View Leads Table Data and UI Elements
- **Test Code:** [TC003_View_Leads_Table_Data_and_UI_Elements.py](./TC003_View_Leads_Table_Data_and_UI_Elements.py)
- **Test Error:** Testing cannot proceed because the leads dashboard page fails to load due to a runtime error caused by a disabled feature component <OrganizationSwitcher/>. Please enable the feature or fix the error to allow access to the leads dashboard and continue testing.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmD0jzQgYAIivB4quaRImAeR:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/3dc4deaa-e664-442b-9353-6d219f51b18a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** View Lead Details and Activity Timeline
- **Test Code:** [TC004_View_Lead_Details_and_Activity_Timeline.py](./TC004_View_Lead_Details_and_Activity_Timeline.py)
- **Test Error:** Testing stopped due to critical runtime error on leads dashboard page preventing access to lead details. Issue reported for resolution.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmKOp2pJR7vs8TxDzZvepysZ:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/13aa1cc1-db89-47cf-aaca-7e1e469407a1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Add Lead Activity via Popover/Modal
- **Test Code:** [TC005_Add_Lead_Activity_via_PopoverModal.py](./TC005_Add_Lead_Activity_via_PopoverModal.py)
- **Test Error:** Testing stopped due to runtime error blocking the leads dashboard page. Cannot proceed with lead activity creation verification. Issue reported.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmItGs8rNnG1S1ZzGut85RP7:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/d476d4b9-b470-4c9a-8436-1d1f3dfd871d
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Assign Lead to Counsellor and Notification
- **Test Code:** [TC006_Assign_Lead_to_Counsellor_and_Notification.py](./TC006_Assign_Lead_to_Counsellor_and_Notification.py)
- **Test Error:** The leads dashboard page cannot be tested further because it shows a runtime error related to a disabled feature flag for organizations. Please enable the 'organizations' feature flag at dashboard.clerk.com to allow the leads page to render properly. Once enabled, reload the leads page and continue with the lead assignment verification steps: navigate to a lead details page, open the assign lead dialog, select a counsellor and confirm assignment, then verify database update, UI update, and notification sending. Without enabling this feature, the test cannot proceed.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmFV8YZzGPjhAt9l1k8ibEze:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/00a4bf36-fcf4-452a-bb71-8b8f31cfd0f8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Unassign Lead from Counsellor
- **Test Code:** [TC007_Unassign_Lead_from_Counsellor.py](./TC007_Unassign_Lead_from_Counsellor.py)
- **Test Error:** Testing cannot proceed due to application error on leads dashboard page related to disabled Clerk feature 'OrganizationSwitcher'. Please enable the feature to continue testing unassign lead functionality.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmIrmKEh18WiUcHhsonImYAF:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/ffd76992-0a0f-4533-8dd0-2e500519b41e
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Single Lead Deletion with Confirmation and Role-based Permission
- **Test Code:** [TC008_Single_Lead_Deletion_with_Confirmation_and_Role_based_Permission.py](./TC008_Single_Lead_Deletion_with_Confirmation_and_Role_based_Permission.py)
- **Test Error:** Testing cannot proceed due to a critical runtime error on the leads dashboard page caused by the disabled <OrganizationSwitcher/> feature. This prevents verifying the lead deletion functionality. Please resolve this issue and retry.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmGfBkWWfu51wuIrW2VBgW9q:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/f2029752-868b-4e95-b8fb-96208947f8a2
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Bulk Delete Leads with Confirmation and Role-based Permission
- **Test Code:** [TC009_Bulk_Delete_Leads_with_Confirmation_and_Role_based_Permission.py](./TC009_Bulk_Delete_Leads_with_Confirmation_and_Role_based_Permission.py)
- **Test Error:** Testing stopped due to critical runtime error on leads dashboard page preventing access to leads management features and bulk delete functionality. Issue reported for developer fix.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmGUHs9vivaVCIykTavRyg4W:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/6b5aa85a-f6de-46e4-9ef9-f82e9d84e7fe
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Lead Assignment Notification Trigger
- **Test Code:** [TC010_Lead_Assignment_Notification_Trigger.py](./TC010_Lead_Assignment_Notification_Trigger.py)
- **Test Error:** Testing cannot proceed due to a runtime error blocking access to the leads dashboard. The feature toggle for organizations is disabled, causing the <OrganizationSwitcher/> component to fail rendering. Please enable the feature to continue testing lead assignment notification functionality.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmt4FgaiTn262a0KubTW8TT8:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/b6a22d61-c9bf-48f4-963b-c56183dbb684
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** UI Responsiveness and Element Integrity on Supported Devices
- **Test Code:** [TC011_UI_Responsiveness_and_Element_Integrity_on_Supported_Devices.py](./TC011_UI_Responsiveness_and_Element_Integrity_on_Supported_Devices.py)
- **Test Error:** Testing stopped due to critical runtime error on leads dashboard page caused by disabled 'OrganizationSwitcher' feature. Unable to verify lead management UI components as the page does not load. Please enable the feature to proceed with testing.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqn2T8ZJd37yM1etrnCXZQ2dZ:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/5c48d636-af30-44ba-9a94-00497e686d06
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Lead Activity Data Validation and Error Handling
- **Test Code:** [TC012_Lead_Activity_Data_Validation_and_Error_Handling.py](./TC012_Lead_Activity_Data_Validation_and_Error_Handling.py)
- **Test Error:** Testing stopped due to client-side application error on lead dashboard page related to disabled 'OrganizationSwitcher' feature. Cannot proceed with lead activity creation validation tests.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmwVqK0cavFd5eGOvOUs0YOq:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/8bc34162-62c8-4a84-ba52-70adc51fdbb9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Leads Table Sorting Stability on Edge Data
- **Test Code:** [TC013_Leads_Table_Sorting_Stability_on_Edge_Data.py](./TC013_Leads_Table_Sorting_Stability_on_Edge_Data.py)
- **Test Error:** Testing cannot proceed because the leads dashboard page fails to load due to a runtime error caused by a disabled <OrganizationSwitcher/> feature component. Please enable the feature or fix the issue to allow testing of leads table sorting behavior.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmyCPl0Bqbi3Tpvt5jx5WFWG:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/c6d0ac16-499f-4c94-898e-6411178032f8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Database Consistency After Lead Conversion
- **Test Code:** [TC014_Database_Consistency_After_Lead_Conversion.py](./TC014_Database_Consistency_After_Lead_Conversion.py)
- **Test Error:** Testing cannot proceed due to a runtime error blocking access to the leads dashboard. The feature required for organization switching is disabled. Please enable the feature to allow testing of lead conversion and related flows.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmtVEvryzG6yr1PXZX2ivS5z:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/07848c79-5436-41bb-bb10-3964976a3736
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Access Control Enforcement on Lead Management Actions
- **Test Code:** [TC015_Access_Control_Enforcement_on_Lead_Management_Actions.py](./TC015_Access_Control_Enforcement_on_Lead_Management_Actions.py)
- **Test Error:** Testing stopped due to dashboard runtime error caused by disabled 'OrganizationSwitcher' feature. Unable to verify role-based access control on leads until issue is resolved.
Browser Console Logs:
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.accounts.dev/_next/static/chunks/pages/_app-6a6202ecbd434e92.js:19:276)
[WARNING] Clerk: Clerk has been loaded with development keys. Development instances have strict usage limits and should not be used when deploying your application to production. Learn more: https://clerk.com/docs/deployments/overview (at https://main-raven-63.clerk.accounts.dev/npm/@clerk/clerk-js@5/dist/clerk.browser.js:18:1328)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://main-raven-63.clerk.accounts.dev/v1/environment?__clerk_api_version=2025-04-10&_clerk_js_version=5.102.1&_method=PATCH&__clerk_db_jwt=dvb_34gqmuYQ3jn6ah1n5OiquIEF9bo:0:0)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/ef048c9d-aa44-4d10-9f96-7831c0b2c3cf/3866d933-3d7d-4153-a086-dd464e773ca4
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **0.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---